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
    Input,
    InputGroup,
    InputLeftAddon,
    Select
} from '@chakra-ui/react';
import {CalendarIcon} from '@chakra-ui/icons'
import {GetServerSideProps, GetStaticProps, InferGetServerSidePropsType, NextPage} from 'next';
import {signOut, useSession} from 'next-auth/react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import React, {useState} from 'react'
import * as Icon from 'react-feather';
import connectToDatabase from "../lib/mongodb";
import {CreditCardData} from '.';
import {Category} from '../components/types';

type Transaction = {
    date: Date,
    value: number,
    name: string,
    installment?: number,
    installments?: number,
    category?: string
}

const Transactions: NextPage = ({cardsData, categoriesData} : InferGetServerSidePropsType < typeof getServerSideProps >) => {

    const router = useRouter();
    const [csvFile, setCsvFile] = useState < File | undefined > (undefined);
    const [csvArray, setCsvArray] = useState<Transaction[]>([]);

    const processCSV = (str:string, delim=',') => {
        const headers = str.slice(0,str.indexOf('\n')).split(delim);
        const rows = str.slice(str.indexOf('\n')+1).split('\n');

        const newArray:Transaction[] = rows.map( row => {
            const values = row.split(delim);
            const object:Transaction = {
                date: new Date(values[0]),
                name:values[1],
                value: parseFloat(values[2]),
                category:"Uncategorized",
                installment:0,
                installments:0,
            }
            return object;
        })
        console.log(newArray)
        setCsvArray(newArray)
    }

    const submit = () => {
        const file = csvFile;
        const reader = new FileReader();

        reader.onload = function (e) {
            const text = e.target!.result as string;
            console.log(text);
            processCSV(text)
        }

        reader.readAsText(file !);
    }

    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            router.replace('/signin')
        }
    })

    if (status === "loading") {

        return (
            <Flex bgGradient='linear(to-l, #7928CA, #FF0080)' width='full' minH='100vh' align='center' justifyContent='center'>
                <CircularProgress isIndeterminate color='green.300'/>
            </Flex>
        )
    }


    return (
        <Flex h="100vh" flexDir='row' overflow="hidden" maxW="2000px">
            <Head>
                <title>MyFinance</title>
            </Head>
            <SideBar session={session}/>
            <Flex flexDirection='column'
                p={10}>
                <Heading>Add transactions</Heading>
                <Flex py={5}
                    flexDir='column'>
                    <Heading size='lg' fontWeight='normal'>Single add</Heading>
                    <form>
                        <InputGroup>
                            <InputLeftAddon children='R$'/>
                            <Input type='number' placeholder='Value'/>
                        </InputGroup>
                        <InputGroup>
                            <InputLeftAddon pointerEvents='none'
                                children={
                                    <CalendarIcon
                                color='gray.300'/>
                                }/>
                            <Input type='date' placeholder='Value'/>
                        </InputGroup>
                        <Select placeholder='Select Category'>
                            {
                            categoriesData.map((cat : Category) => (
                                <option value={
                                    cat.name
                                }>
                                    {
                                    cat.name
                                }</option>
                            ))
                        } </Select>
                        <Select placeholder='Select Card'>
                            {
                            cardsData.map((card : CreditCardData) => (
                                <option value={
                                    card.lastfourdigits
                                }>
                                    {
                                    card.lastfourdigits + " - " + card.nickname
                                }</option>
                            ))
                        } </Select>
                        <Flex alignContent='space-between'>
                            <Input type='number' placeholder='Installment'/>
                            <Text>of</Text>
                            <Input type='number' placeholder='Installments'/>
                        </Flex>
                        <Button type='submit'
                            py={4}
                            px={7}>Add</Button>
                    </form>
                </Flex>
                <Flex py={5}
                    flexDir='column'>
                    <Heading size='lg' fontWeight='normal'>Batch add</Heading>
                    <form>
                        <Select placeholder='Select Card'>
                            {
                            cardsData.map((card : CreditCardData) => (
                                <option value={
                                    card.lastfourdigits
                                }>
                                    {
                                    card.lastfourdigits + " - " + card.nickname
                                }</option>
                            ))
                        } </Select>
                        <Input type='file' accept='.csv' id='csvFile'
                            onChange={
                                (e) => {
                                    setCsvFile(e.target.files ![0])
                                }
                        }></Input>
                    <Button onClick={
                        (e) => {
                            e.preventDefault()
                            if (csvFile) 
                                submit()       
                        }
                    }>Send file</Button>
                </form>
            </Flex>
        </Flex>
    </Flex>
    )
}

const SideBar = (params : any) => {
    return (
        <Flex width="15%" flexDir="column" alignItems="center" backgroundColor="#020202" color="white" justifyContent='space-between'>

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
                    mb={5}>
                    {
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
        </Flex>
    )
}

export default Transactions

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {db} = await connectToDatabase(context.req);
    const cards = await db.collection('cards').find({}).toArray();
    const categories = await db.collection('categories').find({}).toArray();

    return {
        props: {
            cardsData: JSON.parse(JSON.stringify(cards)),
            categoriesData: JSON.parse(JSON.stringify(categories))
        }
    }
}
