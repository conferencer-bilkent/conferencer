import { 
  UserData, 
  UserProfileResponse, 
  UserProfileUpdateRequest, 
  UserProfileUpdateResponse 
} from '../models/user';

import { 
  dummyUserProfileResponse, 
  getDummyUserById, 
  getDummyUserByEmail 
} from '../utils/dummyData/dummyUserData';

// This would typically come from environment variables
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Fetches the profile for the currently logged-in user
 * 
 * @returns Promise with user profile response
 */
export const getCurrentUserProfile = async (): Promise<UserProfileResponse> => {
  // DUMMY DATA IMPLEMENTATION
  return Promise.resolve(dummyUserProfileResponse);

  /* ACTUAL API IMPLEMENTATION WOULD BE:
  try {
    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Includes cookies for session authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    throw error;
  }
  */
};

/**
 * Fetches a user profile by ID
 * 
 * @param userId - The ID of the user to fetch
 * @returns Promise with user profile response
 */
export const getUserById = async (userId: string): Promise<UserProfileResponse> => {
  // DUMMY DATA IMPLEMENTATION
  const user = getDummyUserById(userId);
  
  if (!user) {
    return Promise.reject(new Error('User not found'));
  }
  
  return Promise.resolve({
    user,
    status: 'success',
    message: 'User profile retrieved successfully'
  });

  /* ACTUAL API IMPLEMENTATION WOULD BE:
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Includes cookies for session authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
  */
};

/**
 * Fetches a user profile by email
 * 
 * @param email - The email of the user to fetch
 * @returns Promise with user profile response
 */
export const getUserByEmail = async (email: string): Promise<UserProfileResponse> => {
  // DUMMY DATA IMPLEMENTATION
  const user = getDummyUserByEmail(email);
  
  if (!user) {
    return Promise.reject(new Error('User not found'));
  }
  
  return Promise.resolve({
    user,
    status: 'success',
    message: 'User profile retrieved successfully'
  });

  /* ACTUAL API IMPLEMENTATION WOULD BE:
  try {
    const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Includes cookies for session authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
  */
};

/**
 * Updates the current user's profile
 * 
 * @param updateData - The data to update in the user profile
 * @returns Promise with user profile update response
 */
export const updateUserProfile = async (
  updateData: UserProfileUpdateRequest
): Promise<UserProfileUpdateResponse> => {
  // DUMMY DATA IMPLEMENTATION
  // In a real implementation, we'd make an API call and update the server data
  // Here we're just simulating a successful update
  return Promise.resolve({
    status: 'success',
    message: 'User profile updated successfully',
    user: {
      ...dummyUserProfileResponse.user,
      ...updateData,
      updated_at: new Date().toISOString()
    }
  });

  /* ACTUAL API IMPLEMENTATION WOULD BE:
  try {
    const response = await fetch(`${API_BASE_URL}/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Includes cookies for session authentication
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  */
};

/**
 * Fetches all active roles for the current user
 * 
 * @returns Promise with array of user roles
 */
export const getCurrentUserRoles = async () => {
  // DUMMY DATA IMPLEMENTATION
  return Promise.resolve(dummyUserProfileResponse.user.roles);

  /* ACTUAL API IMPLEMENTATION WOULD BE:
  try {
    const response = await fetch(`${API_BASE_URL}/profile/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Includes cookies for session authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user roles');
    }

    return (await response.json()).roles;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
  */
};

/**
 * Fetches user statistics
 * 
 * @param userId - Optional user ID. If not provided, fetches stats for the current user
 * @returns Promise with user statistics
 */
export const getUserStats = async (userId?: string) => {
  // DUMMY DATA IMPLEMENTATION
  if (userId) {
    const user = getDummyUserById(userId);
    return user ? Promise.resolve(user.stats) : Promise.reject(new Error('User not found'));
  }
  
  return Promise.resolve(dummyUserProfileResponse.user.stats);

  /* ACTUAL API IMPLEMENTATION WOULD BE:
  try {
    const endpoint = userId 
      ? `${API_BASE_URL}/users/${userId}/stats`
      : `${API_BASE_URL}/profile/stats`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Includes cookies for session authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user statistics');
    }

    return (await response.json()).stats;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
  */
};

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
 * Checks current session validity and retrieves user
 */
export const checkSession = async (): Promise<{ logged_in: boolean; user?: any; error?: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/session`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Session check failed');
  }
  return data;
};

// Export all user service functions
const userService = {
  getCurrentUserProfile,
  getUserById,
  getUserByEmail,
  updateUserProfile,
  getCurrentUserRoles,
  getUserStats,
  loginUser,
  signupUser,
  logoutUser,
  checkSession,
};

export default userService;