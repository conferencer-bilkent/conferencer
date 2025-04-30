import { 
  UserData, 
} from '../models/user';

import { Role } from '../models/user';  // adjust path if needed

// import { 
//   dummyUserProfileResponse, 
//   getDummyUserById, 
//   getDummyUserByEmail 
// } from '../utils/dummyData/dummyUserData';

// This would typically come from environment variables
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Fetches the profile for the currently logged-in user
 * 
 * @returns Promise with user profile response
 */

/**
 * Fetches a user profile by ID
 * 
 * @param userId - The ID of the user to fetch
 * @returns Promise with user data directly
 */
export const getUserById = async (userId: string): Promise<UserData> => {
  try {
        const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // If we get a 401 (Unauthorized), don't invalidate the session
      // Just throw an error about the profile being inaccessible
      if (response.status === 401) {
        throw new Error('Cannot access this user profile');
      }
      
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user profile');
    }
    console.log('User profile response:', response);
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetches a user profile by email
 * 
 * @param email - The email of the user to fetch
 * @returns Promise with user profile response
 */

/**
 * Updates the current user's profile
 * 
 * @param updateData - The data to update in the user profile
 * @returns Promise with user profile update response
 */
/**
 * Fetches all active roles for the current user
 * 
 * @returns Promise with array of user roles
 */

/**
 * Fetches user statistics
 * 
 * @param userId - Optional user ID. If not provided, fetches stats for the current user
 * @returns Promise with user statistics
 */

/**
 * Logs in a user with email and password
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: UserData; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
};

/**
 * Registers a new user
 */
export const signupUser = async (
  requestData: { name: string; surname: string; email: string; password: string }
): Promise<{ user: UserData; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(requestData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
};

/**
 * Logs out the current user
 */
export const logoutUser = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Logout failed');
  }
  return data;
};

/**
 * Checks if the user is logged in and returns session data
 */ 
export const checkSession = async (): Promise<{ logged_in: boolean; user: UserData | null }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/session`, {
      method: 'GET',
      credentials: 'include',
    });
    
    const data = await response.json();
    console.log('Session check response:', data);
    
    if (!response.ok) {
      // Return a standardized response instead of throwing an error
      return { logged_in: false, user: null };
    }
    
    return data;
  } catch (error) {
    console.error('Session check error:', error);
    // Return a consistent response even if the request fails
    return { logged_in: false, user: null };
  }
};

/**
 * Fetches all users from the system
 * 
 * @returns Promise with array of user data
 */
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch users');
    }
    
    const data = await response.json();
    // The response is an array directly, not wrapped in a users property
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

/**
 * Fetches a single role by its ID
 * 
 * @param roleId - The ID of the role to fetch
 * @returns Promise resolving to the Role object
 */
export const getRole = async (roleId: string): Promise<Role> => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/role/${roleId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || `Failed to fetch role ${roleId}`);
    }

    return await response.json() as Role;
  } catch (error) {
    console.error(`Error fetching role with ID ${roleId}:`, error);
    throw error;
  }
};

const userService = {
  getUserById,
 loginUser,
  signupUser,
  logoutUser,
  checkSession,  // Add checkSession to the exported object
};

export default userService;