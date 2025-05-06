import { Track, mapResponseToTrack } from "../models/track";
import { Paper, mapResponseToPaper } from "../models/paper";
import { Assignment } from "../models/assignment";
import { Conflict, mapConflicts } from "../models/conflict";

// The API base URL - adjust if needed
const API_BASE_URL = "http://127.0.0.1:5000";

/**
 * Creates a new track in the system
 * 
 * @param trackData - The track data to create
 * @returns Promise with the created track ID
 */
export const createTrack = async (trackData: any): Promise<string> => {
  try {
    // Map all track data fields
    const payload = {
      track_name: trackData.name,
      conference_id: trackData.conference_id,
      description: trackData.description || '', // Add description field
      track_chairs: trackData.track_chairs || [], // Optional: Add track chairs if present
      track_members: trackData.track_members || [], // Optional: Add track members if present
    };

    console.log("Creating track with payload:", payload);

    const response = await fetch(`${API_BASE_URL}/track/create`, {
      method: "POST",
      credentials: "include", // Important for cookies/session
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create track");
    }

    const data = await response.json();
    return data.track_id; // Return the ID of the created track
  } catch (error) {
    console.error("Error creating track:", error);
    throw error;
  }
};

/**
 * Get all tracks from the API
 * 
 * @returns Promise with array of tracks
 */
// export const getAllTracks = async (): Promise<Track[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/tracks`, {
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || "Failed to fetch tracks");
//     }x

//     const data = await response.json();
//     // Map response tracks to Track objects
//     return data.tracks.map((track: any) => mapResponseToTrack(track));
//   } catch (error) {
//     console.error("Error fetching tracks:", error);
//     throw error;
//   }
// };

/**
 * Get track by ID from the API
 * 
 * @param trackId - ID of the track to fetch
 * @returns Promise with track data
 */
export const getTrackById = async (trackId: string): Promise<Track> => {
  try {
    const response = await fetch(`${API_BASE_URL}/track/${trackId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch track");
    }

    const data = await response.json();
    console.log("Track data:", data);
    return mapResponseToTrack(data);
  } catch (error) {
    console.error(`Error fetching track ${trackId}:`, error);
    throw error;
  }
};

/**
 * Get papers for a specific track
 * 
 * @param trackId - ID of the track to fetch papers for
 * @returns Promise with array of papers
 */
export const getPapersForTrack = async (trackId: string): Promise<Paper[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/track/${trackId}/papers`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch papers");
    }

    const data = await response.json();
    // Map each raw paper object from the API response to a Paper object
    return data.papers.map((paper: any) => mapResponseToPaper(paper));
  } catch (error) {
    console.error(`Error fetching papers for track ${trackId}:`, error);
    throw error;
  }
};

/**
 * Get conflicts of interest for a track
 * 
 * @param trackId - ID of the track to fetch conflicts for
 * @returns Promise with array of conflicts
 */
export const getConflictsForTrack = async (trackId: string): Promise<Conflict[]> => {
  console.log(`Fetching conflicts for track: ${trackId}`);
  try {
    const url = `${API_BASE_URL}/track/${trackId}/conflicts`;
    console.log(`Making API call to: ${url}`);
    
    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch conflicts");
    }

    const data = await response.json();
    console.log("Conflicts API response:", data);
    return mapConflicts(data.conflicts || []);
  } catch (error) {
    console.error(`Error fetching conflicts for track ${trackId}:`, error);
    throw error;
  }
};

/**
 * Get assignments for a specific paper
 * 
 * @param paperId - ID of the paper to fetch assignments for
 * @returns Promise with array of assignments
 */
export const getAssignmentsByPaper = async (paperId: string): Promise<Assignment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignment/paper/${paperId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch assignments for paper");
    }

    const data = await response.json();
    console.log("Assignments data:", data);
    
    
    // Map each raw assignment to the Assignment interface
    return data.map((assignment: any) => ({
      _id: assignment._id,
      id: assignment.id,
      reviewer_id: assignment.reviewer_id,
      paper_id: assignment.paper_id,
      track_id: assignment.track_id,
      created_at: assignment.created_at,
      // only default to true if is_pending is null or undefined
      is_pending: assignment.is_pending ?? true
    }));
  } catch (error) {
    console.error(`Error fetching assignments for paper ${paperId}:`, error);
    throw error;
  }
};

/**
 * Update the accept/reject decision for a paper
 */
export const updatePaperDecision = async (
  paperId: string,
  decision: boolean
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/paper/${paperId}/decide`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    }
  );
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to update decision");
  }
};

/**
 * Submit a bidding for a paper
 * 
 * @param paperId - ID of the paper to bid on
 * @param bid - Bid value (e.g., interest level 1-5)
 * @returns Promise resolving when bidding is successful
 */
export const submitPaperBid = async (
  paperId: string, 
  bid: number
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/paper/${paperId}/bid`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bid }),
    }
  );
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to submit bidding");
  }
};

// Handle submitting a bid

/**
 * Get biddings for a specific paper
 * 
 * @param paperId - ID of the paper
 * @returns Promise with array of bidding user IDs
 */
export const getBiddingsForPaper = async (paperId: string): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/paper/${paperId}/biddings`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to get biddings");
  }
  const data = await response.json();
  return data.biddings;
};

/**
 * Maps API response to Track model
 * 
 * @param data - API response data
 * @returns Track object
 */
export const mapApiResponseToTrack = mapResponseToTrack;

export interface Review {
  _id: string;
  paper_id: string;
  reviewer_id: string;
  reviewer_name: string;
  subreviewer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  evaluation: number;
  confidence: number;
  evaluation_text: string;
  remarks: string;
  rates: any[];
  created_at: string;
}

export const getReviewByAssignment = async (reviewId: string): Promise<Review> => {
  try {
    const response = await fetch(`${API_BASE_URL}/review/${reviewId}/assignment`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch review by assignment");
    }

    const data = await response.json();
    return data as Review;
  } catch (error) {
    console.error(`Error fetching review with id ${reviewId}:`, error);
    throw error;
  }
};

/**
 * Rate a review (0–10)
 */
export const rateReview = async (
  reviewId: string,
  rate: number
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/review/${reviewId}/rate`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rate }),
    }
  );
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to submit review rating");
  }
};