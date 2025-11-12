import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demonstration
const MOCK_USER: User = {
    id: 'user-admin-01',
    name: 'Admin User',
    email: 'admin@ecosysthem.com',
    role: 'admin',
    avatarUrl: 'https://picsum.photos/seed/admin/100',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, pass: string) => {
    console.log(`Attempting login with email: ${email}`);
    // Simulate API call
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            // In a real app, you would validate credentials against a backend.
            // For this demo, any non-empty email/password will work.
            if (email && pass) {
                setIsAuthenticated(true);
                setUser(MOCK_USER);
                console.log("Login successful");
            }
            resolve();
        }, 1000);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    console.log("User logged out");
  };

  const value = { isAuthenticated, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
