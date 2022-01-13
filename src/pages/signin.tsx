import type {NextPage}
from 'next'
import {signIn, SignInResponse, useSession} from "next-auth/react"
import {useState, useEffect, FormEvent} from "react";
import Head from 'next/head'
import {
    FormControl,
    FormLabel,
    Flex,
    Input,
    Heading,
    Button,
    Box,
    Alert,
    AlertIcon
} from '@chakra-ui/react'
import {useRouter} from 'next/router';

const SignIn: NextPage = () => { // Checks if user is already authenticated. If so, redirects to homepage

    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [signinstatus, setSigninstatus] = useState < SignInResponse > ()
    const [error, seterror] = useState < string | undefined > (undefined)
    const router = useRouter()

    useEffect(() => {
        if (signinstatus ?. ok) {
            router.replace('/')
        } else {
            seterror(signinstatus ?. error)
        }
    }, [signinstatus])

    const HandleSubmit = async (event : FormEvent < HTMLFormElement >) => {
        event.preventDefault()
        const status = await signIn('credentials', {
            email: username,
            password: password,
            redirect: false
        });
        setSigninstatus(status)
    }

    return (
        <Flex bgGradient='linear(to-l, #7928CA, #FF0080)' width='full' minH='100vh' align='center' justifyContent='center'>
            <Head>
                <title>MyFinance - Sign In</title>
            </Head>
            <Box borderWidth={1}
                borderRadius={4}
                px={7}
                py={4}
                width='80%'
                maxWidth='500px'
                boxShadow='dark-lg'
                backgroundColor='white'>
                <Box textAlign='center'>
                    <Heading as='h1' size='2xl'>MyFinance</Heading>
                </Box>
                <Box>
                    <form onSubmit={HandleSubmit}>
                        <FormControl>
                            <FormLabel id='form-label-1' htmlFor='form-input-1'>Email</FormLabel>
                            <Input required id='form-input-1' type='email' placeholder='Email address'
                                onChange={
                                    (e) => setusername(e.target.value)
                            }></Input>
                        </FormControl>
                        <Box p={2}></Box>
                        <FormControl>
                            <FormLabel id='form-label-2' htmlFor='form-input-2'>Password</FormLabel>
                            <Input required id='form-input-2' type='password' placeholder='Password'
                                onChange={
                                    (e) => setpassword(e.target.value)
                            }></Input>
                        </FormControl>
                        <Button width='full'
                            mt={4}
                            type='submit'>Sign In</Button>
                    </form>
                    {
                    error && <Alert mt={4}
                        status='error'>
                        <AlertIcon/>Wrong email or password</Alert>
                } </Box>
            </Box>
        </Flex>
    )
}

export default SignIn
