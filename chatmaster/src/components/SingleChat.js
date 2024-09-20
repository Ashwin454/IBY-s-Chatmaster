import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ScrollableChat from "./scrollableChat";
import io from "socket.io-client";
import { ChatState } from "@/context/ChatProvider";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useSendMessageMutation } from "@/lib/services/auth";

const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const SingleChat = ({ loggedUser, fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendMessage] = useSendMessageMutation();
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();
  
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/message/${selectedChat._id}`,
        {
          withCredentials: true,
        }
      );
      setMessages(data.message);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  const sendingMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const response = await sendMessage({
          content: newMessage,
          chatId: selectedChat,
        });
        socket.emit("new message", response.data.message);
        setMessages([...messages, response.data.message]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", loggedUser);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // console.log("newMessageReceived: ", newMessageReceived);
      // console.log("messages: ",messages);
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => {
        const isMessageAlreadyPresent = prevMessages.find((message) => message._id === newMessageReceived._id);
        if (!isMessageAlreadyPresent) {
          const updatedMessages = [...prevMessages, newMessageReceived];
          // console.log("updatedMessages: ", updatedMessages);
          return updatedMessages;
        } else {
          return prevMessages;
        }
      });

      }
    });
  }, [messages]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) {
      return "Click on a user to start chatting";
    }
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  const getSenderFull = (loggedUser, users) => {
    if (!users || users.length < 2) {
      return "Click on a user to start chatting";
    }
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            paddingBlock={3}
            paddingX={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {(!selectedChat.isGroupChat ? (
              <>
                {getSender(loggedUser, selectedChat.users)}
                <ProfileModal user={getSenderFull(loggedUser, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  user={loggedUser}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            ))}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            padding={3}
            background="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat user={loggedUser} messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendingMessage} isRequired mt={3}>
              <Input
                variant="filled"
                background="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
