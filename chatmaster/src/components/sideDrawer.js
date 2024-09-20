import { Avatar, Badge, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useAccessChatMutation, useLoadProfQuery, useLogoutMutation } from "@/lib/services/auth";
import ProfileModal from "./ProfileModal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@chakra-ui/react";
import ChatLoading from "./chatloading";
import UserListItem from "./userListItem";
import axios from "axios";
import { ChatState } from "@/context/ChatProvider";

const SideDrawer = ({fetchAgain, setFetchAgain}) => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const { data, isSuccess } = useLoadProfQuery();
    const [logout] = useLogoutMutation();
    const [accessChat]=useAccessChatMutation();
    const [loadingChat, setLoadingChat]=useState(false);
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {selectedChat,
        setSelectedChat, notification, setNotification
      } = ChatState();
    
    const handleSearch=async()=>{
        setLoading(true);
        if(!search){
            setLoading(false)
            return;
        }
        try{
            setLoading(true);
            // console.log(`http://localhost:8000/api/v1/search?search=${search}`)
            const {data} = await axios.get(`http://localhost:8000/api/v1/search?search=${search}`, {
                withCredentials: true
            });
            // console.log(data);
            setSearchResult(data.users);
            setLoading(false);
        }catch(error){
            // console.log(`/api/v1/search?search=${search}`)
            toast.error(`Some unexpected error occured: ${error}`)
            setLoading(false);
        }
    }

    const accessingChat = async (userId) => {
        try {
            setLoadingChat(true); // Set loading state to true when starting to access chat
            
            const response = await accessChat({ userId });
            
            if (response.data && response.data.success) {
                setSelectedChat(response.data.chat1); // Set the selected chat when response is successful
                setFetchAgain(prev => !prev); // Toggle the fetchAgain state once
                onClose(); // Close the drawer once chat is selected
            } else {
                toast.error(response.error.message);
            }
            
        } catch (error) {
            toast.error(`Some unexpected error: ${error}`);
        } finally {
            setLoadingChat(false); // Ensure loading state is reset
        }
    };
    
    const handleLogout = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await logout();
            if (response.data && response.data.success) {
                toast.success(response.data.message);
                setLoading(false);
                router.push('/login');
            } else if (response.error && !response.error.data.success) {
                toast.error(response.error.data.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            toast.error("An error occurred during logout.");
        }
    };

    useEffect(() => {
        if (data && isSuccess) {
            setUser(data.user1);
        }
    }, [data, isSuccess]);
    const getSender = (loggedUser, users) => {
        if (!loggedUser || !users || users.length < 2) {
            return "Click on a user to start chatting";
        }
        return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
    };
    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                background='#3498db'
                padding="10px"
            >
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end" bg="black" color="white">
                    <Button _hover={{ background: "#2980b9" }} onClick={onOpen}>
                        <FontAwesomeIcon icon={faSearch} style={{ color: "blue", padding: "5px" }} />
                        <Text display={{ base: "none", md: "flex" }} paddingX='5px'>Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize="1xl" fontFamily="work sans" color="white">IBY's ChatMaster</Text>
                <div>
                    <Menu>
                        <MenuButton>
                            <Avatar boxSize={"2rem"} cursor="pointer" verticalAlign="middle" name={user.name} src={user.pic} />
                            <ChevronDownIcon boxSize="2rem" m={1} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            {/* Drawer Component */}
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                        <DrawerBody>
                            <Box display="flex">
                                <Input
                                    placeholder="Search by name or email"
                                    mr={2}
                                    value={search}
                                    onChange={(e)=>{setSearch(e.target.value); handleSearch()}}
                                />
                                <Button onClick={handleSearch}>Go</Button>
                            </Box>
                            {loading ? 
                            (
                                <ChatLoading/>
                            ):(
                                searchResult.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={()=>accessingChat(user._id)}
                                    ></UserListItem>
                                ))
                            )
                            }
                            {loadingChat && <Spinner ml="auto" d="flex" />}
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </>
    );
};

export default SideDrawer;
