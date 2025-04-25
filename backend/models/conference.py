from bson import ObjectId
from datetime import datetime

class Conference:
    def __init__(self, conference_id, name, acronym, short_acronym, website, city, venue,
                 state, country, submission_page, license_expiry, contact_emails,
                 forwarding_emails_conference, forwarding_emails_tracks,
                 created_by,
                 # 🔽 Configurable fields
                 double_blind_review,
                 can_pc_see_unassigned_submissions,
                 abstract_before_full,
                 abstract_section_hidden,
                 multiple_authors_allowed,
                 max_abstract_length,
                 submission_instructions,
                 additional_fields_enabled,
                 file_upload_fields,
                 presenter_selection_required,
                 submission_updates_allowed,
                 new_submission_allowed,
                 auto_update_submission_dates,
                 use_bidding_or_relevance,
                 bidding_enabled,
                 chairs_can_view_bids,
                 llm_fraud_detection,
                 reviewers_per_paper,
                 can_pc_see_reviewer_names,
                 status_menu_enabled,
                 pc_can_enter_review,
                 pc_can_access_reviews,
                 decision_range,
                 subreviewers_allowed,
                 subreviewer_anonymous,
                 track_chair_notifications,
                 created_at=None):

        self.id = str(conference_id) if isinstance(conference_id, ObjectId) else conference_id
        self.name = name
        self.acronym = acronym
        self.short_acronym = short_acronym
        self.website = website
        self.city = city
        self.venue = venue
        self.state = state
        self.country = country
        self.submission_page = submission_page
        self.license_expiry = license_expiry
        self.contact_emails = contact_emails or []
        self.forwarding_emails_conference = forwarding_emails_conference or []
        self.forwarding_emails_tracks = forwarding_emails_tracks or []
        self.created_by = created_by
        self.created_at = created_at or datetime.utcnow()

        self.superchairs = [created_by]  # Initialize with the creator automatically
        self.track_chairs = []
        self.pc_members = []
        self.authors = []

        # 🔽 Individual config values (value + scope)
        self.double_blind_review = double_blind_review
        self.can_pc_see_unassigned_submissions = can_pc_see_unassigned_submissions
        self.abstract_before_full = abstract_before_full
        self.abstract_section_hidden = abstract_section_hidden
        self.multiple_authors_allowed = multiple_authors_allowed
        self.max_abstract_length = max_abstract_length
        self.submission_instructions = submission_instructions
        self.additional_fields_enabled = additional_fields_enabled
        self.file_upload_fields = file_upload_fields
        self.presenter_selection_required = presenter_selection_required
        self.submission_updates_allowed = submission_updates_allowed
        self.new_submission_allowed = new_submission_allowed
        self.auto_update_submission_dates = auto_update_submission_dates
        self.use_bidding_or_relevance = use_bidding_or_relevance
        self.bidding_enabled = bidding_enabled
        self.chairs_can_view_bids = chairs_can_view_bids
        self.llm_fraud_detection = llm_fraud_detection
        self.reviewers_per_paper = reviewers_per_paper
        self.can_pc_see_reviewer_names = can_pc_see_reviewer_names
        self.status_menu_enabled = status_menu_enabled
        self.pc_can_enter_review = pc_can_enter_review
        self.pc_can_access_reviews = pc_can_access_reviews
        self.decision_range = decision_range
        self.subreviewers_allowed = subreviewers_allowed
        self.subreviewer_anonymous = subreviewer_anonymous
        self.track_chair_notifications = track_chair_notifications

    def to_dict(self):
        return self.__dict__
