import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import GroupChatModal from "./GroupChatModal";
import { ChatState } from "@/context/ChatProvider";
import { useMyChatsQuery } from "@/lib/services/auth"; // Assuming this query fetches your chats
import ScrollableFeed from "react-scrollable-feed";

const MyChats = ({ loggedUser, fetchAgain, setFetchAgain }) => {
    const [chats, setChats] = useState([]);
    const { selectedChat, setSelectedChat } = ChatState();
    const [loading, setLoading] = useState(true);

    const getSender = (loggedUser, users) => {
        if (!loggedUser || !users || users.length < 2) {
            return "Click on a user to start chatting";
        }
        return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
    };

    // Fetch chats
    const fetchChats = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("http://localhost:8000/api/v1/chat/connectedChats", {
                withCredentials: true,
            });

            setChats(data.AllChats);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching chats:", error);
            setLoading(false);
        }
    };

    // Use useEffect to automatically fetch chats when "fetchAgain" changes
    useEffect(() => {
        fetchChats();
    }, [fetchAgain]);

    // Call this function when a new user or chat is added to force a re-fetch

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            padding={3}
            background="#ccdffc"
            width={{ base: "100%", md: "35%", lg: "40%" }}
            height="100%"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                width="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal setFetchAgain={setFetchAgain}>
                    <Button
                        d="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box display="flex" flexDirection="column" width="100%">
            
                {loading ? (
                    <Text>Loading Chats...</Text>
                ) : chats && chats.length > 0 ? (
                    <Stack overflowY="scroll" height="78vh">
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                background={selectedChat === chat ? "#3498db" : "#FFFFFF"}
                                color={selectedChat === chat ? "white" : "black"}
                                paddingX={3}
                                paddingY={2}
                                borderRadius="lg"
                                key={chat._id}
                                width="100vm"
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Text>No chats available</Text>
                )}
                
            </Box>
        </Box>
    );
};

export default MyChats;
