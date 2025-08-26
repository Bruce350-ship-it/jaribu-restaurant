import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { router } from 'expo-router';
import axiosClient from '../api/axiosClient';
import { Storage, STORAGE_KEYS } from './storage';
import { User, Order } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  shouldPromptFeedback: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  requireAuth: (redirectPath?: string) => boolean;
  dismissFeedbackPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldPromptFeedback, setShouldPromptFeedback] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (user) {
      checkFeedbackPrompt();
    }
  }, [user]);

  const restoreSession = async () => {
    try {
      const token = await Storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        const response = await axiosClient.get('/api/users/me');
        setUser(response.data);
      }
    } catch (error) {
      await Storage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const checkFeedbackPrompt = async () => {
    if (!user) return;

    try {
      const feedbackRes = await axiosClient.get(`/api/feedback/${user.id}`);
      if (feedbackRes.data.promptFeedback) {
        setShouldPromptFeedback(true);
      }
    } catch (error) {
      // Ignore errors for feedback check
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await axiosClient.post('/api/auth/login', { email, password });
    const { token, user: userData } = response.data;
    
    await Storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await Storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    setUser(userData);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await axiosClient.post('/api/auth/register', { name, email, password });
    const { token, user: userData } = response.data;
    
    await Storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await Storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = async () => {
    await Storage.clear();
    setUser(null);
    setShouldPromptFeedback(false);
    router.replace('/');
  };

  const requireAuth = (redirectPath: string = '/auth/login'): boolean => {
    if (!isAuthenticated) {
      router.replace(redirectPath);
      return false;
    }
    return true;
  };

  const dismissFeedbackPrompt = () => {
    setShouldPromptFeedback(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        shouldPromptFeedback,
        signIn,
        signUp,
        signOut,
        requireAuth,
        dismissFeedbackPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}