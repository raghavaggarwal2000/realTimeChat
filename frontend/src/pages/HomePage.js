import React, {  useEffect } from 'react'
import {
  Container,
  Box,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels
  } from '@chakra-ui/react';

import Login from "../components/Authentication/Login";
import Signup from '../components/Authentication/Signup';
import { useHistory } from 'react-router-dom';


const HomePage = () => {
    const history = useHistory();

      useEffect(() =>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        if(userInfo){
            history.push("/chats")
        }
    }, []);
  return (
    <Container maxW = 'xl' centerContent>
      <Box
        w = "100%"
        m = "40px 0 15px 0"
        borderRadius = "lg"
        borderWidth = "1px"
        bg = {"black"}
        p = {3}
        display = "flex"
        justifyContent = "center"
      >
        <Text fontSize = '4xl' fontFamily = "Work sans" color = "white">Real Time Chat</Text>
      </Box>

      <Box
      bg = "black"
      p = {4} 
      w = "100%"
      borderRadius = "lg"
      borderWidth = "1px"
      color = "white"
      >
        <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
              <Tab w = "50%">Login</Tab>
              <Tab w = "50%">Signup</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage