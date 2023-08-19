import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  InputRightElement,
  InputGroup,
  Spinner,
} from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import { SearchIcon } from '@chakra-ui/icons';
import UserListItem from '../UserListItem';
import UserBadgeItem from '../UserBadgeItem';

const GroupChat = ({ children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats }  = ChatState();


    const handleSearch = async () =>{
        if(!search)
            return;
        try{
            setIsLoading(true);

            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/user/allUsers?search=${search}`, config);
            setSearchResult(data);
            setIsLoading(false);
        }
        catch(err){
            setIsLoading(false);
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

    const handleGroup = async (userToAdd) =>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: "User already exist",
                status: "warning",
                duration: 5000,
                isClosable:true,
                position: "top-left"
            });
            return;
        }

        setSelectedUsers([
            ...selectedUsers,
            userToAdd
        ])
    }

    const handleDelete = async(userToDelete) =>{
        setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
    }

    const handleSubmit = async () =>{
        if(!selectedUsers || !groupChatName){
            toast({
                title: "Please fill all the fields",
                status: "Error",
                duration: 5000,
                isClosable:true,
                position: "top-left"
            });
            return;
        }
        try{
            setIsLoading(true);

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.post("/chat/createGroupChat", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u => u._id))
            }, config);
            setChats([data, ...chats]);
            setIsLoading(false);
            onClose();
            toast({
                title: "New group created",
                status: "success",
                duration: 5000,
                isClosable:true,
                position: "top-left"
            });
        }
        catch(err){
            setIsLoading(false);
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
      <span onClick={onOpen}>{ children }</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"35px"} display={"flex"} justifyContent={"center"} fontFamily={"Work sans"}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={'column'} alignItems={"center"}>
            <FormControl>
                <Input 
                    type='text'
                    mb={3} 
                    placeholder='Chat Name'
                    value = {groupChatName} 
                    onChange={(e) => setGroupChatName(e.target.value)} 
                />
            </FormControl>
            <FormControl>
                <InputGroup>
                    <Input 
                        type='text'
                        mb={1} 
                        placeholder='Add users eg: xyz, abc'
                        value = {search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        right={"hey"}   
                    />
                    <InputRightElement cursor={"pointer"} _hover={{bg:"gray"}} onClick={handleSearch}>
                        <SearchIcon />
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            
            {selectedUsers?.map(u => (
                <UserBadgeItem key={u._id} user = {u} handleFunction = {()=> handleDelete(u)} />
            ))}

            {isLoading? 
                <Spinner size={"lg"} />
            :(
                searchResult?.slice(0,4).map(user => (
                    <UserListItem key = {user._id} user = {user} handleFunction={() => handleGroup(user)} />
                ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChat