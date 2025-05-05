import { Conference } from "../models/conference";
import { useConference } from "../context/ConferenceContext";

export const mapApiResponseToConference = (apiConference: any): Conference => {
  return {
    id: apiConference.conference_id || "",
    name: apiConference.name || "",
    acronym: apiConference.acronym || "",
    shortAcronym: apiConference.short_acronym || "",
    website: apiConference.website || "",
    city: apiConference.city || "",
    description: apiConference.description || "",
    venue: apiConference.venue || "",
    state: apiConference.state || "",
    country: apiConference.country || "",
    submissionPage: apiConference.submission_page || "",
    licenseExpiry: apiConference.license_expiry || "",
    contactEmails: apiConference.contact_emails || [],
    createdBy: apiConference.created_by || "",
    createdAt: apiConference.created_at?.$date || apiConference.created_at || "",
    superchairs: apiConference.superchairs || [],
    trackChairs: apiConference.track_chairs || [],
    pcMembers: apiConference.pc_members || [],
    authors: apiConference.authors || [],
    doubleBlindReview: apiConference.double_blind_review || { value: false, scope: "conference" },
    canPcSeeUnassignedSubmissions: apiConference.can_pc_see_unassigned_submissions || { value: false, scope: "conference" },
    abstractBeforeFull: apiConference.abstract_before_full || { value: false, scope: "conference" },
    abstractSectionHidden: apiConference.abstract_section_hidden || { value: false, scope: "track" },
    maxAbstractLength: apiConference.max_abstract_length || { value: 0, scope: "track" },
    submissionInstructions: apiConference.submission_instructions || { value: "", scope: "track" },
    additionalFieldsEnabled: apiConference.additional_fields_enabled || { value: false, scope: "track" },
    fileUploadFields: apiConference.file_upload_fields || { value: "", scope: "track" },
    submissionUpdatesAllowed: apiConference.submission_updates_allowed || { value: false, scope: "track" },
    newSubmissionAllowed: apiConference.new_submission_allowed || { value: false, scope: "conference" },
    useBiddingOrRelevance: apiConference.use_bidding_or_relevance || { value: "relevance", scope: "track" },
    biddingEnabled: apiConference.bidding_enabled || { value: false, scope: "track" },
    chairsCanViewBids: apiConference.chairs_can_view_bids || { value: false, scope: "track" },
    reviewersPerPaper: apiConference.reviewers_per_paper || { value: 0, scope: "track" },
    canPcSeeReviewerNames: apiConference.can_pc_see_reviewer_names || { value: false, scope: "track" },
    statusMenuEnabled: apiConference.status_menu_enabled || { value: false, scope: "track" },
    pcCanEnterReview: apiConference.pc_can_enter_review || { value: false, scope: "track" },
    pcCanAccessReviews: apiConference.pc_can_access_reviews || { value: false, scope: "track" },
    decisionRange: apiConference.decision_range || { value: 0, scope: "track" },
    subreviewersAllowed: apiConference.subreviewers_allowed || { value: false, scope: "track" },
    subreviewerAnonymous: apiConference.subreviewer_anonymous || { value: false, scope: "track" },
    trackChairNotifications: apiConference.track_chair_notifications || { value: false, scope: "track" },
    tracks: apiConference.tracks || [],
    startDate: apiConference.start_date?.$date || apiConference.start_date || "",
    endDate: apiConference.end_date?.$date || apiConference.end_date || "",
  };
};

export const getAllConferences = async (): Promise<Conference[]> => {
  try {
    const response = await fetch("http://127.0.0.1:5000/conference/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching conferences: ${response.statusText}`);
    }

    const data = await response.json();
    // Transform API response to match the Conference interface
    return data.conferences.map(mapApiResponseToConference);
  } catch (error) {
    console.error("Failed to fetch conferences:", error);
    throw error;
  }
};

export const createConference = async (
  payload: Record<string, any>
): Promise<number> => {
  try {
    const res = await fetch("http://127.0.0.1:5000/conference/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || res.statusText);
    }
    return data.conference_id as number;
  } catch (err) {
    console.error("Failed to create conference:", err);
    throw err;
  }
};

