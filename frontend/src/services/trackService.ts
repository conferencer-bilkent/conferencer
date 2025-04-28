import { Track, mapResponseToTrack } from "../models/track";

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
    // For now, we only send track_name and conference_id
    const payload = {
      track_name: trackData.name, // Mapping from form field to API field
      conference_id: trackData.conference_id
    };

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
    return mapResponseToTrack(data.track);
  } catch (error) {
    console.error(`Error fetching track ${trackId}:`, error);
    throw error;
  }
};

/**
 * Maps API response to Track model
 * 
 * @param data - API response data
 * @returns Track object
 */
export const mapApiResponseToTrack = mapResponseToTrack;