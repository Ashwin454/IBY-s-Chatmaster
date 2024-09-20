"use client"

import { useRef, useState } from "react";
import styles from "../../../css/login.module.css"
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useParams} from 'next/navigation'
import { useResetPassMutation } from "@/lib/services/auth";
import { toast } from "react-toastify";

export default function ResetPass() {
  const router=useRouter();
  const [serverErrorMessage, setServerErrorMessage]=useState('');
  const [serverSuccessMessage, setServerSuccessMessage]=useState('');
  const [resetPass]=useResetPassMutation();
  const [password, setPassword]=useState('');
  const [confirmPass, setConfirmPass]=useState('');
  const formRef = useRef(null);
  const formData={
    password,
    confirmPass
  }
  const [loading, setLoading]=useState(false);
  const token=useParams();
  const formData1={
    token,
    formData
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // console.log(formData);
    try {
      const response=await resetPass(formData1);
      // console.log(response);
      if(response.data && response.data.success){
        setServerSuccessMessage("Password reset completed");
        setServerErrorMessage('');
        toast.success("Password reset completed");
        setLoading(false);
        router.push('/login');
        formRef.current.reset(); 
        setPassword('');
        setConfirmPass('');
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
        <h1 className={styles.title}>Reset Password</h1>
        <hr style={{ border: 'none', height: '4px', backgroundColor: '#3498db', margin: '20px 0', borderRadius: '2px' }} />
        <form onSubmit={handleSubmit}>
          <label htmlFor="password" className={styles.boldText}>Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required />
          
          <label htmlFor="confirmPass" className={styles.boldText}>Confirm Password:</label>
          <input type="password" id="confirmPass" name="confirmPass" placeholder="Enter confirm password" value={confirmPass} onChange={(e)=>{setConfirmPass(e.target.value)}} required />
          
          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.buttonDisabled : ''}`}
            disabled={loading}
          >
          {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}


