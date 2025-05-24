"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean; // Indicates if auth state is being loaded
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// WARNING: This is a simplified local storage based auth for demo purposes.
// It is NOT secure and should NOT be used in production.
// Real applications require a proper backend authentication system with secure password hashing.
const USERS_STORAGE_KEY = 'product_assist_users';
const LOGGED_IN_USER_KEY = 'product_assist_loggedInUser';

interface StoredUser extends User {
  // In a real app, this would be a securely hashed password (e.g., bcrypt).
  // Storing plain text or easily reversible passwords is a major security risk.
  passwordHash: string; 
}

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  try {
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error parsing stored users:", e);
    return [];
  }
};

const saveStoredUsers = (users: StoredUser[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (loggedInUserEmail) {
      const users = getStoredUsers();
      const existingUser = users.find(u => u.email === loggedInUserEmail);
      if (existingUser) {
        setUser({ email: existingUser.email });
      } else {
        // Clear invalid stored user
        localStorage.removeItem(LOGGED_IN_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === email);

    // Simplified password check. DO NOT USE IN PRODUCTION.
    if (existingUser && existingUser.passwordHash === pass) { 
      setUser({ email });
      localStorage.setItem(LOGGED_IN_USER_KEY, email);
      toast({ title: "Login Successful", description: `Welcome back, ${email}!` });
      setIsLoading(false);
      return true;
    }
    toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    let users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      toast({ title: "Signup Failed", description: "Email already exists.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
    // Simplified password storage. DO NOT USE IN PRODUCTION.
    users.push({ email, passwordHash: pass }); 
    saveStoredUsers(users);
    setUser({ email });
    localStorage.setItem(LOGGED_IN_USER_KEY, email);
    toast({ title: "Signup Successful", description: `Welcome, ${email}!` });
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    router.push('/login'); // Redirect to login after logout
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
