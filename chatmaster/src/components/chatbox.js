import { Box } from "@chakra-ui/layout";
import "./styles.css";
import { ChatState } from "@/context/ChatProvider";
import SingleChat from "./SingleChat";
import { useEffect } from "react";

const Chatbox = ({ loggedUser, fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  useEffect(()=>{

  },[fetchAgain])
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      padding={3}
      bg="white"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
    <SingleChat loggedUser={loggedUser} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  );
};

export default Chatbox;