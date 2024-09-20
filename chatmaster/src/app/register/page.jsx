"use client"
import { toast } from 'react-toastify';
import { useRef, useState } from 'react';
import styles from '../../css/register.module.css';
import { useCreateUserMutation } from '@/lib/services/auth';
import { useRouter } from 'next/navigation';

const Register = () => {
  const router=useRouter();
  const [serverErrorMessage, setServerErrorMessage]=useState('');
  const [serverSuccessMessage, setServerSuccessMessage]=useState('');
  const [createUser]=useCreateUserMutation();
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const [confirmPass, setConfirmPass]=useState('');
  const [name, setName]=useState('');
  const [photo, setPhoto] = useState(null)
  const formRef = useRef(null);
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('confirmPass', confirmPass);
  formData.append('photo', photo); // Append the image file to the FormData object
  const [loading, setLoading]=useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(formData);
    try {
      
      const response=await createUser(formData);
      if(response.data && response.data.success){
        setServerSuccessMessage("Registration successful");
        setServerErrorMessage('');
        toast.success("Registration successful");
        setLoading(false);
        router.push('/verify-email');
        formRef.current.reset(); 
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPass('');
        setPhoto(null);
      }
      if(response.error && !response.error.data.success){
        setServerErrorMessage(response.error.data.message);
        setServerSuccessMessage('');
        toast.error(response.error.data.message);
        setLoading(false);
      }
      // console.log("Response", response);
    } catch (error) {
      setLoading(false);
      setServerErrorMessage(error.message);
    }    
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Register</h1>
        <hr style={{ border: 'none', height: '4px', backgroundColor: '#3498db', margin: '20px 0', borderRadius: '2px' }} />
        <br/>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e)=>{setName(e.target.value)}}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e)=>{setEmail(e.target.value)}}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e)=>{setPassword(e.target.value)}}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Confrim Password</label>
            <input
              type="password"
              id="confirmPass"
              name="confirmPass"
              value={formData.confirmPass}
              onChange={(e)=>{setConfirmPass(e.target.value)}}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="profilePicture" className={styles.label}>Profile Picture</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={(e) => setPhoto(e.target.files[0])} // Store selected file in state
              className={styles.input}
              accept="image/*" // Accept image files only
            />
          </div>
          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.buttonDisabled : ''}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;
