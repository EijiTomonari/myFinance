import { Flex, Heading, Text } from '@chakra-ui/react'
import { useSession, signIn, signOut } from "next-auth/react"
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

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
        <>
            Signed in as {session?.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
        </>
    )


}

export default Home

