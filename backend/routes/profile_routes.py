from flask import request, jsonify, session
from extensions import mongo
from bson.objectid import ObjectId
from models.affiliations import Affiliations
from datetime import datetime

def get_profile(user_id=None):
    if not user_id:
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        user_id = session["user_id"]

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    stats_id = user.get("stat_id")
    stats_data = None
    if stats_id:
        stats_data = mongo.db.stats.find_one({"_id": ObjectId(stats_id)}),
  

    user_data = {
        "email": user.get("email"),
        "name": user.get("name"),
        "surname": user.get("surname"),
        "bio": user.get("bio"),
        "stats": stats_data,
        "roles": user.get("roles"),
        "preferred_keywords": user.get("preferred_keywords"),
        "not_preferred_keywords": user.get("not_preferred_keywords"),
        "affiliation": user.get("affiliation"),
        "past_affiliations": user.get("past_affiliations"),
    }

    return jsonify(user_data), 200

def update_profile():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    if not data:
        return jsonify({"message": "No data provided to update"}), 400

    # Define allowed fields in the user model
    allowed_fields = ["email", "name", "surname", "bio", "preferred_keywords", 
                     "not_preferred_keywords", "affiliation", "past_affiliations"]
    
    update_fields = {}
    for field, value in data.items():
        if field != "_id" and field in allowed_fields:
            update_fields[field] = value

    if not update_fields:
        return jsonify({"message": "No valid fields provided to update"}), 400
    
    if "affiliation" in update_fields:
        # Get current affiliations
        affiliations_response = get_affiliations()
        if affiliations_response[1] == 200:
            affiliations_data = affiliations_response[0].json
            existing_affiliations = affiliations_data.get('affiliations', [])
            
            # Check if affiliation exists
            if update_fields["affiliation"] not in existing_affiliations:
                # Create new affiliation
                try:
                    result = mongo.db.affiliations.update_one(
                        {},  # empty filter to match the single document
                        {
                            "$addToSet": {"affiliations": update_fields["affiliation"]}
                        },
                        upsert=True  # creates the document if it doesn't exist
                    )
                    if not result.acknowledged:
                        return jsonify({"error": "Failed to add new affiliation"}), 400
                except Exception as e:
                    return jsonify({"error": f"Failed to add affiliation: {str(e)}"}), 500

    if "email" in update_fields and update_fields["email"] != session.get("email"):
        if mongo.db.users.find_one({"email": update_fields["email"]}):
            return jsonify({"error": "Email already exists"}), 400

    result = mongo.db.users.update_one(
        {"_id": ObjectId(session["user_id"])},
        {"$set": update_fields}
    )

    # Update common session fields if they were changed
    for field in ["email", "name", "surname"]:
        if field in update_fields:
            session[field] = update_fields[field]
    
    session.modified = True

    return jsonify({"message": "Profile updated successfully"}), 200

def get_all_users():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    users = list(mongo.db.users.find({}))
    
    # Convert ObjectId to string for JSON serialization
    for user in users:
        user["_id"] = str(user["_id"])
    
    # Return the list of users
    return jsonify(users), 200


def get_affiliations():
    """Get all affiliations"""
    # find affiliations collection from mongodb and retreive it, there is no function built in
    try:
        affiliations = mongo.db.affiliations.find_one()
        keyword_result = Affiliations()
        if not affiliations:
            keyword_result.affiliations = []
        else:
            keyword_result.affiliations = affiliations.get('affiliations', [])

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

    try:
        return jsonify(keyword_result.to_dict()), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    

def add_affiliations():
    """Add a new affiliation"""
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    if not data or 'affiliation' not in data:
        return jsonify({"error": "No affiliation provided"}), 400

    try:
        # Find the single document containing affiliations array
        result = mongo.db.affiliations.update_one(
            {},  # empty filter to match the single document
            {
                "$addToSet": {"affiliations": data['affiliation']}
            },
            upsert=True  # creates the document if it doesn't exist
        )

        return jsonify({
            "success": True,
            "message": "Affiliation added successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

def get_user_stats():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        user_id = session["user_id"]

        reviews = mongo.db.reviews.find({"reviewer_id": user_id})

        total_submit_time = 0
        total_review_rating = 0
        total_words = 0
        total_review_time = 0
        total_eval_score = 0

        review_count = 0
        rating_count = 0

        for review in reviews:
            paper = mongo.db.papers.find_one({"_id": ObjectId(review["paper_id"])})
            if not paper:
                continue

            paper_created = paper["created_at"]
            review_created = review["created_at"]

            track = mongo.db.tracks.find_one({"_id": ObjectId(paper["track"])})
            if not track:
                continue

            conference = mongo.db.conferences.find_one({"_id": ObjectId(track["conference_id"])})
            if not conference:
                continue

            conf_end_date = conference.get("end_date")
            if not conf_end_date:
                continue

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

            # 2. review_rating (from rates[])
            if "rates" in review and isinstance(review["rates"], list):
                for rate_entry in review["rates"]:
                    rate_value = rate_entry.get("rate")
                    if rate_value is not None:
                        total_review_rating += rate_value
                        rating_count += 1

            # 3. avg_words_per_review
            word_count = len(review.get("evaluation_text", "").split())
            total_words += word_count

            # 4. avg_time_to_review
            time_to_review = (review_created - paper_created).total_seconds() / 3600
            total_review_time += time_to_review

            # 5. avg_rating_given
            if "evaluation" in review:
                try:
                    eval_value = float(review["evaluation"])
                    total_eval_score += eval_value
                except:
                    pass

            review_count += 1

        if review_count == 0:
            return jsonify({"message": "No reviews found for this user."}), 200

        submit_time_avg = total_submit_time / review_count
        review_time_avg = total_review_time / review_count

        total_reviews = review_count

        conferences_worked = mongo.db.conferences.count_documents({
            "pc_members": user_id
        })

        submissions_count = mongo.db.papers.count_documents({
            "created_by": user_id
        })

        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            user_name = user.get("name", "") + " " + user.get("surname", "")
        else:
            user_name = "Unknown"

        stats = {
            "user_id": str(user_id),
            "user_name": user_name,
            "avg_submit_time_before_deadline": format_duration(submit_time_avg),
            "review_rating": round((total_review_rating / rating_count), 1) if rating_count > 0 else 0,
            "avg_words_per_review": round(total_words / review_count, 1),
            "avg_time_to_review": format_duration(review_time_avg),
            "avg_eval_score_given": round(total_eval_score / review_count, 1),
            "totalReviews": total_reviews,
            "conferencesWorked": conferences_worked,
            "submissions": submissions_count
        }


        return jsonify({"user_stats": stats}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to compute user stats: {str(e)}"}), 500

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
