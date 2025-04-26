import { 
  UserData, 
} from '../models/user';

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

const userService = {
  getUserById,
 loginUser,
  signupUser,
  logoutUser,
  checkSession,  // Add checkSession to the exported object
};

export default userService;