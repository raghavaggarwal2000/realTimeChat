import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, Text } from '@chakra-ui/layout';
import { Button, FormControl, IconButton, Input, InputGroup, InputRightElement, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../utils/ChatLogic';
import ProfileModal from './modal/ProfileModal';
import UpdateGroupChat from './modal/UpdateGroupChat';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
import Lottie from "react-lottie";
import animationData from "./animation/typing.json";


const ENDPOINT = process.env.ENDPOINT;
let socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false); // to check whether the sender is typing
    const [isTyping, setIsTyping] = useState(false); // to check other user is typing(so will show typing animation)

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        },
    };

    // Socket io code
    useEffect(() =>{
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => setSocketConnected(true));
        socket.on("typing",() => setIsTyping(true));
        socket.on("stop typing",() => setIsTyping(false));
        
    },[])

    useEffect(() =>{
        socket.on("message received", (newMessageReceived) =>{
            console.log(selectedChatCompare);
            console.log(newMessageReceived.chat);
           if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
                // give notification
            }else{ console.log(newMessageReceived);
            
                setMessages([
                    ...messages,
                    newMessageReceived
                ])
            }

        })
    })


    const fetchMessages = async () =>{
        if(!selectedChat) return;
            
        try {
            setIsLoading(true);

            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/message/${selectedChat._id}`, config);

            setMessages(data);
            setIsLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (err) {
            toast({
                title: err?.response?.data?.err ? err?.response?.data?.err :err.message,
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "bottom"
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat]);


    const sendMessage = async (e) =>{
        if((e.type === "click" || e.key === "Enter") && newMessage){
            try {
                setTyping(false);
                const config = {
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: "Bearer " + user.token
                    }
                }

                setNewMessage("");

                const { data } = await axios.post("/message/sendMessage", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                
                socket.emit("new message", data);
                
                setMessages([
                    ...messages,
                    data
                ])

            } catch (err) {
                toast({
                    title: err?.response?.data?.err ? err?.response?.data?.err :err.message,
                    status: "error",
                    duration: 5000,
                    isClosable:true,
                    position: "bottom"
                });
            }
        }
    }

    const typingHandler = async (e) =>{
        setNewMessage(e.target.value);

        // Typing indicator logic
        if(socketConnected) return;
        console.log("here");
        if(!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000; //3 secs;

        setTimeout(() =>{
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            console.log(lastTypingTime+ " " +timeDiff);
            if(timeDiff> timerLength && typing){
                socket.emit("stop typing", selectedChat?._id);
                setTyping(false);
            }
        }, timerLength);
    }
  return (
    <>
        {selectedChat
        ? (
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    py={2}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display ="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    <IconButton
                        display={{ base: "flex", md: "none"}}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    />
                    {!selectedChat.isGroupChat? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user = {getSenderFull(user, selectedChat.users)} />
                        </>
                    ):(
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChat
                                fetchAgain = {fetchAgain}
                                setFetchAgain = {setFetchAgain}
                                fetchMessages = {fetchMessages}
                            />
                        </>
                    )}

                </Text>

                <Box
                    display={"flex"}
                    flexDir={"column"}
                    bg={"#E8E8E8"}
                    p={3}
                    width={"100%"}
                    height={"100%"}
                    justifyContent={"flex-end"}
                    borderRadius={"lg"}
                    overflowY={"hidden"}
                >
                    {isLoading ? (
                        <Spinner 
                            size="xl"
                            w={"20"}
                            h={"20"}
                            alignSelf={"center"}
                            margin={"auto"}
                        />
                    ):(
                        <div className="messages">
                            <ScrollableChat messages = {messages} />
                        </div>
                    )}

                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping? <div>
                            <Lottie
                                options={defaultOptions}
                                width={70}
                                style={{marginLeft:0}}
                            />
                        </div>:<></>}
                        <InputGroup bgColor={"#444444"}>
                        <Input 
                            placeholder='Enter a message'
                            variant={"filled"}
                            value={newMessage}
                            color={"white"}
                            bg={"#444444"}
                            // _hover={{backgroundColor:"#444444"}}
                            focus
                            onChange = {typingHandler}
                            // onChange={(e) =>}
                        />
                        <InputRightElement cursor={"pointer"} bg={"#38B2AC"} _hover={{bg: "black"}} onClick={sendMessage}> 
                        <ChevronRightIcon boxSize={8} />
                        </InputRightElement>
                        </InputGroup>

                    </FormControl>
                </Box>
            </>
        ): (
            <Box
                display = "flex"
                alignItems={"center"}
                justifyContent={"center"}
                h={"100%"}
            >
                <Text fontFamily={"Work sans"} fontSize={"4xl"}>Click a user to start chatting</Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat