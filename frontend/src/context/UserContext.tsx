import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData } from '../models/user';
import userService from '../services/userService';

// Define the context type
interface UserContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  login: (userData: UserData) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserData>) => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from session storage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        // First try to get user from session storage
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }
        // Skip fetching if not authenticated
        const isAuth = sessionStorage.getItem('isAuthenticated');
        if (!isAuth) {
          setLoading(false);
          return;
        }
        // If authenticated but no stored user, fetch profile
        const response = await userService.getCurrentUserProfile();
        if (response.status === 'success' && response.user) {
          setUser(response.user);
          // Store in session storage
          sessionStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: UserData) => {
    setUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    sessionStorage.setItem('isAuthenticated', 'true');
    setError(null);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isAuthenticated');
    // In a real app, you would also make an API call to invalidate the session
    // For example: userService.logout()
  };

  const updateUser = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};