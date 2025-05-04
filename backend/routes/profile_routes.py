from flask import request, jsonify, session
from extensions import mongo
from bson.objectid import ObjectId
from models.affiliations import Affiliations

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
