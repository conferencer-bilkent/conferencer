from flask import Blueprint, request, jsonify, session
from models.conference import Conference
from bson import ObjectId
from extensions import mongo
from models.pc_member_invitation import PCMemberInvitation
from routes.notification_routes import send_notification
from models.track import Track
from models.paper import Paper
from models.role import Role
from models.user import User


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

        track_list = []
        for track in tracks:
            track_dict = dict(track)
            track_dict['_id'] = str(track_dict['_id'])  # Convert ObjectId to string
            track_list.append(track_dict)
            
        return jsonify({"tracks": track_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_track(track_id):
    print("get_track")
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        print(track_id)
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

def get_all_relevant_people(track_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        track = mongo.db.tracks.find_one({"_id": ObjectId(track_id)})
        if not track:
            return jsonify({"error": "Track not found"}), 404

        # find all the people who have roles with role_id in the roles
        # people have roles keeping role_ids, roles have track_ids

        # find all people who has role array non null
        people = mongo.db.users.find({"roles": {"$ne": []}})

   
        # find all the roles of the track

        # cross references people.roles with roles_of_track
        # and get the user_id and role name of the people and return it
        people_position = []

        for person in people:
            if "roles" in person:
                for role_data in person["roles"]:
                    if isinstance(role_data, dict) and "track_id" in role_data:
                        track_id_str = str(track_id)
                        if role_data["track_id"] == track_id_str:
                            people_position.append({
                                "user_id": str(person["_id"]),
                                "role": role_data["position"]
                            })
                        

        return jsonify({"people": people_position}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



def get_track_by_people(people_id):
    # use all relevant people function and get_all_tracks function to realize thşis one

    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        # get all tracks using get_all_tracks function
        all_tracks_response = get_all_tracks()
        all_tracks = all_tracks_response.get_json().get("tracks", [])
        # get all relevant people using get_all_relevant_people function
        all_relevant_people_response = get_all_relevant_people(people_id)
        all_relevant_people = all_relevant_people_response.get_json().get("people", [])
        # find the track of the people
        track_of_people = []
        for track in all_tracks:
            if track["_id"] in all_relevant_people:
                track_of_people.append(track)
        return jsonify({"tracks": track_of_people}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_all_papers_in_track(track_id):
    try:
        # Fetch the track document by track_id
        track = mongo.db.tracks.find_one({"_id": ObjectId(track_id)})

        if not track:
            return jsonify({"error": "Track not found"}), 404

        # Get all paper IDs associated with the track
        paper_ids = track.get("papers", [])
        print(f"Paper IDs associated with track: {paper_ids}")  # Debugging

        if not paper_ids:
            return jsonify({"error": "No papers associated with this track"}), 404

        # Convert paper IDs to ObjectId for querying papers
        paper_ids_object = [ObjectId(paper_id) for paper_id in paper_ids]
        print(f"Converted Paper IDs to ObjectId: {paper_ids_object}")  # Debugging

        # Fetch the papers using the ObjectId list
        papers_cursor = mongo.db.papers.find({"_id": {"$in": paper_ids_object}})
        papers = list(papers_cursor)  # Convert cursor to list to inspect the documents

        print(f"Papers fetched from DB: {papers}")  # Debugging

        # Convert papers to a list and return the results
        paper_list = []
        for paper in papers:
            paper["_id"] = str(paper["_id"])  # Convert ObjectId to string for the response
            paper_list.append(paper)

        return jsonify({"papers": paper_list}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve papers: {str(e)}"}), 500
