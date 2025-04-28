// types/conferences.ts

export interface ReviewFlag {
    value: boolean | number | string;
    scope: 'conference' | 'track';
  }
  
  export interface Conference {
    id: string;                      // flatten ObjectId.$oid
    conferenceId: string;            // from conference_id
    name: string;
    acronym: string;
    shortAcronym: string;
    website: string;
    city: string;
    venue: string;
    state: string;
    country: string;
    submissionPage: string;
    licenseExpiry: string;           // or Date, if you map it
    contactEmails: string[];
    forwardingEmailsConference: string[];
    forwardingEmailsTracks: string[];
    createdBy: string;
    createdAt: string;               // or Date
    superchairs: string[];
    trackChairs: string[];
    pcMembers: string[];
    authors: string[];
    doubleBlindReview: ReviewFlag;
    canPcSeeUnassignedSubmissions: ReviewFlag;
    abstractBeforeFull: ReviewFlag;
    abstractSectionHidden: ReviewFlag;
    multipleAuthorsAllowed: ReviewFlag;
    maxAbstractLength: ReviewFlag & { value: number };
    submissionInstructions: ReviewFlag & { value: string };
    additionalFieldsEnabled: ReviewFlag;
    fileUploadFields: ReviewFlag & { value: string };
    presenterSelectionRequired: ReviewFlag;
    submissionUpdatesAllowed: ReviewFlag;
    newSubmissionAllowed: ReviewFlag;
    autoUpdateSubmissionDates: string;
    useBiddingOrRelevance: ReviewFlag & { value: 'relevance' | 'bidding' };
    biddingEnabled: ReviewFlag;
    chairsCanViewBids: ReviewFlag;
    llmFraudDetection: ReviewFlag;
    reviewersPerPaper: ReviewFlag & { value: number };
    canPcSeeReviewerNames: ReviewFlag;
    statusMenuEnabled: ReviewFlag;
    pcCanEnterReview: ReviewFlag;
    pcCanAccessReviews: ReviewFlag;
    decisionRange: ReviewFlag & { value: number };
    subreviewersAllowed: ReviewFlag;
    subreviewerAnonymous: ReviewFlag;
    trackChairNotifications: ReviewFlag;
  }
  