from flask import Blueprint, request, jsonify, session
from models.conference import Conference
from bson import ObjectId
from extensions import mongo
from models.pc_member_invitation import PCMemberInvitation
from routes.notification_routes import send_notification
from models.role import Role
from routes.track_routes import get_tracks_by_conference

def create_conference():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        conference = Conference(
            name=data.get("name"),
            acronym=data.get("acronym"),
            short_acronym=data.get("short_acronym"),
            website=data.get("website"),
            city=data.get("city"),
            venue=data.get("venue"),
            state=data.get("state"),
            country=data.get("country"),
            description=data.get("description"),
            submission_page=data.get("submission_page"),
            license_expiry=data.get("license_expiry"),
            contact_emails=data.get("contact_emails"),
            forwarding_emails_conference=data.get("forwarding_emails_conference"),
            forwarding_emails_tracks=data.get("forwarding_emails_tracks"),
            created_by=session["user_id"],

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

        new_role = Role(
            conference_id=conference.conference_id,
            position="superchair",
            is_active=True
        )
        
        role_dict = {
            '_id': new_role.id,
            'conference_id': new_role.conference_id,
            'track_id': None,
            'position': new_role.position,
            'is_active': new_role.is_active
        }
        
        mongo.db.roles.insert_one(role_dict)
        
        user_id = session["user_id"]
        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$addToSet': {'roles': str(new_role.id)}}
        )
        if result.modified_count > 0:
            return jsonify({
            "message": "Conference created successfully",
            "conference_id": str(conference.conference_id),
            "role_id": str(new_role.id)
            }), 201
        else:
            return jsonify({'error': 'User not found or role not updated'}), 404

    except Exception as e:
        print("Conference creation error:", e)
        return jsonify({"error": "Failed to create conference"}), 500

def get_conferences():
    try:
        user_id = request.args.get('user_id')  # optional query param

        if user_id:
            # Find conferences where user is in any important role
            conferences = mongo.db.conferences.find({
                "$or": [
                    {"superchairs": user_id},
                    {"track_chairs": user_id},
                    {"pc_members": user_id},
                    {"authors": user_id}
                ]
            })
        else:
            conferences = mongo.db.conferences.find()

        result = []
        for conference in conferences:
            conf_dict = dict(conference)
            conf_dict['_id'] = str(conf_dict['_id'])
            tracks = mongo.db.tracks.find({"conference_id": conf_dict["conference_id"]})
            track_list = []
            for track in tracks:
                track_dict = dict(track)
                track_dict['_id'] = str(track_dict['_id'])
                track_list.append(track_dict)
            conf_dict['tracks'] = track_list
            result.append(conf_dict)

        return jsonify({"conferences": result}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve conferences: {str(e)}"}), 500

def get_conference(conference_id):
    try:
        conference = mongo.db.conferences.find_one({"conference_id": conference_id})
        
        if not conference:
            return jsonify({"error": "Conference not found"}), 404

        # return the conference details

        conf_dict = dict(conference)
        conf_dict['_id'] = str(conf_dict['_id'])

        # Get tracks for the conference
        tracks = mongo.db.tracks.find({"conference_id": conference_id})
        track_list = []

        for track in tracks:
            track_dict = dict(track)
            track_dict['_id'] = str(track_dict['_id'])
            track_list.append(track_dict)
        conf_dict['tracks'] = track_list


        return jsonify({
            "conference": conf_dict
        }), 200        

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve conference: {str(e)}"}), 500

def invite_pc_member(conference_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.get_json()
        user_id = data.get("user_id")
        conference_name = data.get("conference_name")

        if not user_id or not conference_name:
            return jsonify({"error": "Missing user_id or conference_name"}), 400

        invitation = PCMemberInvitation(
            conference_id=conference_id,
            user_id=user_id
        )
        mongo.db.pcmember_invitations.insert_one(invitation.to_dict())

        title = "PC Member Invitation"
        content = f"You are invited to be a PC Member for '{conference_name}'. Please Accept or Reject."

        response, status_code = send_notification(
            to_whom=user_id,
            title=title,
            content=content,
            is_interactive=True,
            invitation_id=str(invitation.id)
        )

        if status_code != 201:
            return jsonify({"error": "Failed to send notification"}), 500

        return jsonify({
            "message": "Invitation and notification sent successfully",
            "invitation_id": str(invitation.id)
        }), 201

    except Exception as e:
        return jsonify({"error": f"Failed to invite PC Member: {str(e)}"}), 500  

