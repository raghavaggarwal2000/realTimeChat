import { SearchIcon, ViewIcon } from '@chakra-ui/icons'
import { 
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    Box,
    useToast,
    FormControl,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserListItem';

const UpdateGroupChat = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    
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

    const handleRename = async () =>{
        if(!groupChatName){
            toast({
                title: "Please enter chat name",
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "top-left"
            });
            return;
        }

        try{
            setRenameLoading(true);
            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.put("/chat/renameGroupName", {chatId: selectedChat._id, chatName: groupChatName},config);
            
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
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
        setRenameLoading(false);
        setGroupChatName("");
    };

    const handleAddToGroup = async (userAdd) =>{
        if(selectedChat.users.find((u) => u._id === userAdd._id)){
            toast({
                title: "This user already in the group",
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "top-left"
            });
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only Admin can add in group",
                status: "error",
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
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.put("/chat/addToGroup", {chatId: selectedChat._id, userId: userAdd._id},config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
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
            
            setIsLoading(false);
        }
    };

    const handleRemove = async (userRemove) =>{
        if (selectedChat.groupAdmin._id !== user._id && userRemove._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try{
            setIsLoading(true);
             const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                data: {chatId: selectedChat._id, userId: userRemove._id}
            }; 
            console.log(config);
            const {data} = await axios.delete("/chat/removeFromGroup", config);

            userRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
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
            
            setIsLoading(false);
        }
    };




  return (
    <>
        <IconButton 
            display={"flex"}
            icon={<ViewIcon />}
            onClick={onOpen}
        />
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader
                display={"flex"}
                fontFamily={"Work Sans"}
                fontSize={"35px"}
                justifyContent={"center"}
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box
                    w={"100%"}
                    display = "flex"
                    flexWrap={"wrap"}
                >
                    {selectedChat?.users.map(u =>(
                        <UserBadgeItem 
                            key = {u._id}
                            user = {u} 
                            handleFunction={() => handleRemove(u)} 
                        />
                    ))}
                </Box>

                <FormControl w={"100%"} display={"flex"} >
                    <Input 
                        placeholder='Chat Name'
                        mb={3}
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <Button
                        variant={'solid'}
                        ml={1}
                        isLoading = {renameLoading}
                        onClick={handleRename}
                        colorScheme='teal'
                    >
                        Update
                    </Button>
                </FormControl>
                <FormControl mb={"2px"} w={"100%"} display={"flex"}>
                    <InputGroup>
                        <Input
                            placeholder='Add users to group'
                            value = {search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputRightElement cursor={"pointer"} _hover={{bg:"gray"}} onClick={handleSearch}>
                            <SearchIcon />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
            {isLoading? <Spinner size="lg" />
            :(
                searchResult?.map(user => (
                    <UserListItem key = {user._id} user = {user} handleFunction={() => handleAddToGroup(user)} />
                ))
            )}
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' onClick={() => handleRemove(user)}>Leave Group</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )
}

export default UpdateGroupChat