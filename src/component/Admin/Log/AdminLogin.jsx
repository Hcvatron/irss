import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebaseConfig'; 
import './AdminLogin.css';
import { toast } from 'react-toastify';
import { useAdminProvider } from '../../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {admin,setAdmin,setToken} = useAdminProvider();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const adminDocRef = doc(db, 'admins', user.uid); 
      const adminDoc = await getDoc(adminDocRef);
      const token = await user.getIdToken(); 

      if (adminDoc.exists()) {
        toast.success("Login Success");
        setAdmin(adminDoc.data());
        setToken(token);
        console.log('Admin logged in:', adminDoc.data());
        navigate('/admin/dashboard');
      } else {
      
        const userDocRef = doc(db, 'users', user.uid); 
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            setError('Unauthorized login attempt.');
            toast.error("Unauthorized login attempt");
        }
     }  
    } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      setError('Login failed. Please check your credentials.');
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
