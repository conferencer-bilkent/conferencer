from flask import Blueprint, request, jsonify, session
from models.conference import Conference
from bson import ObjectId
from datetime import datetime
from extensions import mongo
from models.pc_member_invitation import PCMemberInvitation
from routes.notification_routes import send_notification
from models.role import Role
from routes.role_routes import assign_role
from models.conference_series import ConferenceSeries

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
            license_expiry=data.get("license_expiry"),
            contact_emails=data.get("contact_emails"),
            created_by=session["user_id"],
            conference_series_name = data.get("conference_series_name"),
            double_blind_review=data.get("double_blind_review"),
            can_pc_see_unassigned_submissions=data.get("can_pc_see_unassigned_submissions"),
            abstract_before_full=data.get("abstract_before_full"),
            abstract_section_hidden=data.get("abstract_section_hidden"),
            max_abstract_length=data.get("max_abstract_length"),
            submission_instructions=data.get("submission_instructions"),
            additional_fields_enabled=data.get("additional_fields_enabled"),
            file_upload_fields=data.get("file_upload_fields"),
            submission_updates_allowed=data.get("submission_updates_allowed"),
            new_submission_allowed=data.get("new_submission_allowed"),
            use_bidding_or_relevance=data.get("use_bidding_or_relevance"),
            bidding_enabled=data.get("bidding_enabled"),
            chairs_can_view_bids=data.get("chairs_can_view_bids"),
            reviewers_per_paper=data.get("reviewers_per_paper"),
            can_pc_see_reviewer_names=data.get("can_pc_see_reviewer_names"),
            status_menu_enabled=data.get("status_menu_enabled"),
            pc_can_enter_review=data.get("pc_can_enter_review"),
            pc_can_access_reviews=data.get("pc_can_access_reviews"),
            decision_range=data.get("decision_range"),
            subreviewers_allowed=data.get("subreviewers_allowed"),
            subreviewer_anonymous=data.get("subreviewer_anonymous"),
            track_chair_notifications=data.get("track_chair_notifications"),
            start_date=data.get("start_date"),
            end_date=data.get("end_date")
        )
        conference_series_id = None
        if data.get("conference_series_name"):

            new_series = ConferenceSeries(
                series_name=data.get("conference_series_name"),
                owner_id=session["user_id"],
                conferences=[]
            )

            result = mongo.db.conference_series.insert_one(new_series.to_dict())
            conference_series_id = result.inserted_id


        conference_dict = conference.to_dict()
        if conference_series_id:
            conference_dict["conference_series_id"] = str(conference_series_id)

        insert_result = mongo.db.conferences.insert_one(conference_dict)
        inserted_conference_id = insert_result.inserted_id

        if conference_series_id:
            mongo.db.conference_series.update_one(
                {"_id": conference_series_id},
                {"$addToSet": {"conferences": inserted_conference_id}}
            )

        
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
            "conference_id": str(inserted_conference_id),
            "role_id": str(new_role.id)
            }), 201
        else:
            return jsonify({'error': 'User not found or role not updated'}), 404

    except Exception as e:
        print("Conference creation error:", e)
        return jsonify({"error": "Failed to create conference"}), 500

