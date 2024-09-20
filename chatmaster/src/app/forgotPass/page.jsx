"use client";

import { useRef, useState } from 'react';
import styles from '../../css/forgoPass.module.css';
import { useForgotPassMutation } from '@/lib/services/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
    const router=useRouter();
    const [serverErrorMessage, setServerErrorMessage]=useState('');
    const [serverSuccessMessage, setServerSuccessMessage]=useState('');
    const [forgotPass]=useForgotPassMutation();
    const [email, setEmail]=useState('');
    const formRef = useRef(null);
    const formData={
      email
    }
    const [loading, setLoading]=useState(false);
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      // console.log(formData);
      try {
        const response=await forgotPass(formData);
        // console.log(response);
        if(response.data && response.data.success){
          setServerSuccessMessage("Please check you email");
          setServerErrorMessage('');
          toast.success("Please check you email");
          setLoading(false);
          router.push('/login');
          formRef.current.reset(); 
          setEmail('');
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
      <div className={styles.forgotPasswordBox}>
        <h1 className={styles.title}>Forgot Password</h1>
        <hr
          style={{
            border: 'none',
            height: '4px',
            backgroundColor: '#3498db',
            margin: '20px 0',
            borderRadius: '2px',
          }}
        />
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className={styles.boldText}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.buttonDisabled : ''}`}
            disabled={loading}
          >
          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.buttonDisabled : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          </button>
        </form>
      </div>
    </div>
  );
}
