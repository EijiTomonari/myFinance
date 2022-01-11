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
    Tbody,
    Td,
    Tooltip,
    Select,
    Checkbox,
    useToast
} from '@chakra-ui/react';
import {GetServerSideProps, GetStaticProps, InferGetServerSidePropsType, NextPage} from 'next';
import {signOut, useSession} from 'next-auth/react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import React, {useState} from 'react'
import * as Icon from 'react-feather';
import {DeleteIcon, EditIcon, AddIcon} from '@chakra-ui/icons';
import connectToDatabase from "../../lib/mongodb";
import {Category, TestType, Transaction} from '../../components/types';


export const getServerSideProps: GetServerSideProps = async (context : {
    req: any;
}) => {
    const {db} = await connectToDatabase(context.req);
    const transactionsData = await db.collection('transactions').find({}).toArray();
    const categoriesData = await db.collection('categories').find({}).toArray();

    return {
        props: {
            transactions: JSON.parse(JSON.stringify(transactionsData)),
            categories: JSON.parse(JSON.stringify(categoriesData))
        }
    };
}


const Transactions: NextPage = ({transactions, categories} : InferGetServerSidePropsType < typeof getServerSideProps >) => {

    const router = useRouter()
    const toast = useToast()
    const [categorychanger, setCategorychanger] = useState < string > ("Uncategorized")

    const updateTransactionCategory = async (id : string | undefined, newcategory : string | undefined) => {
        try {
            let response = await fetch('/api/transactions', {
                method: 'PUT',
                body: JSON.stringify({_id:id, category:newcategory})
            })
            let data = await response.json();
            if (data.success) {
                return(toast({
                    title: "OK",
                    description: "Category changed",
                    status: 'success',
                    duration: 1000,
                    isClosable: true
                }))
            } else {
                return(toast({
                    title: "Something went wrong",
                    description: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                }))
            }
        } catch (error) {
            return(toast({
                title: "Something went wrong",
                description: error as string,
                status: 'error',
                duration: 2000,
                isClosable: true
            }))
        }
    }

    const deleteTransaction = async (id:string|undefined) => {
        try {
            let response = await fetch('/api/transactions',{
                method: 'DELETE',
                body: JSON.stringify({_id:id})
            })
            let data = await response.json();
            if (data.success) {
                return(toast({
                    title: "OK",
                    description: "Transaction deleted",
                    status: 'success',
                    duration: 1000,
                    isClosable: true
                }))
            } else {
                return(toast({
                    title: "Something went wrong",
                    description: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                }))
            }
        } catch (error) {
            return(toast({
                title: "Something went wrong",
                description: error as string,
                status: 'error',
                duration: 2000,
                isClosable: true
            }))
        }
    }
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
        <Flex flexDir='column' overflowY='auto'>
            <Heading mb={2}
                ml={4}
                mt={4}
                fontWeight="light"
                fontSize="3xl">Transactions</Heading>
            <Link href='/transactions/add'>
                <Button leftIcon={<AddIcon/>}
                    backgroundColor='green.200'
                    py={4}
                    px={7}
                    my={4}
                    ml={4}>Add Transactions</Button>
            </Link>
            <Table variant='striped' width='max' size='sm'
                ml={4}>
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Name</Th>
                        <Th>Installment</Th>
                        <Th>Total Installments</Th>
                        <Th>Category</Th>
                        <Th>Third-party</Th>
                        <Th>Value</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody fontSize='smaller'> {
                    transactions.map((transaction : Transaction) => {
                        return (<Tr>
                            <Td> {
                                new Date(transaction.date).toLocaleDateString("pt-BR")
                            }</Td>
                            <Td> {
                                transaction.name
                            }</Td>
                            <Td textAlign='center'> {
                                transaction.installment
                            }</Td>
                            <Td textAlign='center'> {
                                transaction.installments
                            }</Td>
                            <Td>
                                <Select onChange={
                                    (e) => {
                                        setCategorychanger(e.target.value)
                                        updateTransactionCategory(transaction._id, categorychanger)
                                    }
                                }>
                                    <option value={
                                        transaction.category
                                    }> {
                                        transaction.category
                                    }</option>
                                    {
                                    categories.map((category : Category) => {
                                        return (<option value={category.name}> {
                                            category.name
                                        }</option>)
                                    })
                                } </Select>
                            </Td>
                            <Td textAlign='center'>
                                <Checkbox alignSelf='center'></Checkbox>
                            </Td>
                            <Td> {
                                "R$ " + transaction.value
                            }</Td>
                            <Td>
                                <Flex flexDir='row'>
                                    <Tooltip label='Edit'>
                                        <Button name='Edit' colorScheme='yellow'><EditIcon/></Button>
                                    </Tooltip>
                                    <Tooltip label='Delete'>
                                        <Button ml={2} onClick={(e)=> {
                                            e.preventDefault()
                                            deleteTransaction(transaction._id)
                                        }}
                                            colorScheme='red'><DeleteIcon/></Button>
                                    </Tooltip>
                                </Flex>
                            </Td>
                        </Tr>);
                    })
                } </Tbody>
            </Table>
        </Flex>
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

export default Transactions
