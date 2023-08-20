import { Box, Text } from '@chakra-ui/layout';
import { 
    Avatar, 
    Button, 
    Drawer, 
    DrawerBody, 
    DrawerContent, 
    DrawerHeader, 
    DrawerOverlay, 
    Input, 
    Menu, 
    MenuButton,
    MenuDivider, 
    MenuItem, 
    MenuList, 
    Spinner, 
    Tooltip,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from '../modal/ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import ChatLoading from '../ChatLoading';
import axios from 'axios';
import UserListItem from '../UserListItem';

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const history = useHistory();
    const { user, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast();

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const handleSearch = async () =>{
        if(!search){
            toast({
                title: "Please enter something in search",
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "top-left"
            });
            return ;
        }
        try{
            setIsLoading(true);
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/user/allUsers?search=${search}`, config);

            setSearchResult(data);
            setIsLoading(false);
        }
        catch(err){
            toast({
                title: "Error occured",
                description: err.message,
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "top-left"
            });
        }
    }

    const hangleLogout = () =>{
        localStorage.removeItem("userInfo");
        history.push("/");
    }

    const accessChat = async (userId) =>{
        try{
            setLoadingChat(true);

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            
            const { data } = await axios.post("/chat/accessChat",{userId} ,config);
            
            if(!chats.find(c => c._id === data._id))
                setChats([
                    data,
                    ...chats
                ]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        }
        catch(err){
             toast({
                title: "Error occured",
                description: err.message,
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "top-left"
            });
        }
    }

  return (
    <>
    <Box
        display="flex"
        width="100%"
        justifyContent="space-between"
        bg = "#444444"
        color = "white"
        p = "5px 10px"
        borderWidth={"5px"}
    >
        <Tooltip label = "Search Users to chat" hasArrow placement='bottom-end'>
            <Button variant="ghost" onClick = {onOpen}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <Text display= {{base: "none", md: "flex"}} px = {4}>Search user</Text>
            </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"work sans"}>Real Live chat </Text>

        <div>
            <Menu>
                <MenuButton p={1}>
                    <BellIcon fontSize={"2xl"} m={1}/>
                </MenuButton>
                {/* <MenuList></MenuList> */}
            </Menu>
            <Menu>
                <MenuButton as = {Button} rightIcon={<ChevronDownIcon />}>
                    <Avatar size = "sm" cursor={"pointer"} name= {user.name} src={user.pic}/>
                </MenuButton>
                <MenuList color={"white"}>
                    <ProfileModal user = {user}>  
                        <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider />
                    <MenuItem onClick={hangleLogout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
    </Box>


    <Drawer
    placement='left'
    onClose={onClose}
    isOpen={isOpen}
    >
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader>Search Users</DrawerHeader>

            <DrawerBody>
            <Box display={"flex"} pb = {2}>
                <Input 
                placeholder='Search by name or email'
                mr={2}
                value = {search}
                onChange={(e) => setSearch(e.target.value)}
                />

                <Button onClick={handleSearch}>Go</Button>

            </Box>
                
            {
                isLoading ? (
                    <ChatLoading />
                )
                : (
                    searchResult?.map(user =>(
                        <UserListItem
                        key = {user._id}
                        user = {user}
                        handleFunction = {() => accessChat(user._id)}
                        />
                    ))
                )
            }

            {loadingChat && <Spinner ml = "auto" display = "flex" />}
          </DrawerBody>

        </DrawerContent>


    </Drawer>
    </>
  )
}

export default Navbar;