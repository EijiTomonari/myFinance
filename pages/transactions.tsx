import {
    CircularProgress,
    Flex,
    Heading,
    Link,
    Text,
    Button,
    Table,
    Thead,
    Tr,
    Th,
    Tbody
} from '@chakra-ui/react';
import {GetServerSideProps, GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType, NextPage} from 'next';
import {signOut, useSession} from 'next-auth/react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import React from 'react'
import * as Icon from 'react-feather';

type Transaction = {
    date: Date,
    value: number,
    name: string,
    installment: number,
    installments: string,
    category: string
}

// export const getServerSideProps = async (context: { req: any; }) => {
//     const { db } = await connectToDatabase(context.req);
//     const transactions = await db
//       .collection('transactions')
//       .find({})
//       .toArray();

//       console.log(transactions)

//     return {
//         props: {
//             results: JSON.parse(JSON.stringify(transactions))
//         }
//     };
// }


const Transactions:NextPage = ({results} : InferGetStaticPropsType<typeof getStaticProps>) => {

    const router = useRouter();

    console.log(results)

    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            router.replace('/signin')
        }
    })

    if (status === "loading") {

        return (<Flex bgGradient='linear(to-l, #7928CA, #FF0080)' width='full' minH='100vh' align='center' justifyContent='center'>
            <CircularProgress isIndeterminate color='green.300'/>
        </Flex>)
    }


    return (<Flex h="100vh" flexDir='row' overflow="hidden" maxW="2000px">
        <Head>
            <title>MyFinance</title>
        </Head>
        <SideBar session={session}/>
        <Table>
            <Thead>
                <Tr>
                    <Th>Date</Th>
                    <Th>Name</Th>
                    <Th>Installments</Th>
                    <Th>Category</Th>
                    <Th>Value</Th>
                </Tr>
            </Thead>
            {/* <Tbody> 
                {data.map((transaction:Transaction) => (
          <Tr>
            <Td>{transaction.date}</Td>
            <Td>{transaction.name}</Td>
            <Td>{transaction.installment}</Td>
          </Tr>
        ))} 
        </Tbody> */}
        </Table>
        <Text> {results}</Text>
        <Text>Funcionou?</Text>
    </Flex>)
}

const SideBar = (params : any) => {
    return (<Flex width="15%" flexDir="column" alignItems="center" backgroundColor="#020202" color="white" justifyContent='space-between'>

        <Flex flexDir="column" as="nav">
            <Heading size="lg"
                mt={50}
                mb={100}
                alignSelf="center"
                letterSpacing="tight">MyFinance</Heading>
            <Flex flexDir="column" align="flex-start" justifyContent="center">
                <Flex className='side-bar-item'>
                    <Link href='/'>
                        <Icon.Home fontSize="2xl"/>
                    </Link>
                    <Link href='/'
                        _hover={
                            {textDecor: 'none'}
                    }>
                        <Text>Home</Text>
                    </Link>
                </Flex>
                <Flex className='side-bar-item'>
                    <Link href='/transactions'>
                        <Icon.DollarSign fontSize="2xl" className="active-icon"/>
                    </Link>
                    <Link href='/transactions'
                        _hover={
                            {textDecor: 'none'}
                    }>
                        <Text className='active-text'>Transactions</Text>
                    </Link>
                </Flex>
                <Flex className='side-bar-item'>
                    <Link>
                        <Icon.CreditCard fontSize="2xl"/>
                    </Link>
                    <Link _hover={
                        {textDecor: 'none'}
                    }>
                        <Text>Cards</Text>
                    </Link>
                </Flex>
            </Flex>
        </Flex>
        <Flex flexDir="column">
            <Text fontSize="small" alignSelf="center">Signed in as</Text>
            <Text fontSize="small"
                mb={5}> {
                params.session ?. user ?. email
            }</Text>
            <Button mb={5}
                alignSelf="center"
                backgroundColor="gray"
                size="xs"
                width="50%"
                onClick={
                    () => signOut({callbackUrl: 'http://localhost:3000/signin'})
            }>Sign Out</Button>
        </Flex>
    </Flex>)
}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            results: [1, 2, 3]
        }
    }
}

export default Transactions