export const createConferenceFromSeries = async (
  payload: Record<string, any>
): Promise<number> => {
  try {
    const res = await fetch("http://127.0.0.1:5000/conference/create_from_series", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || res.statusText);
    }
    return data.conference_id as number;
  } catch (err) {
    console.error("Failed to create conference from series:", err);
    throw err;
  }
};

/**
 * Fetches a specific conference by its ID
 * 
 * @param conferenceId - ID of the conference to fetch
 * @returns Promise with the Conference object
 */
export const getConferenceById = async (conferenceId: string): Promise<Conference> => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/conference/${conferenceId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching conference: ${response.statusText}`);
    }

    const data = await response.json();
    return mapApiResponseToConference(data.conference);
  } catch (error) {
    console.error(`Failed to fetch conference with ID ${conferenceId}:`, error);
    throw error;
  }
};

/**
 * Refreshes the active conference by fetching the latest data from the backend
 * and updating the conference context
 * 
 * @param conferenceId - ID of the conference to refresh
 * @returns Promise with the updated Conference object
 */
export const refreshActiveConference = async (conferenceId: string): Promise<Conference> => {
  try {
    // Fetch the latest data
    const updatedConference = await getConferenceById(conferenceId);
    
    // Get the context setter function (this needs to be used inside a component)
    return updatedConference;
  } catch (error) {
    console.error(`Failed to refresh conference with ID ${conferenceId}:`, error);
    throw error;
  }
};

// React hook version for use inside components
export const useRefreshConference = () => {
  const { setActiveConference } = useConference();
  
  return async (conferenceId: string): Promise<Conference> => {
    try {
      const updatedConference = await getConferenceById(conferenceId);
      setActiveConference(updatedConference);
      return updatedConference;
    } catch (error) {
      console.error(`Failed to refresh conference with ID ${conferenceId}:`, error);
      throw error;
    }
  };
};

/**
 * Invites users to a conference
 * 
 * @param userIds - Array of user IDs to invite
 * @param conferenceId - ID of the conference
 * @param conferenceName - Name of the conference
 * @returns Promise with the response data
 */
export const invitePeopleToConference = async (
  userIds: string[],
  conferenceId: string,
  conferenceName: string
): Promise<any> => {
  try {
    // Send multiple requests, one for each user
    const invitePromises = userIds.map(userId => {
      const payload = {
        user_id: userId,
        conference_name: conferenceName
      };
      
      return fetch(`http://127.0.0.1:5000/conference/${conferenceId}/invite_pc_member`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.error || `Failed to invite user ${userId}`);
          });
        }
        return response.json();
      });
    });
    
    // Wait for all invitations to be processed
    const results = await Promise.all(invitePromises);
    
    return {
      success: true,
      message: `Successfully invited ${results.length} users to ${conferenceName} (ID: ${conferenceId})`,
      results
    };
  } catch (error) {
    console.error("Failed to invite people to conference:", error);
    throw error;
  }
};

/**
 * Assigns a user as a superchair for a conference
 * 
 * @param userId - ID of the user to assign as superchair
 * @param conferenceId - ID of the conference
 * @returns Promise with the response data
 */
export const assignSuperchair = async (
  userId: string,
  conferenceId: string
): Promise<any> => {
  try {
    const payload = {
      user_id: userId
    };
    
    const response = await fetch(`http://127.0.0.1:5000/conference/${conferenceId}/superchair`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `Failed to assign user ${userId} as superchair`);
    }
    
    const result = await response.json();
    return {
      success: true,
      message: `Successfully assigned user ${userId} as superchair for conference ID: ${conferenceId}`,
      result
    };
  } catch (error) {
    console.error("Failed to assign superchair:", error);
    throw error;
  }
};

/**
 * Fetches the user's conference series
 * 
 * @returns Promise with the list of conference series
 */
export const getMyConferenceSeries = async (): Promise<any[]> => {
  try {
    const response = await fetch("http://127.0.0.1:5000/conference/series/my_series", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching conference series: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Conference series data from API:", data); // Debug log
    return data.conference_series_list || [];
  } catch (error) {
    console.error("Failed to fetch conference series:", error);
    throw error;
  }
};