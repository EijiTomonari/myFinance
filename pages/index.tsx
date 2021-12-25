import { Button, Flex, Heading, Link, Text } from '@chakra-ui/react'
import { useSession, signIn, signOut } from "next-auth/react"
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import Head from 'next/head';
import * as Icon from 'react-feather';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    scales:{
        x:{
            grid:{
                display:false
            }
        }
    },
    plugins: {
      legend: {
        display:false,
      },
      title: {
        display: true,
        text: 'Expenses History',
      },
    },
  };
  
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];
  
  export const data = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        lineTension:0.5,
        data: [10000,7532,4843,6473,2563],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

const Home: NextPage = () => {
    const router = useRouter();

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace('/signin')
        }
    })

    if (status === "loading") {

        return (
            <Flex bgGradient='linear(to-l, #7928CA, #FF0080)' width='full' minH='100vh' align='center' justifyContent='center'>
                <CircularProgress isIndeterminate color='green.300' />
            </Flex>
        )
    }


    return (
        <Flex h="100vh" flexDir='row' overflow="hidden" maxW="2000px">
            <Head>
                <title>MyFinance</title>
            </Head>
            <SideBar session={session}/>
            <MiddleSection/>
            <RightSection/>
        </Flex>
    )


}

const SideBar = (params:any) =>{
    return(
        <Flex width="15%" flexDir="column" alignItems="center" backgroundColor="#020202" color="white" justifyContent='space-between'>

                <Flex flexDir="column" as="nav">
                    <Heading size="lg" mt={50} mb={100} alignSelf="center" letterSpacing="tight">MyFinance</Heading>
                    <Flex flexDir="column" align="flex-start" justifyContent="center">
                        <Flex className='side-bar-item'>
                            <Link>
                                <Icon.Home fontSize="2xl" className="active-icon" />
                            </Link>
                            <Link _hover={{ textDecor: 'none' }}>
                                <Text className='active-text'>Home</Text>
                            </Link>
                        </Flex>
                        <Flex className='side-bar-item'>
                            <Link>
                                <Icon.DollarSign fontSize="2xl" />
                            </Link>
                            <Link _hover={{ textDecor: 'none' }}>
                                <Text >Transactions</Text>
                            </Link>
                        </Flex>
                        <Flex className='side-bar-item'>
                            <Link>
                                <Icon.CreditCard fontSize="2xl" />
                            </Link>
                            <Link _hover={{ textDecor: 'none' }}>
                                <Text >Cards</Text>
                            </Link>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex flexDir="column">
                    <Text fontSize="small" alignSelf="center">Signed in as</Text>
                    <Text fontSize="small" mb={5}>{params.session?.user?.email}</Text>
                    <Button mb={5} alignSelf="center" backgroundColor="gray" size="xs" width="50%" onClick={() => signOut({ callbackUrl: 'http://localhost:3000/signin' })}>Sign Out</Button>
                </Flex>
            </Flex>
    )
}

const MiddleSection = () =>{
    return(
        <Flex width="55%" p="3%" flexDir="column" overflow="auto" minH="100vh">
            <Heading mb={4} fontWeight="light" fontSize="3xl">Dashboard</Heading>
            <Text fontSize="sm">Month expenses</Text>
            <Text fontSize="2xl" fontWeight="bold">R$ 2.000,00</Text>
            <Line options={options} data={data} />
        </Flex>
    )
}

const RightSection = () =>{
    return(
        <Flex width="35%" backgroundColor="#f5f5f5" overflow="auto" flexDir="column" p="3%">

        </Flex>
    )
}

export default Home

{/* <Text>Signed in as {session?.user?.email}</Text>
 */}

