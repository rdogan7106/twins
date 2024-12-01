"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GetUser } from "../api/api"; 

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUser = async () => {
        try {
          const userData = await GetUser();          
          setUser(userData.user);
          setUserIsLoggedIn(true);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser(); 
    }
  }, [userIsLoggedIn]);
  return (
    <AppContext.Provider value={{ userIsLoggedIn, setUserIsLoggedIn, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};
