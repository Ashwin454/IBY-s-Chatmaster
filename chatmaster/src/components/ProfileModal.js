import { ViewIcon } from "@chakra-ui/icons";

const { useDisclosure, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Image, Text } = require("@chakra-ui/react")

const ProfileModal=({ user, children })=>{
    const {isOpen, onOpen, onClose} = useDisclosure();
    return(
        <div>
        {children ? (
            <span onClick={onOpen}>{children}</span>
        ):(
            <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
        )}
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent height="350px">
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" >
            <Image 
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
            ></Image>
            <Text
                fontSize={{base:"20px", md:"30px"}}
                fontFamily="work sans"
                padding="4px"
            >
            Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </div>
    )
}

export default ProfileModal;