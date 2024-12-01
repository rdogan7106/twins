"use client";
import React, { useState,useContext } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "../../components/RegisterForm";
import { createUser } from "../../api/api";
import { AppContext } from "../../context/AppContext";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { userIsLoggedIn, setUserIsLoggedIn } = useContext(AppContext);

    const handleRegisterClick = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await createUser(username, password, email);
            console.log('User created:', data);
            localStorage.setItem('token', data.token);
        
            localStorage.setItem('user', JSON.stringify({
                username: username,
                email: email
            }));
            setUserIsLoggedIn(true);
            router.push('/dashboard-items');
        } catch (err) {
            setError(err.message || 'An error occurred during registration');
        }
    }

    const handleLoginPageClick = (e) => {
        e.preventDefault();
        router.push('/login');
    }

    return (
        <RegisterForm 
            username={username} 
            setUsername={setUsername} 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword} 
            handleRegisterClick={handleRegisterClick} 
            handleLoginPageClick={handleLoginPageClick} 
            error={error} 
            setError={setError}
        />
    )
}

export default Register;