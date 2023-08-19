import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ChatState } from '../context/ChatProvider';
import Navbar from '../components/chat/Navbar';
import MyChats from '../components/chat/MyChats';
import ChatBox from '../components/chat/ChatBox';
import { Box } from '@chakra-ui/react'

const ChatPage = () => {
    const { user } = ChatState();
    console.log(user);
    const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width: "100%"}}>
        {user && <Navbar />}
        <Box
        display = "flex"
        justifyContent = "space-between"
        w = "100%"
        p = "10px"
        h = "600px"
        >
            {user && <MyChats fetchAgain = {fetchAgain}  />}
            {user && <ChatBox fetchAgain = {fetchAgain}  setFetchAgain = {setFetchAgain} />}
        </Box>

    </div>
  )
}

export default ChatPage