/**
 * User-related interface definitions for the conferencer application.
 * These interfaces define the data structures used for user profiles and related functionality.
 */

/**
 * Interface for a user role, representing a position in a conference
 */
export interface Role {
  id: string
  conference_id: string
  track_id: string
  position: string
  is_active: boolean
}

export const emptyRole: Role = { 
  id: "-",
  conference_id: "-",
  track_id: "-",
  position: "-",
  is_active: false, // Default value for is_active 
};

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
  _id?: {
    $oid: string;
  };
  totalReviews?: number;
  conferencesWorked?: number;
  submissions?: number;
  avg_rating_given?: number;
  avg_submit_time_before_deadline?: number;
  avg_time_to_review?: number;
  avg_words_per_review?: number;
  deadline_compliance_rate?: number;
  review_rating?: number;
}

/**
 * Main user data interface that contains all user information
 */
export interface UserData {
  _id?: {
    $oid: string;
  };
  id: string;
  name: string | null;
  surname?: string | null;
  email: string;
  bio: string | null;
  roles?: string[]; // Changed to string[] to match API response
  stats: UserStats[]; // Changed to array to match API response
  auth_provider?: string;
  google_id?: string | null;
  orcid_id?: string | null;
  created_at?: string;
  updated_at?: string;
  preferred_keywords?: string[];
  not_preferred_keywords?: string[];
  country?: string |null;
  organization?: string | null;
  affiliation?: string | null;
  past_affiliations?: string[] | null;
}

// Add a utility function to get the first stats object
export function getUserStats(userData: UserData): UserStats {
  return userData.stats[0] || {}; // Return first stats or empty object if none exists
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