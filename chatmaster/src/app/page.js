"use client"

import Loader from "@/components/loader";
import styles from "../css/login.module.css"
import Chats from "./chats/page";
import Login from "./login/page";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Home = () => {
  const [isAuth, setIsAuth]=useState(null);
  useEffect(()=>{
    const authCookie= Cookies.get('is_auth');
    setIsAuth(authCookie);
  })
  return (
    <>
    {isAuth === null && <Loader />} 
    <div className={styles.text_color}>
      {isAuth ? <Chats /> : <Login/>}
    </div>
    </>
  );
};

export default Home;
