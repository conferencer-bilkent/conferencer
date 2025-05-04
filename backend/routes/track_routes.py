import json
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
            description=data.get("description"),
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

        # insert the role and get its ID
        role_result = mongo.db.roles.insert_one(role)
        role_id = str(role_result.inserted_id)

        # add the role ID to the user's roles array
        mongo.db.users.update_one(
            {"_id": ObjectId(track_chair)},
            {"$push": {"roles": role_id}}
        )

        return jsonify({"message": "Track chair appointed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def appoint_track_member():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        track_id = data.get("track_id")
        track_member = data.get("track_member")

        if not track_id or track_member is None:
            return jsonify({"error": "Missing track_id or track_member"}), 400

        # Add track member to the track_members array
        mongo.db.tracks.update_one(
            {"_id": ObjectId(track_id)},
            {"$push": {"track_members": track_member}}
        )

        # send notification to the track member
        title = "Track Member Appointment"
        content = f"You have been appointed as a track member for track ID: {track_id}."
        response, status_code = send_notification(
            to_whom=track_member,
            title=title,
            content=content,
            is_interactive=False
        )
        if status_code != 201:
            return jsonify({"error": "Failed to send notification"}), 500

        # get the conference_id from the track
        track = mongo.db.tracks.find_one({"_id": ObjectId(track_id)})
        if not track:
            return jsonify({"error": "Track not found"}), 404
        conference_id = track.get("conference_id")

        # create the role
        role = {
            "position": "track_member",
            "track_id": track_id,
            "conference_id": conference_id,
            "is_active": True
        }

        # insert the role and get its ID
        role_result = mongo.db.roles.insert_one(role)
        role_id = str(role_result.inserted_id)

        # add the role ID to the user's roles array
        mongo.db.users.update_one(
            {"_id": ObjectId(track_member)},
            {"$push": {"roles": role_id}}
        )

        return jsonify({"message": "Track member appointed successfully"}), 200
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
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        track = mongo.db.tracks.find_one({"_id": ObjectId(track_id)})
        if not track:
            return jsonify({"error": "Track not found"}), 404

        # Convert ObjectId to string for JSON serialization
        track["_id"] = str(track["_id"])
        # Convert any other ObjectId fields if present
        if "conference_id" in track:
            track["conference_id"] = str(track["conference_id"])
        return jsonify(track), 200
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
        # print(f"Paper IDs associated with track: {paper_ids}")  # Debugging

        if not paper_ids:
            return jsonify({"error": "No papers associated with this track"}), 404

        # Convert paper IDs to ObjectId for querying papers
        paper_ids_object = [ObjectId(paper_id) for paper_id in paper_ids]
        # print(f"Converted Paper IDs to ObjectId: {paper_ids_object}")  # Debugging

        # Fetch the papers using the ObjectId list
        papers_cursor = mongo.db.papers.find({"_id": {"$in": paper_ids_object}})
        papers = list(papers_cursor)  # Convert cursor to list to inspect the documents

        # print(f"Papers fetched from DB: {papers}")  # Debugging

        # Convert papers to a list and return the results
        paper_list = []
        for paper in papers:
            paper["_id"] = str(paper["_id"])  # Convert ObjectId to string for the response
            paper_list.append(paper)

        return jsonify({"papers": paper_list}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve papers: {str(e)}"}), 500

def get_track_members(track_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        track = mongo.db.tracks.find_one({"_id": ObjectId(track_id)})
        if not track:
            return jsonify({"error": "Track not found"}), 404

        track_members = track.get("track_members", [])
        
        # Get full user details for each track member
        member_details = []
        for member_id in track_members:
            user = mongo.db.users.find_one({"_id": ObjectId(member_id)})
            if user:
                user["_id"] = str(user["_id"])
                member_details.append(user)

        return jsonify({"track_members": member_details}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_track_authors_by_papers_in_the_track(track_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Get all papers in the track
        papers_response = get_all_papers_in_track(track_id)
        if papers_response[1] != 200:
            return papers_response

        papers = papers_response[0].get_json().get("papers", [])
        
        # Collect all unique author emails from papers
        author_emails = set()
        for paper in papers:
            # Handle both string-encoded JSON and proper lists
            authors_data = paper.get("authors", [])
            
            # If authors is a string, parse it as JSON
            if isinstance(authors_data, str):
                try:
                    authors = json.loads(authors_data)
                except json.JSONDecodeError:
                    continue  # Skip invalid JSON
            # If it's already a list, use directly
            elif isinstance(authors_data, list):
                authors = authors_data
            else:
                continue  # Skip invalid format
            
            # Process authors
            for author in authors:
                # If author is a string, try to parse it as JSON
                if isinstance(author, str):
                    try:
                        author_data = json.loads(author)
                    except json.JSONDecodeError:
                        continue
                else:
                    author_data = author

                if isinstance(author_data, list):
                    for single_author_data in author_data:

                        if single_author_data and isinstance(single_author_data, str):
                            normalized_email = single_author_data.strip().lower()
                            author_emails.add(normalized_email)
                        elif single_author_data and isinstance(single_author_data, dict):
                            email = single_author_data.get("email")
                            if email:
                                normalized_email = email.strip().lower()
                                author_emails.add(normalized_email)

                else:
                    if isinstance(author_data, str):
                        normalized_email = author_data.strip().lower()
                        author_emails.add(normalized_email)
                    elif isinstance(author_data, dict):
                        email = author_data.get("email")
                        if email:
                            normalized_email = email.strip().lower()
                            author_emails.add(normalized_email)

        # Retrieve user details for collected emails
        # print(f"Author emails found: {author_emails}")
        
        authors = []
        if author_emails:
            authors = list(mongo.db.users.find({"email": {"$in": list(author_emails)}}))
            # Convert ObjectId to string
            for author in authors:
                author["_id"] = str(author["_id"])

        return jsonify({"authors": authors}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# def conflict_of_interest(track_id):
    # using the get_track_authors_by_papers_in_the_track and get_track_members, we have the profiles of both sides
    # now, we need to check if the authors and members to see if they have similar affiliations.
    # we need to return the conflicting pairs, who have the same affiliations 
def conflict_of_interest(track_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        # Get track members
        members_response = get_track_members(track_id)
        if members_response[1] != 200:
            return members_response
        members = members_response[0].get_json().get("track_members", [])
        # Get authors
        authors_response = get_track_authors_by_papers_in_the_track(track_id)
        if authors_response[1] != 200:
            return authors_response
        authors = authors_response[0].get_json().get("authors", [])
        
        # Check for conflicts based on affiliation
        conflicts = []
        for member in members:
            member_affiliation = member.get("affiliation", "").lower().strip()
            if not member_affiliation:
                continue
                
            for author in authors:
                author_affiliation = author.get("affiliation", "").lower().strip()
                if not author_affiliation:
                    continue
                
                # Skip if member and author are the same person
                if member.get("_id") == author.get("_id"):
                    continue
                    
                # Check if affiliations match or are similar
                if (member_affiliation == author_affiliation or 
                    member_affiliation in author_affiliation or 
                    author_affiliation in member_affiliation):
                    conflicts.append({
                        "member": {
                            "id": member.get("_id"),
                            "name": member.get("name", ""),
                            "email": member.get("email", ""),
                            "affiliation": member.get("affiliation", "")
                        },
                        "author": {
                            "id": author.get("_id"),
                            "name": author.get("name", ""),
                            "email": author.get("email", ""),
                            "affiliation": author.get("affiliation", "")
                        }
                    })
        
        # After conflicts are identified
        # Get all papers in the track
        paper_response = get_all_papers_in_track(track_id)
        if paper_response[1] != 200:
            return paper_response
            
        all_papers = paper_response[0].get_json().get("papers", [])

        # For each conflict, find the author's papers
        for conflict in conflicts:
            author_email = conflict["author"]["email"].lower().strip()
            author_papers = []
            
            for paper in all_papers:
                # Check if this paper has the conflicting author
                authors_data = str(paper.get("authors", ""))  # Convert to string for simple search
                
                # Simple string search - if the email is found anywhere in the authors data
                if author_email in authors_data.lower():
                    author_papers.append({
                        "id": paper.get("_id"),
                        "title": paper.get("title", "Untitled Paper")
                    })
            
            # Add the papers to the conflict information
            conflict["reason"] = f"Affiliation conflict with {len(author_papers)} paper(s)"
            conflict["papers"] = author_papers
        return jsonify({"conflicts": conflicts}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500