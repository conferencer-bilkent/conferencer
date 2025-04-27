import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserData } from "../models/user";
import userService from "../services/userService";

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
  // Try to load the user from sessionStorage first for immediate availability
  const initialUser = (() => {
    try {
      const storedUser = sessionStorage.getItem("currentUser");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Error parsing user from sessionStorage:", e);
      return null;
    }
  })();

  // Initialize user with the value from sessionStorage
  const [user, setUser] = useState<UserData | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from session storage and validate with server
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check with the server to validate the session
        const data = await userService.checkSession();

        if (data.logged_in && data.user) {
          // Update user data with the fresh data from the server
          setUser(data.user);
          sessionStorage.setItem("currentUser", JSON.stringify(data.user));
        } else if (data.logged_in === false) {
          // If server says not logged in, clear the user
          setUser(null);
          sessionStorage.removeItem("currentUser");
        }
        // If we can't reach the server but have stored user data, keep using it
      } catch (err) {
        console.error("Error loading user session:", err);
        // We keep the user from sessionStorage in case of server errors
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: UserData) => {
    setUser(userData);
    sessionStorage.setItem("currentUser", JSON.stringify(userData));
    sessionStorage.setItem("isAuthenticated", "true");
    setError(null);
  };

  const logout = async () => {
    try {
      await userService.logoutUser();
    } catch (err) {
      console.error("Error during logout:", err);
    }
    setUser(null);
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("isAuthenticated");
  };

  const updateUser = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      console.log("Updated user context:", updatedUser);
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      const newcurrent = sessionStorage.getItem("currentUser");
      console.log("Updated user in sessionStorage:", newcurrent);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
