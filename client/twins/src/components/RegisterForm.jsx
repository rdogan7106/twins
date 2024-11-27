"use client";
import React, { useState } from 'react';
const  RegisterForm = ({username, setUsername, email, setEmail, password, setPassword,handleRegisterClick,handleLoginPageClicks ,error, setError}) => {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg " style={{ width: '40%' }}>
                <div className="card-body m-5">
                    <form onSubmit={handleRegisterClick}>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-outline mb-4"> 
                            <input 
                                type="text" 
                                id="username" 
                                className="form-control" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />            
                            <label className="form-label" htmlFor="username">Username</label>
                        </div>  

                        <div className="form-outline mb-4">
                            <input 
                                type="email" 
                                id="email" 
                                className="form-control" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label className="form-label" htmlFor="email">Email</label>
                        </div>

                        <div className="form-outline mb-4"> 
                            <input 
                                type="password" 
                                id="password" 
                                className="form-control" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="form-label" htmlFor="password">Password</label>    
                        </div>

                        <button type="submit" className="btn btn-primary btn-block mb-4 w-100">Sign up</button> 

                        <div className="text-center mt-3">  
                            <p>Already a member? <a href="/login" onClick={handleLoginPageClicks}>Login</a></p>
                        </div>  
                    </form>
                </div>        
            </div>
        </div>     
    );
}    

export default RegisterForm