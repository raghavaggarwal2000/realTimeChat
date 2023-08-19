import React, { useState } from 'react'
import { Button, useToast } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/layout' 
import { FormControl, FormLabel } from '@chakra-ui/form-control' 
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from '../../context/ChatProvider'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { setUser } = ChatState();

    const history = useHistory();
    const toast = useToast();

    const submitHandler = async () =>{
        setIsLoading(true);
        if(!email || !password){
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
                email,
                password
            }

            const { data } = await axios.post("/user/login", config);
            toast({
                title: "Login successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            setUser(data);
            setIsLoading(false);

            localStorage.setItem("userInfo", JSON.stringify(data));
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

        <FormControl id = "email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
            placeholder="Enter your Email" 
            type="email"
            value = {email}
            onChange = {((e) => setEmail(e.target.value))}
            />
        </FormControl>

        <FormControl id = "password" isRequired>
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

        <Button
            colorScheme = "blue"
            width= "100%"
            style = {{marginTop: "15px"}}
            isLoading = {isLoading}
            onClick = {submitHandler}
        >
            Signup
        </Button>

       
    </VStack>
  )
}

export default Login