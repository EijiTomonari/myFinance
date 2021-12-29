import {
    Button,
    Flex,
    Heading,
    Input,
    Link,
    Text,
    Select,
    Table,
    Th,
    Td,
    Tr,
    Thead,
    Tbody
} from '@chakra-ui/react'
import {useSession, signIn, signOut} from "next-auth/react"
import type {NextPage}
from 'next'
import {useRouter} from "next/router";
import {CircularProgress, CircularProgressLabel} from '@chakra-ui/react'
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
    ArcElement
} from 'chart.js';
import {Doughnut, Line} from 'react-chartjs-2';
import mastercardlogo from '../public/mastercard.png'
import visalogo from "../public/visalogo.png";
import {Image} from '@chakra-ui/react'

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
            display: false
        },
        title: {
            display: false
        }
    }
};

export const donutOptions = {
    plugins: {
        legend: {
            position: 'right' as const,
                fullSize: true,
                labels: {
                    padding: 10
                }
            }
        }
    }

    const labels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    export const data = {
        labels,
        datasets: [
            {
                label: 'Expenses',
                lineTension: 0.5,
                data: [
                    10000,
                    7532,
                    4843,
                    6473,
                    2563
                ],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
        ]
    };

    export const donutData = {
        labels: [
            'Travel',
            'Rent',
            'Food',
            'Transport',
            'Shopping',
            'Education'
        ],
        datasets: [
            {
                data: [
                    12,
                    19,
                    3,
                    5,
                    2,
                    3
                ],
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
                borderWidth: 1
            },
        ]
    };

    type CreditCardData = {
        lastFourDigits: number,
        name: string,
        validThru: string,
        company: string,
        nickname: string
    }

    export const mastercardDummyData: CreditCardData = {
        lastFourDigits: 4435,
        name: "Gabriel M Tomonari",
        validThru: "02/28",
        company: "MasterCard",
        nickname: "LatamPass"
    }

    export const visaDummyData: CreditCardData = {
        lastFourDigits: 4435,
        name: "Gabriel M Tomonari",
        validThru: "02/28",
        company: "Visa",
        nickname: "Pão de Açúcar"
    }

    const Home: NextPage = () => {
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
                <MiddleSection/>
                <RightSection/>
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
                                <Icon.Home fontSize="2xl" className="active-icon"/>
                            </Link>
                            <Link href='/' _hover={
                                {textDecor: 'none'}
                            }>
                                <Text className='active-text'>Home</Text>
                            </Link>
                        </Flex>
                        <Flex className='side-bar-item'>
                            <Link href='/transactions'>
                                <Icon.DollarSign fontSize="2xl"/>
                            </Link>
                            <Link href='/transactions' _hover={
                                {textDecor: 'none'}
                            }>
                                <Text>Transactions</Text>
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

    const MiddleSection = () => {
        return (
            <Flex width="55%" p="3%" flexDir="column" overflow="auto">
                <Heading mb={4}
                    fontWeight="light"
                    fontSize="3xl">Dashboard</Heading>
                <Flex flexDir='row' justifyContent='space-between' align='flex-end'>
                    <Flex flexDir='column' backgroundColor='#edeaea'
                        padding={5}
                        borderRadius='10px'>
                        <Text fontSize="sm">December expenses</Text>
                        <Text fontSize="2xl" fontWeight='black'>R$ 2.000,00</Text>
                    </Flex>
                    <Flex flexDir='column' backgroundColor='#edeaea'
                        padding={5}
                        borderRadius='10px'>
                        <Text fontSize='sm'>Third-party expenses</Text>
                        <Text fontSize='2xl' fontWeight="bold">R$ 2.000,00</Text>
                    </Flex>
                    <Flex flexDir='column' backgroundColor='#edeaea'
                        padding={5}
                        borderRadius='10px'>
                        <Text fontSize="sm">Next month installments</Text>
                        <Text fontSize="2xl" fontWeight="bold">R$ 2.000,00</Text>
                    </Flex>
                </Flex>
                <Flex flexDirection='row' justifyContent='space-around' maxH='320px'>
                    <Flex width="45%" flexDirection="column" >
                        <Heading mt={8}
                            mb={4}
                            size="small">Info</Heading>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Value</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>Purchases in installments</Td>
                                    <Td>5</Td>
                                </Tr>
                                <Tr>
                                    <Td>Available limit: Latam</Td>
                                    <Td>2000</Td>
                                </Tr>
                                <Tr>
                                    <Td>Available limit: Pão de Açúcar</Td>
                                    <Td>2000</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Flex>
                    <Flex width="48%" flexDirection="column">
                        <Heading mt={8}
                            mb={4}
                            size="small">Expenses per category</Heading>
                        <Doughnut data={donutData}
                            options={donutOptions}/>
                    </Flex>
                </Flex>
                <Heading mt={8}
                    mb={4}
                    size="small">Expenses history</Heading>
                <Line options={options}
                    data={data}/>
            </Flex>
        )
    }

    const RightSection = () => {
        return (
            <Flex width="35%" backgroundColor="#f5f5f5" overflow="auto" flexDir="column" p="3%">
                <Heading mb={4}
                    fontWeight="light"
                    fontSize="3xl">Credit Cards</Heading>
                <Flex>
                    <Table className='credit-card-table'>
                        <Tr className='active-card'>
                            <Text>Show all cards</Text>
                        </Tr>
                        <Tr>
                            <CreditCardModel creditCardData={mastercardDummyData}/>
                        </Tr>
                        <Tr>
                            <CreditCardModel creditCardData={visaDummyData}/>
                        </Tr>
                    </Table>
                </Flex>
            </Flex>
        )
    }

    const CreditCardModel = (params : {
        creditCardData: CreditCardData
    }) => {
        return (
            <Flex boxShadow='2xl' width="80%" height="10em" maxW='260px'
                bgGradient={
                    params.creditCardData.company == "MasterCard" ? 'linear(to-br,#A63097,#833BAC)' : 'linear(to-br,#1E7FB7,#1E3B80)'
                }
                borderRadius="10px"
                flexDirection="column"
                justifyContent="space-around"
                color="white">
                <Flex flexDir='row' justifyContent='space-between'>
                    <Text ml={5}>
                        {
                        params.creditCardData.nickname
                    }</Text>
                    <Image mr={5}
                        src={
                            params.creditCardData.company == "MasterCard" ? mastercardlogo.src : visalogo.src
                        }
                        layout='fixed'
                        width={50}
                        height={30}
                        objectFit='contain'
                        alignSelf='end'></Image>
                </Flex>
                <Flex ml={5}
                    flexDirection="column">
                    <Text fontWeight="bold">
                        {
                        "•••• •••• •••• " + params.creditCardData.lastFourDigits.toString()
                    }</Text>
                    <Flex flexDirection="row" justifyContent='space-between'>
                        <Text fontSize='small'>
                            {
                            params.creditCardData.name
                        }</Text>
                        <Text fontSize='small'
                            mr={5}>
                            {
                            params.creditCardData.validThru
                        }</Text>
                    </Flex>
                </Flex>
            </Flex>
        )
    }

    export default Home
