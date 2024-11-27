"use client";
import React, { useState, useContext } from 'react'
import { AppContext } from '@/context/AppContext';
import LoginForm from '@/components/loginForm'
import { useRouter } from 'next/navigation';
import { login } from '@/api/api';

const Login = () => {
    const router = useRouter(); 
    
    const { setUserIsLoggedIn } = useContext(AppContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginClick = async (e) => {
        e.preventDefault();
        setError('');
        try {
          const data = await login(username, password);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({ username }));
          setUserIsLoggedIn(true);
          router.push('/dashboard-items');
        } catch (err) {
          console.error('Login error:', err);
          setError(err.message || 'An error occurred during login');
        }
      };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        router.push('/register');
    }

    return (
        <LoginForm  
            handleLoginClick={handleLoginClick} 
            handleRegisterClick={handleRegisterClick}
            username={username} 
            setUsername={setUsername} 
            password={password} 
            setPassword={setPassword} 
            error={error}
        />
    )
}

export default Login;