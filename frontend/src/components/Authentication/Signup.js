import React, { useState } from 'react'
import { Button, useToast } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/layout' 
import { FormControl, FormLabel } from '@chakra-ui/form-control' 
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from '../../context/ChatProvider'

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState("");
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const {setUser} = ChatState();

    const history = useHistory();
    const toast = useToast();

    const postDetails = (pics) =>{
        if(pics === undefined){
            toast({
                title: "Please select an image",
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "bottom"
            });
            return ;
        }
        setIsLoading(true);
        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "real-chat-app")
            data.append("cloud_name", "dsmwx4mhj")
            axios.post("https://api.cloudinary.com/v1_1/dsmwx4mhj/image/upload",data)
            .then(data =>{
                setPic(data.data.url.toString());
                setIsLoading(false);
                 toast({
                    title: "Image uploaded successfully!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            })
            .catch(err =>{
                console.log(err);
                setIsLoading(false);
            })
        }else{
            setIsLoading(false);
            toast({
                title: "Please select an image",
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "bottom"
            });
        }
       
    }

    const submitHandler = async () =>{
        setIsLoading(true);
        if(!name || !email || !password){
            toast({
                title: "Please fill all the fields",
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "bottom"
            });
            return;
        }
        try{
            const config = {
                headers:{
                    "Content-Type":"application/json"
                },
                name,
                email,
                password,
                pic
            }

            const { data } = await axios.post("/user/signup", config);
            toast({
                title: "Registration completed successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            setUser(data);

            localStorage.setItem("userInfo", JSON.stringify(data));
            setIsLoading(false);
            history.push("/chats")
        }
        catch(err){
            toast({
                title: err?.response?.data?.err ? err?.response?.data?.err :err.message,
                status: "error",
                duration: 5000,
                isClosable:true,
                position: "bottom"
            });
            setIsLoading(false);
        }
    }

  return (
    <VStack spacing="5px" >
        <FormControl id = "name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input 
            placeholder="Enter your name" 
            value = {name}
            onChange = {((e) => setName(e.target.value))}
            />
        </FormControl>

        <FormControl id = "emailSignup" isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
            placeholder="Enter your Email" 
            type="email"
            value = {email}
            onChange = {((e) => setEmail(e.target.value))}
            />
        </FormControl>

        <FormControl id = "passwordSignup" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                placeholder="Enter your Password" 
                type={show? "text" :"password"}
                value = {password}
                onChange = {((e) => setPassword(e.target.value))}
                />
                <InputRightElement width={"4.5rem"}>
                    <Button bg={"#7E7E7E"} h = "1.75rem" size ="sm" onClick = {() => setShow(!show)}>
                        {show?"Hide":"Show"}
                    </Button>
                </InputRightElement>
            
            </InputGroup>
        </FormControl>

        <FormControl id = "picture" isRequired>
            <FormLabel>Upload your Picture</FormLabel>
            <Input 
            type = "file"
            accept='image/*'
            p = {1}
            onChange = {((e) => postDetails(e.target.files[0]))}
            />
        </FormControl>

        <Button
        colorScheme = "blue"
        width= "100%"
        style = {{marginTop: "15px"}}
        onClick = {submitHandler}
        isLoading = {isLoading}
        >
            Signup
        </Button>

    </VStack>
  )
}

export default Signup