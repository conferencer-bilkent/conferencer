/**
 * User-related interface definitions for the conferencer application.
 * These interfaces define the data structures used for user profiles and related functionality.
 */

/**
 * Interface for a user role, representing a position in a conference
 */
export interface Role {
  name: string;
  conferenceId?: string;
  trackId?: string;
}

/**
 * Interface for user roles categorized by active and past
 */
export interface UserRoles {
  active: Role[];
  past: Role[];
}

/**
 * Interface for a key-value pair statistic
 */
export interface StatItem {
  label: string;
  value: string;
}

/**
 * Interface for user statistics
 */
export interface UserStats {
  totalReviews?: number;
  conferencesWorked?: number;
  submissions?: number;
  otherStats?: StatItem[];
}

/**
 * Main user data interface that contains all user information
 */
export interface UserData {
  id: string;
  name: string;
  surname: string;
  email: string;
  bio: string;
  roles: UserRoles;
  stats: UserStats;
  auth_provider: string;
  google_id?: string | null;
  orcid_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface for user profile response from the API
 */
export interface UserProfileResponse {
  user: UserData;
  status: string;
  message?: string;
}

/**
 * Interface for user profile update request
 */
export interface UserProfileUpdateRequest {
  name?: string;
  surname?: string;
  bio?: string;
  email?: string;
}

/**
 * Interface for user profile update response
 */
export interface UserProfileUpdateResponse {
  status: string;
  message: string;
  user?: UserData;
}