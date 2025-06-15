import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase/firebaseConfig';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth ? JSON.parse(savedAuth) : false;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
    localStorage.setItem('token', token);
  }, [user, isAuthenticated, token]);


  useEffect(() => {
    const handleTokenExpiration = () => {
   
      const expirationTime = Date.now() + 3600 * 1000; 
      const logoutTimeout = setTimeout(() => {
        logout(); 
      }, expirationTime - Date.now());

      return () => clearTimeout(logoutTimeout);
    };

    if (isAuthenticated) {
      handleTokenExpiration();
    }
  }, [isAuthenticated]);

  const login = async (email, name, uid) => {
    const token = await auth.currentUser.getIdToken(true);
    setUser({ email, name, uid });
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    console.log('User logged out');
  };

  return (
    <LoginContext.Provider value={{ user, isAuthenticated, token, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginProvider = () => useContext(LoginContext);
