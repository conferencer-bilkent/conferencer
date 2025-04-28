from flask import Blueprint, request, jsonify, session
from models.conference import Conference
from bson import ObjectId
from extensions import mongo
from models.pc_member_invitation import PCMemberInvitation
from routes.notification_routes import send_notification
from models.track import Track


def get_all_tracks():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        tracks = mongo.db.tracks.find()
        result = []
        for track in tracks:
            track_dict = dict(track)
            track_dict['_id'] = str(track_dict['_id'])  # Convert ObjectId to string
            result.append(track_dict)

        return jsonify({"tracks": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_track():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    print(data)

    try:
        track = Track(
            track_name=data.get("track_name"),
            conference_id=data.get("conference_id"),
            track_chairs=data.get("track_chairs"),
            papers=data.get("papers"),
            reviews=data.get("reviews"),
            assignments=data.get("assignments")
        )

        mongo.db.tracks.insert_one(track.to_dict())
        return jsonify({"message": "Track created successfully", "track_id": str(track.id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def appoint_track_chair():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        track_id = data.get("track_id")
        track_chair = data.get("track_chair")

        if not track_id or track_chair is None:
            return jsonify({"error": "Missing track_id or track_chair"}), 400

        # Add track chair to the track_chairs array
        mongo.db.tracks.update_one(
            {"_id": ObjectId(track_id)},
            {"$push": {"track_chairs": track_chair}}
        )

        # send notification to the track chair
        title = "Track Chair Appointment"
        content = f"You have been appointed as a track chair for track ID: {track_id}."
        response, status_code = send_notification(
            to_whom=track_chair,
            title=title,
            content=content,
            is_interactive=False
        )
        if status_code != 201:
            return jsonify({"error": "Failed to send notification"}), 500

        # add role to the user as track chair
        # first create the role

        # get the conference_id from the track
        track = mongo.db.tracks.find_one({"_id": ObjectId(track_id)})
        if not track:
            return jsonify({"error": "Track not found"}), 404
        conference_id = track.get("conference_id")

        # create the role
        role = {
            "position": "track_chair",
            "track_id": track_id,
            "conference_id": conference_id,
            "is_active": True
        }
         
        # add the role to the user
        mongo.db.users.update_one(
            {"_id": ObjectId(track_chair)},
            {"$push": {"roles": role}}
        )
        
        return jsonify({"message": "Track chair appointed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_tracks_by_conference(conference_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        tracks = mongo.db.tracks.find({"conference_id": conference_id})
        track_list = [Track(**track).to_dict() for track in tracks]
        return jsonify({"tracks": track_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_track(track_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        track = mongo.db.tracks.find_one({"_id": ObjectId(track_id)})

        if not track:
            return jsonify({"error": "Track not found"}), 404

        track_obj = Track(**track)
        return jsonify({"track": track_obj.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_track_by_author(author_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        tracks = mongo.db.tracks.find({"papers.authors": author_id})
        track_list = [Track(**track).to_dict() for track in tracks]
        return jsonify({"tracks": track_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_track_by_reviewer(reviewer_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        tracks = mongo.db.tracks.find({"reviews.reviewer_id": reviewer_id})
        track_list = [Track(**track).to_dict() for track in tracks]
        return jsonify({"tracks": track_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def get_track_by_people(people_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        tracks = mongo.db.tracks.find({"$or": [
            {"track_chairs": people_id},
            {"papers.authors": people_id},
            {"reviews.reviewer_id": people_id}
        ]})
        track_list = [Track(**track).to_dict() for track in tracks]
        return jsonify({"tracks": track_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    






