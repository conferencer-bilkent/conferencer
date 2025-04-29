import { Conference } from "../models/conference";

export const mapApiResponseToConference = (apiConference: any): Conference => {
  return {
    id: apiConference.conference_id || "",
    name: apiConference.name || "",
    acronym: apiConference.acronym || "",
    shortAcronym: apiConference.short_acronym || "",
    website: apiConference.website || "",
    city: apiConference.city || "",
    venue: apiConference.venue || "",
    state: apiConference.state || "",
    country: apiConference.country || "",
    submissionPage: apiConference.submission_page || "",
    licenseExpiry: apiConference.license_expiry || "",
    contactEmails: apiConference.contact_emails || [],
    forwardingEmailsConference: apiConference.forwarding_emails_conference || [],
    forwardingEmailsTracks: apiConference.forwarding_emails_tracks || [],
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
    multipleAuthorsAllowed: apiConference.multiple_authors_allowed || { value: false, scope: "track" },
    maxAbstractLength: apiConference.max_abstract_length || { value: 0, scope: "track" },
    submissionInstructions: apiConference.submission_instructions || { value: "", scope: "track" },
    additionalFieldsEnabled: apiConference.additional_fields_enabled || { value: false, scope: "track" },
    fileUploadFields: apiConference.file_upload_fields || { value: "", scope: "track" },
    presenterSelectionRequired: apiConference.presenter_selection_required || { value: false, scope: "track" },
    submissionUpdatesAllowed: apiConference.submission_updates_allowed || { value: false, scope: "track" },
    newSubmissionAllowed: apiConference.new_submission_allowed || { value: false, scope: "conference" },
    autoUpdateSubmissionDates: apiConference.auto_update_submission_dates || "",
    useBiddingOrRelevance: apiConference.use_bidding_or_relevance || { value: "relevance", scope: "track" },
    biddingEnabled: apiConference.bidding_enabled || { value: false, scope: "track" },
    chairsCanViewBids: apiConference.chairs_can_view_bids || { value: false, scope: "track" },
    llmFraudDetection: apiConference.llm_fraud_detection || { value: false, scope: "track" },
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