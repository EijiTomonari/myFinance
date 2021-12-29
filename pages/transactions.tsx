import { CircularProgress, Flex, Heading, Link, Text,Button } from '@chakra-ui/react';
import { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react'
import * as Icon from 'react-feather';

const Transactions:NextPage=()=> {
    
    const router = useRouter();

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
                        <Link href='/' _hover={
                            {textDecor: 'none'}
                        }>
                            <Text>Home</Text>
                        </Link>
                    </Flex>
                    <Flex className='side-bar-item'>
                        <Link href='/transactions'>
                            <Icon.DollarSign fontSize="2xl" className="active-icon"/>
                        </Link>
                        <Link href='/transactions' _hover={
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
