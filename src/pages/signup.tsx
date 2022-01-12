import type { NextPage } from 'next'
import { useState } from "react";
import Head from 'next/head'
import { 
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,FormControl, FormLabel, Text, Flex, Center, Square, Circle, Input, Heading, Button, ButtonGroup,Box,Container } from '@chakra-ui/react'

const SignUp: NextPage = () => {
  return (
    <Flex bgGradient='linear(to-l, #7928CA, #FF0080)' width='full' minH='100vh' align='center' justifyContent='center'>
      <Head>
        <title>MyFinance - Sign Up</title>
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
        <LoginHeader/>
        <LoginForm/>
      </Box>
    </Flex>
  )
}

const LoginHeader = () =>{
  return(
    <Box textAlign='center'>
      <Heading as='h1' size='2xl'>MyFinance</Heading>
      <Text mt={4}>Sign Up - Create an account</Text>
    </Box>
  )
}

const LoginForm = () =>{
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [confirmpassword, setconfirmpassword] = useState("")
  return(
    <Box>
      <form onSubmit={()=>onFormSubmit({email:username,password:password,confirmpassword:confirmpassword})}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type='email' placeholder='Email address' onChange={(e)=>setusername(e.target.value)}></Input>
        </FormControl>
        <Box p={2}></Box>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type='password' placeholder='Password' onChange={(e)=>setpassword(e.target.value)}></Input>
        </FormControl>
        <Box p={2}></Box>
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input type='password' placeholder='Password' onChange={(e)=>setconfirmpassword(e.target.value)}></Input>
        </FormControl>
        <PasswordAlert password={password} confirmpassword={confirmpassword}/>
      <Button width='full' mt={4} type='submit'>Sign In</Button>
      </form>
    </Box>
  )
}

const PasswordAlert = (props:any) =>{
  if (props.password == props.confirmpassword) {
    return null
  }
  return(
    
    <Alert mt={4} status='error'>
      
    <AlertIcon />
    The passwords don't match
    </Alert>
  )
}

const onFormSubmit = async (props:any) => {
  //Getting value from useRef()
  const email = props.email
  const password = props.password;
  const confirmpassword = props.confirmpassword;
  //Validation
  if (!email || !email.includes('@') || !password || password!=confirmpassword) {
      alert('Invalid information. Check your inputs!');
      return;
  }
  //POST form values
  const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email: email,
          password: password,
      }),
  });
  //Await for data for any desirable next steps
  const data = await res.json();
  console.log(data);
};

export default SignUp
