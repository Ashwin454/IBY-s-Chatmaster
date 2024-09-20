"use client"

import { useRef, useState } from "react";
import styles from "../../css/login.module.css"
import Link from "next/link";
import { useLoginMutation } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import {toast} from 'react-toastify';

export default function Login() {
  const router=useRouter();
  const [serverErrorMessage, setServerErrorMessage]=useState('');
  const [serverSuccessMessage, setServerSuccessMessage]=useState('');
  const [login]=useLoginMutation();
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const formRef = useRef(null);
  const formData={
    email, password
  }
  const [loading, setLoading]=useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(formData);
    try {
      const response=await login(formData);
      if(response.data && response.data.success){
        setServerSuccessMessage("Welcome to IBY's ChatMaster");
        setServerErrorMessage('');
        toast.success("Welcome to IBY's ChatMaster");
        setLoading(false);
        router.push('/chats');
        formRef.current.reset(); 
        setEmail('');
        setPassword('');        
      }
      if(response.error && !response.error.data.success){
        setServerErrorMessage(response.error.data.message);
        setServerSuccessMessage('');
        toast.error(response.error.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setServerErrorMessage(error.message);
    }    
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login</h1>
        <hr style={{ border: 'none', height: '4px', backgroundColor: '#3498db', margin: '20px 0', borderRadius: '2px' }} />
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className={styles.boldText}>Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required />
          
          <label htmlFor="password" className={styles.boldText}>Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required />
          
          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.buttonDisabled : ''}`}
            disabled={loading}
          >
          {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <div className={styles.links}>
          <p>
            <Link href="/register" className={styles.link}>Don't have an account? Create account</Link>
          </p>
          <p>
            <Link href="/forgotPass" className={styles.link}>Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


