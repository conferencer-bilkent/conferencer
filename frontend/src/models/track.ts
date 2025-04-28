
/**
 * Interface for the Track model
 */
export interface Track {
  id: string;                     // _id in backend
  name: string;                   // track_name in backend
  conferenceId: string;           // conference_id in backend
  acronym?: string;               // track_acronym in backend
  description?: string;
  trackChairs: string[];          // track_chairs in backend
  papers: string[];               // papers in backend
  reviews: string[];              // reviews in backend
  assignments: any[];             // assignments in backend
  createdAt: string;              // created_at in backend
  
  // Submission Information
  abstractBeforeFull?: boolean;
  abstractSectionHidden?: boolean;
  multipleAuthorsAllowed?: boolean;
  maxAbstractLength?: number;
  submissionInstructions?: string;
  additionalFieldsEnabled?: boolean;
  fileUploadFields?: string;
  presenterSelectionRequired?: boolean;
  submissionUpdatesAllowed?: boolean;
  
  // Paper Assignment
  useBiddingOrRelevance?: string;
  biddingEnabled?: boolean;
  chairsCanViewBids?: boolean;
  llmFraudDetection?: boolean;
  reviewersPerPaper?: number;
  
  // Reviewing Information
  canPcSeeReviewerNames?: boolean;
  statusMenuEnabled?: boolean;
  pcCanEnterReview?: boolean;
  pcCanAccessReviews?: string;
  decisionRange?: number;
  subreviewersAllowed?: boolean;
  subreviewerAnonymous?: boolean;
  
  // Notifications
  trackChairNotifications?: boolean;
}

/**
 * Creates a default Track object
 */
export const createDefaultTrack = (): Track => {
  return {
    id: '',
    name: '',
    conferenceId: '',
    acronym: '',
    description: '',
    trackChairs: [],
    papers: [],
    reviews: [],
    assignments: [],
    createdAt: new Date().toISOString(),
    
    // Default settings for a new track
    abstractBeforeFull: false,
    abstractSectionHidden: false,
    multipleAuthorsAllowed: true,
    maxAbstractLength: undefined,
    submissionInstructions: '',
    additionalFieldsEnabled: false,
    fileUploadFields: 'paper',
    presenterSelectionRequired: false,
    submissionUpdatesAllowed: true,
    
    useBiddingOrRelevance: 'relevance',
    biddingEnabled: false,
    chairsCanViewBids: true,
    llmFraudDetection: false,
    reviewersPerPaper: 3,
    
    canPcSeeReviewerNames: false,
    statusMenuEnabled: true,
    pcCanEnterReview: true,
    pcCanAccessReviews: 'assigned',
    decisionRange: 5,
    subreviewersAllowed: false,
    subreviewerAnonymous: true,
    
    trackChairNotifications: false
  };
};

/**
 * Maps response data from the API to a Track object
 * @param data The response data from the API
 * @returns A Track object
 */
export const mapResponseToTrack = (data: any): Track => {
  return {
    id: data._id || '',
    name: data.track_name || '',
    conferenceId: data.conference_id || '',
    acronym: data.track_acronym || '',
    trackChairs: data.track_chairs || [],
    papers: data.papers || [],
    reviews: data.reviews || [],
    assignments: data.assignments || [],
    createdAt: data.created_at || new Date().toISOString(),
    
    // Map all additional fields if they exist in the response
    abstractBeforeFull: data.abstract_before_full,
    abstractSectionHidden: data.abstract_section_hidden,
    multipleAuthorsAllowed: data.multiple_authors_allowed,
    maxAbstractLength: data.max_abstract_length,
    submissionInstructions: data.submission_instructions,
    additionalFieldsEnabled: data.additional_fields_enabled,
    fileUploadFields: data.file_upload_fields,
    presenterSelectionRequired: data.presenter_selection_required,
    submissionUpdatesAllowed: data.submission_updates_allowed,
    
    useBiddingOrRelevance: data.use_bidding_or_relevance,
    biddingEnabled: data.bidding_enabled,
    chairsCanViewBids: data.chairs_can_view_bids,
    llmFraudDetection: data.llm_fraud_detection,
    reviewersPerPaper: data.reviewers_per_paper,
    
    canPcSeeReviewerNames: data.can_pc_see_reviewer_names,
    statusMenuEnabled: data.status_menu_enabled,
    pcCanEnterReview: data.pc_can_enter_review,
    pcCanAccessReviews: data.pc_can_access_reviews,
    decisionRange: data.decision_range,
    subreviewersAllowed: data.subreviewers_allowed,
    subreviewerAnonymous: data.subreviewer_anonymous,
    
    trackChairNotifications: data.track_chair_notifications
  };
};