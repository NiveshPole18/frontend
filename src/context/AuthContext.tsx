import React, { createContext, useState, useEffect, useContext } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    return !!(userId && token);
  });

  useEffect(() => {
    const checkLoginStatus = () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!(userId && token));
    };

    checkLoginStatus();
    window.addEventListener('loginStateChange', checkLoginStatus);

    return () => {
      window.removeEventListener('loginStateChange', checkLoginStatus);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

