import React from 'react'
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from '../SingleChat';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const { selectedChat } = ChatState();
  
  return (
    <Box
      display ={{base: selectedChat ? "flex" : "none", md: "flex"}}
      w={{base: "100%", md: "68%"}}
      bg = "#444444"
      color = "white"
      flexDir={"column"}
      alignItems={"center"}
      borderRadius={"lg"}
      borderWidth={"1px"}
      p={3}
    >
      <SingleChat fetchAgain = {fetchAgain}  setFetchAgain = {setFetchAgain} />

    </Box>
  )
}

export default ChatBox