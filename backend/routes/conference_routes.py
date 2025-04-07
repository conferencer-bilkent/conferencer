from flask import Blueprint, request, jsonify, session
from models.conference import Conference
from bson import ObjectId
from extensions import mongo

def create_conference():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        conference = Conference(
            conference_id=ObjectId(),
            name=data.get("name"),
            acronym=data.get("acronym"),
            short_acronym=data.get("short_acronym"),
            website=data.get("website"),
            city=data.get("city"),
            venue=data.get("venue"),
            state=data.get("state"),
            country=data.get("country"),
            submission_page=data.get("submission_page"),
            license_expiry=data.get("license_expiry"),
            contact_emails=data.get("contact_emails"),
            forwarding_emails_conference=data.get("forwarding_emails_conference"),
            forwarding_emails_tracks=data.get("forwarding_emails_tracks"),
            created_by=session["user_id"],

            # 🔽 Configs as top-level attributes (value + scope)
            double_blind_review=data.get("double_blind_review"),
            can_pc_see_unassigned_submissions=data.get("can_pc_see_unassigned_submissions"),
            abstract_before_full=data.get("abstract_before_full"),
            abstract_section_hidden=data.get("abstract_section_hidden"),
            multiple_authors_allowed=data.get("multiple_authors_allowed"),
            max_abstract_length=data.get("max_abstract_length"),
            submission_instructions=data.get("submission_instructions"),
            additional_fields_enabled=data.get("additional_fields_enabled"),
            file_upload_fields=data.get("file_upload_fields"),
            presenter_selection_required=data.get("presenter_selection_required"),
            submission_updates_allowed=data.get("submission_updates_allowed"),
            new_submission_allowed=data.get("new_submission_allowed"),
            auto_update_submission_dates=data.get("auto_update_submission_dates"),
            use_bidding_or_relevance=data.get("use_bidding_or_relevance"),
            bidding_enabled=data.get("bidding_enabled"),
            chairs_can_view_bids=data.get("chairs_can_view_bids"),
            llm_fraud_detection=data.get("llm_fraud_detection"),
            reviewers_per_paper=data.get("reviewers_per_paper"),
            can_pc_see_reviewer_names=data.get("can_pc_see_reviewer_names"),
            status_menu_enabled=data.get("status_menu_enabled"),
            pc_can_enter_review=data.get("pc_can_enter_review"),
            pc_can_access_reviews=data.get("pc_can_access_reviews"),
            decision_range=data.get("decision_range"),
            subreviewers_allowed=data.get("subreviewers_allowed"),
            subreviewer_anonymous=data.get("subreviewer_anonymous"),
            track_chair_notifications=data.get("track_chair_notifications")
        )

        mongo.db.conferences.insert_one(conference.to_dict())

        return jsonify({
            "message": "Conference created successfully",
            "conference_id": conference.id
        }), 201

    except Exception as e:
        print("Conference creation error:", e)
        return jsonify({"error": "Failed to create conference"}), 500
