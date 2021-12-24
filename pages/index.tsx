import type { NextPage } from 'next'
import { signIn } from "next-auth/react"
import { useState } from "react";
import Head from 'next/head'
import { FormControl, FormLabel, Text, Flex, Center, Square, Circle, Input, Heading, Button, ButtonGroup, Box, Container } from '@chakra-ui/react'

const Home: NextPage = () => {
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

  const [username, setusername] = useState("gabrieltomonari@gmail.com")
  const [password, setpassword] = useState("teste")
  return (
    <Box>
      <form>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type='email' placeholder='Email address' onChange={(e)=>setusername(e.target.value)}></Input>
        </FormControl>
        <Box p={2}></Box>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type='password' placeholder='Password' onChange={(e)=>setpassword(e.target.value)}></Input>
        </FormControl>

      <Button width='full' mt={4} onClick={()=>OnFormSubmit({email:username,password:password})}>Sign In</Button>
      </form>
    </Box>
  )
}

const OnFormSubmit = async (params: any) => {
  const status = await signIn('credentials', {
    callbackUrl: 'http://localhost:3000/foo',
    email: params.email,
    password: params.password,
  });
  console.log(status);
}

export default Home