def create_conference_from_series():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        # ----------------------------
        # Step 1: Get provided fields
        # ----------------------------
        series_id = data.get("conference_series_id")
        if not series_id:
            return jsonify({"error": "conference_series_id is required"}), 400

        name = data.get("name")
        acronym = data.get("acronym")
        short_acronym = data.get("short_acronym")
        website = data.get("website")
        city = data.get("city")
        venue = data.get("venue")
        state = data.get("state")
        country = data.get("country")
        license_expiry = data.get("license_expiry")
        contact_emails = data.get("contact_emails")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        # Validate required fields
        if not name or not acronym or not short_acronym:
            return jsonify({"error": "name, acronym, and short_acronym are required"}), 400

        # ----------------------------
        # Step 2: Get the series
        # ----------------------------
        series = mongo.db.conference_series.find_one({"_id": ObjectId(series_id)})
        if not series:
            return jsonify({"error": "Conference series not found"}), 404

        # ----------------------------
        # Step 3: Get last conference in the series
        # ----------------------------
        conference_ids = series.get("conferences", [])
        if not conference_ids:
            return jsonify({"error": "No previous conferences found in this series to copy settings"}), 400

        last_conference_id = conference_ids[-1]
        last_conf = mongo.db.conferences.find_one({"_id": ObjectId(last_conference_id)})

        if not last_conf:
            return jsonify({"error": "Last conference in the series not found"}), 404
            
        print("data:", last_conf)
        print("type:", type(last_conf))

        # ----------------------------
        # Step 4: Copy all settings from last conference
        # ----------------------------
        settings_to_copy = {}
        for key, value in last_conf.items():
            if isinstance(value, dict) and "value" in value and "scope" in value:
                settings_to_copy[key] = value

        # ----------------------------
        # Step 5: Create new conference
        # ----------------------------
        conference = Conference(
            name=name,
            acronym=acronym,
            short_acronym=short_acronym,
            website=website,
            city=city,
            venue=venue,
            state=state,
            country=country,
            description="",
            license_expiry=license_expiry,
            contact_emails=contact_emails,
            created_by=session["user_id"],
            conference_series_name=series.get("series_name"),
            conference_series_id=str(series_id),

            double_blind_review=settings_to_copy.get("double_blind_review"),
            can_pc_see_unassigned_submissions=settings_to_copy.get("can_pc_see_unassigned_submissions"),
            abstract_before_full=settings_to_copy.get("abstract_before_full"),
            abstract_section_hidden=settings_to_copy.get("abstract_section_hidden"),
            max_abstract_length=settings_to_copy.get("max_abstract_length"),
            submission_instructions=settings_to_copy.get("submission_instructions"),
            additional_fields_enabled=settings_to_copy.get("additional_fields_enabled"),
            file_upload_fields=settings_to_copy.get("file_upload_fields"),
            submission_updates_allowed=settings_to_copy.get("submission_updates_allowed"),
            new_submission_allowed=settings_to_copy.get("new_submission_allowed"),
            use_bidding_or_relevance=settings_to_copy.get("use_bidding_or_relevance"),
            bidding_enabled=settings_to_copy.get("bidding_enabled"),
            chairs_can_view_bids=settings_to_copy.get("chairs_can_view_bids"),
            reviewers_per_paper=settings_to_copy.get("reviewers_per_paper"),
            can_pc_see_reviewer_names=settings_to_copy.get("can_pc_see_reviewer_names"),
            status_menu_enabled=settings_to_copy.get("status_menu_enabled"),
            pc_can_enter_review=settings_to_copy.get("pc_can_enter_review"),
            pc_can_access_reviews=settings_to_copy.get("pc_can_access_reviews"),
            decision_range=settings_to_copy.get("decision_range"),
            subreviewers_allowed=settings_to_copy.get("subreviewers_allowed"),
            subreviewer_anonymous=settings_to_copy.get("subreviewer_anonymous"),
            track_chair_notifications=settings_to_copy.get("track_chair_notifications"),
            start_date=start_date,
            end_date=end_date
        )

        conference_dict = conference.to_dict()

        # ----------------------------
        # Step 6: Save conference
        # ----------------------------
        insert_result = mongo.db.conferences.insert_one(conference_dict)
        inserted_conference_id = insert_result.inserted_id

        # ----------------------------
        # Step 7: Update series
        # ----------------------------
        mongo.db.conference_series.update_one(
            {"_id": ObjectId(series_id)},
            {"$addToSet": {"conferences": inserted_conference_id}}
        )

        # ----------------------------
        # Step 8: Assign superchair role
        # ----------------------------
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
        
        # Update user roles
        user_id = session["user_id"]
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$addToSet': {'roles': str(new_role.id)}}
        )

        return jsonify({
            "message": "Conference created successfully under the provided series, copying previous settings.",
            "conference_id": str(inserted_conference_id),
            "role_id": str(new_role.id)
        }), 201

    except Exception as e:
        print("Conference creation (from series) error:", e)
        return jsonify({"error": f"Failed to create conference from series: {str(e)}"}), 500


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
            roles = mongo.db.roles.find({"conference_id": conf_dict["conference_id"]})
            role_list = []
            for role in roles:
                role_dict = dict(role)
                role_dict['_id'] = str(role_dict['_id'])
                role_list.append(role_dict)
            conf_dict['roles'] = role_list
            # Get users models having the array roles which have these role ids in them
            role_ids = [str(role['_id']) for role in role_list]
            users = mongo.db.users.find({"roles": {"$in": role_ids}})
            user_list = []
            for user in users:
                user_dict = dict(user)
                user_dict['_id'] = str(user_dict['_id'])
                user_dict['positions_in_this_conference'] = [role['position'] for role in role_list if str(role['_id']) in user_dict['roles']]
                user_list.append(user_dict)
            conf_dict['users'] = user_list

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

