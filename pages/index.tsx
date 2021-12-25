import { Button, Flex, Heading, Input, Link, Text, Select, Table, Th, Td, Tr } from '@chakra-ui/react'
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
    ArcElement,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
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
    scales: {
        x: {
            grid: {
                display: false
            }
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Expenses',
            lineTension: 0.5,
            data: [10000, 7532, 4843, 6473, 2563],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
    ],
};

export const donutData = {
    labels: ['Travel', 'Rent', 'Food', 'Transport', 'Shopping', 'Education'],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

type CreditCardData={
    lastFourDigits:number,
    name:string,
    validThrough:Date,
    company:string
}

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
            <SideBar session={session} />
            <MiddleSection />
            <RightSection />
        </Flex>
    )


}

const SideBar = (params: any) => {
    return (
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

const MiddleSection = () => {
    return (
        <Flex width="55%" p="3%" flexDir="column" overflow="auto" minH="100vh">
            <Heading mb={4} fontWeight="light" fontSize="3xl">Dashboard</Heading>
            <Text fontSize="sm">December expenses</Text>
            <Text fontSize="2xl" fontWeight="bold">R$ 2.000,00</Text>
            <Heading mt={8} mb={4} size="small">Expenses per category</Heading>
            <Flex width="60%" flexDirection="column">
                <Doughnut data={donutData} />
            </Flex>
            <Heading mt={8} mb={4} size="small">Expenses history</Heading>
            <Line options={options} data={data} />
        </Flex>
    )
}

const RightSection = () => {
    return (
        <Flex width="35%" backgroundColor="#f5f5f5" overflow="auto" flexDir="column" p="3%">
        <Heading mb={4} fontWeight="light" fontSize="3xl">Credit Cards</Heading>
        <Flex>
            <Table>
                <Tr>
                    <Text>Show all cards</Text>
                </Tr>
                <Tr>
                    <Text>Credit Card</Text>
                </Tr>
            </Table>
        </Flex>
        </Flex>
    )
}

const CreditCardModel = (params:CreditCardData) => {
    return(
        <Flex>
            <Text>Last 4 digits:</Text>
        </Flex>
    )
}

export default Home
