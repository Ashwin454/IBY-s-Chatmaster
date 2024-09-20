"use client"

import { useRef, useState } from "react";
import styles from "../../css/login.module.css"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVerifyEmailMutation } from "@/lib/services/auth";
import { toast } from 'react-toastify';

export default function VerifyEmail() {
  const router=useRouter();
  const [serverErrorMessage, setServerErrorMessage]=useState('');
  const [serverSuccessMessage, setServerSuccessMessage]=useState('');
  const [verifyEmail]=useVerifyEmailMutation();
  const [email, setEmail]=useState('');
  const [otp, setOtp]=useState('');
  const formRef = useRef(null);
  const formData={
    email, otp
  }
  const [loading, setLoading]=useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(formData);
    try {
      const response=await verifyEmail(formData);
      if(response.data && response.data.success){
        setServerSuccessMessage("Welcome to IBY's ChatMaster");
        setServerErrorMessage('');
        toast.success("Welcome to IBY's ChatMaster");
        setLoading(false);
        router.push('/chats');
        formRef.current.reset(); 
        setEmail('');
        setOtp('');        
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
        <h1 className={styles.title}>Email Verification</h1>
        <hr style={{ border: 'none', height: '4px', backgroundColor: '#3498db', margin: '20px 0', borderRadius: '2px' }} />
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className={styles.boldText}>Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required />
          
          <label htmlFor="otp" className={styles.boldText}>OTP:</label>
          <input type="password" id="otp" name="otp" placeholder="Enter OTP" value={otp} onChange={(e)=>{setOtp(e.target.value)}} required />
          
          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.buttonDisabled : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}




