// Sample conference data that would come from backend
// These objects match the Conference model from the backend plus
// additional frontend display information

export interface ConferenceData {
  // Basic conference info
  id: string;
  name: string;
  acronym: string;
  short_acronym: string;
  website: string;
  city: string;
  venue: string;
  state: string;
  country: string;
  submission_page: string;
  license_expiry: string;
  contact_emails: string[];
  forwarding_emails_conference: string[];
  forwarding_emails_tracks: string[];
  created_by: string;
  created_at: string;
  description: string; // For frontend display

  // Conference configuration
  double_blind_review: boolean;
  can_pc_see_unassigned_submissions: boolean;
  abstract_before_full: boolean;
  abstract_section_hidden: boolean;
  multiple_authors_allowed: boolean;
  max_abstract_length: number;
  submission_instructions: string;
  additional_fields_enabled: boolean;
  file_upload_fields: any[];
  presenter_selection_required: boolean;
  submission_updates_allowed: boolean;
  new_submission_allowed: boolean;
  auto_update_submission_dates: boolean;
  use_bidding_or_relevance: string;
  bidding_enabled: boolean;
  chairs_can_view_bids: boolean;
  llm_fraud_detection: boolean;
  reviewers_per_paper: number;
  can_pc_see_reviewer_names: boolean;
  status_menu_enabled: boolean;
  pc_can_enter_review: boolean;
  pc_can_access_reviews: boolean;
  decision_range: number[];
  subreviewers_allowed: boolean;
  subreviewer_anonymous: boolean;
  track_chair_notifications: boolean;

  // Additional frontend display data
  track_dates: {
    start: string;
    end: string;
  };
  stats: {
    total_submissions: number;
    assigned_reviews: number;
    pending_reviews: number;
  };
}

// First sample conference
export const conference1: ConferenceData = {
  id: "65f8a7e9c3d2b1a0987654321",
  name: "knternational Conference on Artificial Intelligence",
  acronym: "ICAI 2025",
  short_acronym: "ICAI",
  website: "https://icai2025.org",
  city: "San Francisco",
  venue: "Moscone Center",
  state: "California",
  country: "USA",
  submission_page: "/submission/icai",
  license_expiry: "2025-12-31",
  contact_emails: ["chair@icai2025.org", "info@icai2025.org"],
  forwarding_emails_conference: ["all-chairs@icai2025.org"],
  forwarding_emails_tracks: ["ai-tracks@icai2025.org"],
  created_by: "61a2d3e4b5c6d7f8901234567",
  created_at: "2024-11-15T08:00:00.000Z",
  description: "he International Conference on Artificial Intelligence (ICAI) is a premier forum for researchers and practitioners to share their latest work in AI. The conference covers a broad range of topics including machine learning, natural language processing, computer vision, robotics, and AI ethics.",
  
  // Conference configuration
  double_blind_review: true,
  can_pc_see_unassigned_submissions: false,
  abstract_before_full: true,
  abstract_section_hidden: false,
  multiple_authors_allowed: true,
  max_abstract_length: 500,
  submission_instructions: "Please follow the ACM template for your submission. Papers should not exceed 8 pages including references.",
  additional_fields_enabled: true,
  file_upload_fields: [
    { name: "manuscript", required: true, file_types: [".pdf"] },
    { name: "supplementary", required: false, file_types: [".zip", ".pdf"] }
  ],
  presenter_selection_required: true,
  submission_updates_allowed: true,
  new_submission_allowed: true,
  auto_update_submission_dates: false,
  use_bidding_or_relevance: "bidding",
  bidding_enabled: true,
  chairs_can_view_bids: true,
  llm_fraud_detection: true,
  reviewers_per_paper: 3,
  can_pc_see_reviewer_names: false,
  status_menu_enabled: true,
  pc_can_enter_review: true,
  pc_can_access_reviews: true,
  decision_range: [1, 5],
  subreviewers_allowed: true,
  subreviewer_anonymous: true,
  track_chair_notifications: true,

  // Additional frontend display data
  track_dates: {
    start: "2025-04-15",
    end: "2025-04-20"
  },
  stats: {
    total_submissions: 500,
    assigned_reviews: 256,
    pending_reviews: 187
  }
};

// Second sample conference
export const conference2: ConferenceData = {
  id: "65f7b8e9d0c3b2a1098765432",
  name: "European Symposium on Software Engineering",
  acronym: "ESSE 2025",
  short_acronym: "ESSE",
  website: "https://esse2025.eu",
  city: "Berlin",
  venue: "Estrel Congress Center",
  state: "Berlin",
  country: "Germany",
  submission_page: "/submission/esse",
  license_expiry: "2025-12-31",
  contact_emails: ["chair@esse2025.eu", "support@esse2025.eu"],
  forwarding_emails_conference: ["committee@esse2025.eu"],
  forwarding_emails_tracks: ["tracks@esse2025.eu"],
  created_by: "61b3c4d5e6f7a8b9012345678",
  created_at: "2024-12-01T09:30:00.000Z",
  description: "The European Symposium on Software Engineering (ESSE) brings together academics and industry professionals to discuss advances in software development methodologies, tools, and practices. Topics include software architecture, testing, DevOps, agile methodologies, and emerging technologies in software development.",
  
  // Conference configuration
  double_blind_review: true,
  can_pc_see_unassigned_submissions: true,
  abstract_before_full: false,
  abstract_section_hidden: false,
  multiple_authors_allowed: true,
  max_abstract_length: 300,
  submission_instructions: "Papers must follow the IEEE format. Full papers should not exceed 10 pages including references and figures.",
  additional_fields_enabled: true,
  file_upload_fields: [
    { name: "paper", required: true, file_types: [".pdf"] },
    { name: "code", required: false, file_types: [".zip", ".tar.gz"] },
    { name: "data", required: false, file_types: [".zip", ".csv", ".json"] }
  ],
  presenter_selection_required: true,
  submission_updates_allowed: false,
  new_submission_allowed: true,
  auto_update_submission_dates: true,
  use_bidding_or_relevance: "relevance",
  bidding_enabled: false,
  chairs_can_view_bids: false,
  llm_fraud_detection: false,
  reviewers_per_paper: 4,
  can_pc_see_reviewer_names: true,
  status_menu_enabled: true,
  pc_can_enter_review: true,
  pc_can_access_reviews: false,
  decision_range: [1, 10],
  subreviewers_allowed: false,
  subreviewer_anonymous: false,
  track_chair_notifications: true,

  // Additional frontend display data
  track_dates: {
    start: "2025-06-10",
    end: "2025-06-15"
  },
  stats: {
    total_submissions: 325,
    assigned_reviews: 298,
    pending_reviews: 124
  }
};

export const conferences = [conference1, conference2];