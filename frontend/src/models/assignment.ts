export interface Assignment {
    review: string | undefined;
    decision: string | undefined;
    _id: string;
    id: string;
    reviewer_id: string;
    paper_id: string;
    track_id: string;
    created_at: {
      $date: string;
    };
    is_pending: boolean;
  }