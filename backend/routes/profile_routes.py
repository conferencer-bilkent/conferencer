from flask import request, jsonify, session
from extensions import mongo
from bson.objectid import ObjectId

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
    allowed_fields = ["email", "name", "surname", "bio", "preferred_keywords", "not_preferred_keywords", "affiliation", "past_affiliations"]
    
    update_fields = {}
    for field, value in data.items():
        if field != "_id" and field in allowed_fields:
            update_fields[field] = value

    if not update_fields:
        return jsonify({"message": "No valid fields provided to update"}), 400

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
    # Add authorization check (example - adjust based on your auth system)
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    users = list(mongo.db.users.find({}))
    
    # Convert ObjectId to string for JSON serialization
    for user in users:
        user["_id"] = str(user["_id"])
    
    # Return the list of users
    return jsonify(users), 200