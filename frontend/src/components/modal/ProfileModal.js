import React from 'react'
import { 
    IconButton, 
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    Text
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'



const ProfileModal = ({ user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
   <>
    {children
        ?(
        <span onClick={onOpen}>{children}</span>
        ):(
        <IconButton 
        display={{base: "flex"}}
        icon={<ViewIcon />}
        onClick={onOpen}
        />
    )}
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >{user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            justifyContent = "space-between"
            flexDir={"column"}
            alignItems={"center"}
            >
           <Image
                borderRadius={"full"}
                boxSize={"150px"}
                src = {user.pic}
                alt= {user.name}
           />
           <Text>{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
   </>
  )
}

export default ProfileModal