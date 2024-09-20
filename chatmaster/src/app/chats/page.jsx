"use client"

import { useState, useEffect } from 'react';
import styles from '../../css/chat.module.css';
import { useLoadProfQuery, useLogoutMutation } from '@/lib/services/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Box } from '@chakra-ui/react';
import MyChats from '@/components/mychats';
import ChatBox from '@/components/chatbox';
import SideDrawer from '@/components/sideDrawer';
import Loader from '@/components/loader';

const Chat = () => {
  const [loading, setLoading]=useState(true);
  const [user, setUser]=useState({});
  const {data, isSuccess}=useLoadProfQuery();
  const [logout]=useLogoutMutation();
  const router=useRouter();
  const [serverErrorMessage, setServerErrorMessage]=useState('');
  const [serverSuccessMessage, setServerSuccessMessage]=useState('');
  useEffect(()=>{
    setLoading(true)
    if(data && isSuccess){
      setUser(data.user1);
      // console.log(user);
    }
    setLoading(false)
  }, [data, isSuccess])
  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // console.log(formData);
    try {
      const response=await logout();
      if(response.data && response.data.success){
        setServerSuccessMessage(response.data.message);
        setServerErrorMessage('');
        toast.success(response.data.message);
        setLoading(false);
        router.push('/login');
      }
      if(response.error && !response.error.data.success){
        setServerErrorMessage(response.error.data.message);
        setServerSuccessMessage('');
        toast.error(response.error.data.message);
        router.push("/login")
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setServerErrorMessage(error.message);
    }    
  };
  const [fetchAgain, setFetchAgain]=useState(false);
  return (
    <>
    {loading ? <Loader /> :
    (<div style={{width: "100%"}}>
      {user && <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      <Box
      display="flex"
      justifyContent='space-between'
      width='100%'
      height='91.5vh'
      padding='10px'
      >
        {user && <MyChats loggedUser={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox loggedUser={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>)
    }
    </>
  );
};

export default Chat;