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
    FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
  import { ChatState } from "@/context/ChatProvider";
  import UserBadgeItem from "./userBadgeItem";
  import UserListItem from "./userListItem";
import { useCreateGCMutation } from "@/lib/services/auth";
  
  const GroupChatModal = ({ children, setFetchAgain}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [createGC]=useCreateGCMutation();
    const { user, chats, setChats } = ChatState();
  
    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]);
    };
  
    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
        return;
      }
  
      try {
        setLoading(true);
        const encodedQuery = encodeURIComponent(query);
        const {data} = await axios.get(`http://localhost:8000/api/v1/search?search=${search}`, {
            withCredentials: true
        });
        setSearchResult(data.users);
    setLoading(false);
        
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setLoading(false);
      }
    };
  
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
  
    const handleSubmit = async () => {
      if (!groupChatName || selectedUsers.length === 0) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
          const data={
            name: groupChatName,
            users: selectedUsers.map((u) => u._id),
          }

        const response = await createGC(data);
        // console.log(response);
        setChats([data, ...chats]);
        onClose();
        setFetchAgain(prev => !prev);
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        // console.log(error);
        toast({
          title: "Failed to Create the Chat!",
          description: error.response,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
  
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="35px" fontFamily="Work sans" textAlign="center">
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default GroupChatModal;
  