def get_my_conference_series():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        user_id = session["user_id"]

        # Find all series where this user is the owner
        series_cursor = mongo.db.conference_series.find({"owner_id": user_id})

        result = []
        for series in series_cursor:
            result.append({
                "_id": str(series["_id"]),
                "series_name": series.get("series_name"),
                "conferences": [str(cid) for cid in series.get("conferences", [])]
            })

        return jsonify({"conference_series_list": result}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve conference series: {str(e)}"}), 500

def appoint_superchair(conference_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.get_json()
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400

        # Check if the user is already a superchair
        existing_role = mongo.db.roles.find_one({
            "conference_id": conference_id,
            "position": "superchair",
            "user_id": user_id
        })

        if existing_role:
            return jsonify({"error": "User is already a superchair"}), 400

        new_role = Role(
            conference_id=conference_id,
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

        # Update the conference's superchair array
        conference_update = mongo.db.conferences.update_one(
            {"conference_id": conference_id},
            {"$addToSet": {"superchairs": user_id}}
        )

        if conference_update.modified_count == 0:
            return jsonify({"error": "Conference not found"}), 404

        mongo.db.roles.insert_one(role_dict)

        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$addToSet': {'roles': str(new_role.id)}}
        )

        if result.modified_count > 0:
            return jsonify({
                "message": "Superchair appointed successfully",
                "role_id": str(new_role.id)
            }), 201
        else:
            return jsonify({'error': 'User not found or role not updated'}), 404

    except Exception as e:
        return jsonify({"error": f"Failed to appoint superchair: {str(e)}"}), 500

def get_series_stats(series_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Step 1: Get all conferences in the series
        series = mongo.db.conference_series.find_one({"_id": ObjectId(series_id)})
        if not series:
            return jsonify({"error": "Conference series not found"}), 404

        conference_ids = series.get("conferences", [])
        pc_member_ids = set()

        # Step 2: For each conference, collect all PC members
        for conf_id in conference_ids:
            conference = mongo.db.conferences.find_one({"_id": ObjectId(conf_id)})
            if conference:
                pc_members = conference.get("pc_members", [])
                pc_member_ids.update(pc_members)

        result_stats = []

        # Step 3: For each PC member, calculate stats
        for pc_member in pc_member_ids:
            # Collect values for all stats
            total_submit_time = 0
            total_review_rating = 0
            total_words = 0
            total_review_time = 0
            total_eval_score = 0

            review_count = 0
            rating_count = 0

            # Step 3a: Find all reviews by this reviewer in any track of any conference
            reviews = mongo.db.reviews.find({"reviewer_id": pc_member})

            for review in reviews:
                print(1)
                review_count += 1

                # ---------- 1. avg_submit_time_before_deadline ----------
                paper = mongo.db.papers.find_one({"_id": ObjectId(review["paper_id"])})
                if not paper:
                    print(2)
                    continue  # skip if paper not found

                paper_created = paper["created_at"]
                review_created = review["created_at"]

                # Get conference
                track = mongo.db.tracks.find_one({"_id": ObjectId(paper["track"])})
                if not track:
                    print(3)
                    continue

                conference = mongo.db.conferences.find_one({"_id": ObjectId(track["conference_id"])})
                if not conference:
                    print(4)
                    continue

                conf_end_date = conference.get("end_date")
                if not conf_end_date:
                    print(5)
                    continue  # Skip if end date missing

                # If conf_end_date is a string, convert to datetime
                if isinstance(conf_end_date, str):
                    conf_end_date = datetime.fromisoformat(conf_end_date.replace("Z", "+00:00"))

                if conf_end_date.tzinfo is not None:
                    conf_end_date = conf_end_date.replace(tzinfo=None)

                if review_created.tzinfo is not None:
                    review_created = review_created.replace(tzinfo=None)

                if paper_created.tzinfo is not None:
                    paper_created = paper_created.replace(tzinfo=None)

                submit_time = (conf_end_date - review_created).total_seconds() / 3600

                total_submit_time += submit_time

                # ---------- 2. review_rating ----------
                if "review_rating" in review:
                    total_review_rating += review["review_rating"]
                    rating_count += 1

                # ---------- 3. avg_words_per_review ----------
                word_count = len(review.get("evaluation_text", "").split())
                total_words += word_count

                # ---------- 4. avg_time_to_review ----------
                time_to_review = (review_created - paper_created).total_seconds() / 3600  # hours
                total_review_time += time_to_review

                # ---------- 5. avg_rating_given ----------
                if "evaluation" in review:
                    # You didn't specify exactly how to convert "evaluation" to grade
                    # Assuming it's an integer or numeric value
                    try:
                        eval_value = float(review["evaluation"])
                        total_eval_score += eval_value
                    except:
                        pass

            if review_count == 0:
                continue  # no reviews by this reviewer

            submit_time_avg = total_submit_time / review_count
            review_time_avg = total_review_time / review_count

            user = mongo.db.users.find_one({"_id": ObjectId(pc_member)})
            if user:
                pc_member_name = user.get("name", "") + " " + user.get("surname", "")
            else:
                pc_member_name = "Unknown"

            stats = {
                "pc_member_id": str(pc_member),
                "pc_member_name": pc_member_name,
                "avg_submit_time_before_deadline": format_duration(submit_time_avg),
                "review_rating": (total_review_rating / rating_count) if rating_count > 0 else 0,
                "avg_words_per_review": total_words / review_count,
                "avg_time_to_review": format_duration(review_time_avg),
                "avg_rating_given": total_eval_score / review_count
            }


            result_stats.append(stats)

        return jsonify({
            "series_id": str(series_id),
            "pc_member_stats": result_stats
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to compute series stats: {str(e)}"}), 500  

def get_conference(conference_id):
    try:
        conference = mongo.db.conferences.find_one({"conference_id": conference_id})
        
        if not conference:
            return jsonify({"error": "Conference not found"}), 404

        # return the conference details

        conf_dict = dict(conference)
        conf_dict['_id'] = str(conf_dict['_id'])

        # Get roles in the conference 
        roles = mongo.db.roles.find({"conference_id": conference_id})
        role_list = []
        for role in roles:
            role_dict = dict(role)
            role_dict['_id'] = str(role_dict['_id'])
            role_list.append(role_dict)
        conf_dict['roles'] = role_list
        # Get users models having the array roles which have these role ids in them
        role_ids = [str(role['_id']) for role in role_list]
        users = mongo.db.users.find({"roles": {"$in": role_ids}})
        user_list = []
        for user in users:
            user_dict = dict(user)
            user_dict['_id'] = str(user_dict['_id'])
            user_dict['positions_in_this_conference'] = [role['position'] for role in role_list if str(role['_id']) in user_dict['roles']]
            user_list.append(user_dict)
        conf_dict['users'] = user_list

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
    
def get_conference_by_id(conference_id):
    try:
        conference = mongo.db.conferences.find_one({"_id": ObjectId(conference_id)})
        
        if not conference:
            return jsonify({"error": "Conference not found"}), 404

        # return the conference details

        conf_dict = dict(conference)
        conf_dict['_id'] = str(conf_dict['_id'])

        # Get roles in the conference 
        roles = mongo.db.roles.find({"conference_id": conference_id})
        role_list = []
        for role in roles:
            role_dict = dict(role)
            role_dict['_id'] = str(role_dict['_id'])
            role_list.append(role_dict)
        conf_dict['roles'] = role_list
        # Get users models having the array roles which have these role ids in them
        role_ids = [str(role['_id']) for role in role_list]
        users = mongo.db.users.find({"roles": {"$in": role_ids}})
        user_list = []
        for user in users:
            user_dict = dict(user)
            user_dict['_id'] = str(user_dict['_id'])
            user_dict['positions_in_this_conference'] = [role['position'] for role in role_list if str(role['_id']) in user_dict['roles']]
            user_list.append(user_dict)
        conf_dict['users'] = user_list

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

def update_conference(conference_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        # Step 1: Get the old conference before updating
        old_conf = mongo.db.conferences.find_one({"_id": ObjectId(conference_id)})
        if not old_conf:
            return jsonify({"error": "Conference not found"}), 404

        # Step 2: Update the conference fields with the new data
        update_fields = {}
        for key, value in data.items():
            update_fields[key] = value

        mongo.db.conferences.update_one(
            {"_id": ObjectId(conference_id)},
            {"$set": update_fields}
        )

        # Step 3: Get the updated conference after applying the changes
        updated_conf = mongo.db.conferences.find_one({"_id": ObjectId(conference_id)})

        # Step 4: Compare old and new settings to detect what changed
        changed_settings = {}

        for key in data:
            old_value = old_conf.get(key)
            new_value = updated_conf.get(key)

            # Only consider settings that have a scope (i.e., configurable settings)
            if isinstance(new_value, dict) and "scope" in new_value:
                old_scope = old_value.get("scope") if isinstance(old_value, dict) else None
                new_scope = new_value.get("scope")

                old_val = old_value.get("value") if isinstance(old_value, dict) else None
                new_val = new_value.get("value")

                changed_settings[key] = {
                    "old_scope": old_scope,
                    "new_scope": new_scope,
                    "old_value": old_val,
                    "new_value": new_val
                }

        # Step 5: For every track in this conference, apply the necessary changes
        tracks = mongo.db.tracks.find({"conference_id": str(conference_id)})
        for track in tracks:
            print("girdik")
            track_settings = track.get("settings", {})
            modified = False

            for key, change in changed_settings.items():
                # Case 1: The setting changed from track scope to conference scope
                # In this case, remove it from track settings
                if change["old_scope"] == "track" and change["new_scope"] == "conference":
                    if key in track_settings:
                        del track_settings[key]
                        modified = True

                # Case 2: The setting changed from conference scope to track scope
                # In this case, add it to track settings
                elif change["old_scope"] == "conference" and change["new_scope"] == "track":
                    track_settings[key] = {
                        "value": change["new_value"],
                        "scope": "track"
                    }
                    modified = True

                # Case 3: The setting was and remains at track scope
                # Update the value if it changed
                elif change["old_scope"] == "track" and change["new_scope"] == "track":
                    if key in track_settings:
                        if track_settings[key]["value"] != change["new_value"]:
                            track_settings[key]["value"] = change["new_value"]
                            modified = True
                    else:
                        # The key didn't exist in track settings before, so add it now
                        track_settings[key] = {
                            "value": change["new_value"],
                            "scope": "track"
                        }
                        modified = True

            # If any modifications were made to the track settings, update them in the database
            if modified:
                mongo.db.tracks.update_one(
                    {"_id": track["_id"]},
                    {"$set": {"settings": track_settings}}
                )

        return jsonify({"message": "Conference updated and track settings adjusted for changes."}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update conference: {str(e)}"}), 500

def format_duration(hours):
    months = int(hours // (24 * 30))
    days = int((hours % (24 * 30)) // 24)
    remaining_hours = int(hours % 24)

    parts = []
    if months > 0:
        parts.append(f"{months} Months")
    if days > 0:
        parts.append(f"{days} Days")
    if remaining_hours > 0 or not parts:
        parts.append(f"{remaining_hours} Hours")

    return " ".join(parts)
