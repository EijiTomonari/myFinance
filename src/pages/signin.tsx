import type { NextPage } from 'next'
import { signIn, useSession } from "next-auth/react"
import { useState, useEffect, FormEvent } from "react";
import Head from 'next/head'
import { FormControl, FormLabel, Flex, Input, Heading, Button, Box, Alert, AlertIcon, CircularProgress } from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router';

const signInStatusAtom = atom({ error: "", ok: false })

type Credentials = {
  email: string,
  password: string
}

const SignIn: NextPage = () => {

  const router = useRouter();

  const { data: session, status } = useSession({
    required: false,
  })

  if (status === "loading") {

    return (
      <Flex bgGradient='linear(to-l, #7928CA, #FF0080)' width='full' minH='100vh' align='center' justifyContent='center'>
        <CircularProgress isIndeterminate color='green.300' />
      </Flex>
    )
  } else if (status === "authenticated") {
    router.replace('/')
  }

  return (
    <Flex bgGradient='linear(to-l, #7928CA, #FF0080)' width='full' minH='100vh' align='center' justifyContent='center'>
      <Head>
        <title>MyFinance - Sign In</title>
      </Head>
      <Box
        borderWidth={1}
        borderRadius={4}
        px={7}
        py={4}
        width='80%'
        maxWidth='500px'
        boxShadow='dark-lg'
        backgroundColor='white'
      >
        <LoginHeader />
        <LoginForm />
      </Box>
    </Flex>
  )
}

const LoginHeader = () => {
  return (
    <Box textAlign='center'>
      <Heading as='h1' size='2xl'>MyFinance</Heading>
    </Box>
  )
}

const LoginForm = () => {

  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [signInStatus, setsignInStatus] = useAtom(signInStatusAtom)

  const router = useRouter();

  useEffect(() => {
    if (signInStatus.error == null && signInStatus.ok == true) {
      router.replace('/')
    }
  }, [signInStatus])

  const HandleSubmit = async (event: FormEvent, params: Credentials) => {
    event.preventDefault()
    const status = await ReturnSignInStatus(params)
    setsignInStatus({ error: status!['error'], ok: status!['ok'] })
  }

  const ReturnSignInStatus = async (params: Credentials) => {
    const status = await signIn('credentials', {
      redirect: false,
      email: params.email,
      password: params.password,
    });
    return status
  }

  return (
    <Box>
      <form onSubmit={(event) => HandleSubmit(event, { email: username, password: password })}>
        <FormControl>
          <FormLabel id='form-label-1' htmlFor='form-input-1'>Email</FormLabel>
          <Input required id='form-input-1' type='email' placeholder='Email address' onChange={(e) => setusername(e.target.value)}></Input>
        </FormControl>
        <Box p={2}></Box>
        <FormControl>
          <FormLabel id='form-label-2' htmlFor='form-input-2'>Password</FormLabel>
          <Input required id='form-input-2' type='password' placeholder='Password' onChange={(e) => setpassword(e.target.value)}></Input>
        </FormControl>
        <Button width='full' mt={4} type='submit'>Sign In</Button>
      </form>
      <ShowError error={signInStatus.error} />
    </Box>
  )
}

const ShowError = (props: any) => {
  if (props.error == null) {
    return null
  }
  else if (props.error == "CredentialsSignin") {
    return (
      <Alert mt={4} status='error'>
        <AlertIcon />
        Incorrect email or password
      </Alert>
    )
  }
  return null
}

export default SignIn
