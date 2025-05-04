from flask import request, jsonify, session, send_file
from models.paper import Paper
from models.review import Review
from models.role import Role
from extensions import mongo
from bson import ObjectId
from datetime import datetime
import os
from werkzeug.utils import secure_filename


def get_paper(paper_id):
    try:
        paper = mongo.db.papers.find_one({"_id": ObjectId(paper_id)})
        if not paper:
            return jsonify({"error": "Paper not found"}), 404

        # Convert ObjectId fields to string for JSON compatibility
        paper["_id"] = str(paper["_id"])
        paper["created_at"] = paper.get("created_at").isoformat() if paper.get("created_at") else None

        return jsonify(paper), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch paper: {str(e)}"}), 500   

def get_papers_of_user():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["user_id"]

    try:
        papers = mongo.db.papers.find({"created_by": user_id})

        paper_list = []
        for paper in papers:
            paper["_id"] = str(paper["_id"])
            if "created_at" in paper:
                paper["created_at"] = paper["created_at"].isoformat()
            if "submission_date" in paper and paper["submission_date"]:
                paper["submission_date"] = paper["submission_date"].isoformat()
            if "update_date" in paper and paper["update_date"]:
                if isinstance(paper["update_date"], list):
                    paper["update_date"] = [d.isoformat() for d in paper["update_date"]]
                else:
                    paper["update_date"] = paper["update_date"].isoformat()

            paper_list.append(paper)

        return jsonify({"papers": paper_list}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve user's papers: {str(e)}"}), 500

def submit_paper():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400
    
    title = request.form.get("title")
    abstract = request.form.get("abstract")
    keywords = request.form.getlist("keywords") if request.form.getlist("keywords") else []
    authors = request.form.getlist("authors") if request.form.getlist("authors") else []
    track_id = request.form.get("track_id")
    conference_id = request.form.get("conference_id")
    
    if not title or not track_id or not conference_id:
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        # Get track name for folder creation
        track = mongo.db.tracks.find_one({"_id": ObjectId(track_id)})
        if not track:
            return jsonify({"error": "Invalid track ID"}), 400
        
        track_name = track.get("name", "default")
        
        # Save file
        safe_filename = secure_filename(file.filename)
        paper_id = str(ObjectId())
        
        save_dir = os.path.join(UPLOAD_FOLDER, conference_id, track_name)
        os.makedirs(save_dir, exist_ok=True)
        
        save_path = os.path.join(save_dir, f"{paper_id}_{safe_filename}")
        file.save(save_path)
        
        submission_date = datetime.utcnow()

        # Create paper document
        paper = Paper(
            paper_id=ObjectId(paper_id),
            title=title,
            abstract=abstract,
            keywords=keywords,
            paper_path=f"/{save_path}",
            authors=authors,
            created_by=session["user_id"],
            track=track_id
        )

        result = mongo.db.papers.insert_one({
            "id": paper.id,
            "title": paper.title,
            "abstract": paper.abstract,
            "keywords": paper.keywords,
            "paper_path": paper.paper_path,
            "authors": paper.authors,
            "track": paper.track,
            "created_by": paper.created_by,
            "submission_date": submission_date,
            "created_at": paper.created_at
        })

        inserted_id = result.inserted_id
        mongo.db.tracks.update_one(
            {"_id": ObjectId(track_id)},
            {"$push": {"papers": inserted_id}}
        )
        # After saving paper and updating track, assign author role
        author_role = Role(
            conference_id=conference_id,
            track_id=track_id,
            position="author"
        )

        existing_role = mongo.db.roles.find_one({
            "conference_id": conference_id,
            "track_id": track_id,
            "position": "author",
            "_id": {"$in": [ObjectId(role_id) for role_id in mongo.db.users.find_one({"_id": ObjectId(session["user_id"])}).get("roles", [])]}
        })

        if not existing_role:
            result = mongo.db.roles.insert_one(author_role.to_dict())
            real_role_id = result.inserted_id  # This is the ObjectId MongoDB really saved

            mongo.db.users.update_one(
                {'_id': ObjectId(session["user_id"])},
                {'$addToSet': {'roles': real_role_id}}  # Save the ObjectId, NOT string
            )

        return jsonify({
            "message": "Paper created successfully!",
            "paper_id": str(inserted_id),
            "file_path": f"/{save_path}"
        }), 201

    except Exception as e:
        print("Paper creation error:", e)
        return jsonify({"error": f"Failed to create paper: {str(e)}"}), 500

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def download_paper(paper_id):
    try:
        print(f"Downloading paper with ID: {paper_id}")
        paper = mongo.db.papers.find_one({"_id":ObjectId(paper_id)})
        print(f"paper path: {paper}")
        if not paper:
            return jsonify({"error": "Paper not found"}), 404
        paper_path = paper.get("paper_path")
        if not paper_path:
            return jsonify({"error": "No file path associated with this paper"}), 404

        # Ensure the path is absolute
        abs_path = os.path.abspath(paper_path.strip("/"))

        if not os.path.exists(abs_path):
            return jsonify({"error": "File does not exist on server"}), 404

        return send_file(abs_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": f"Failed to download paper: {str(e)}"}), 500

def get_all_papers():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        papers = mongo.db.papers.find()
        paper_list = []
        
        for paper in papers:
            # Convert ObjectId to string for JSON serialization
            paper["_id"] = str(paper["_id"])
            if "created_at" in paper:
                paper["created_at"] = paper["created_at"].isoformat()
            paper_list.append(paper)

        return jsonify({"papers": paper_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch papers: {str(e)}"}), 500

def bid(paper_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["user_id"]

    try:
        paper = mongo.db.papers.find_one({"_id": ObjectId(paper_id)})
        if not paper:
            return jsonify({"error": "Paper not found"}), 404

        biddings = paper.get("biddings", [])

        if user_id not in biddings:
            biddings.append(user_id)
            mongo.db.papers.update_one(
                {"_id": ObjectId(paper_id)},
                {"$set": {"biddings": biddings}}
            )

        return jsonify({"message": "Bid added successfully", "biddings": biddings}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to add bid: {str(e)}"}), 500

def get_biddings(paper_id):
    try:
        paper = mongo.db.papers.find_one({"_id": ObjectId(paper_id)})
        if not paper:
            return jsonify({"error": "Paper not found"}), 404

        biddings = paper.get("biddings", [])

        return jsonify({"biddings": biddings}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to get biddings: {str(e)}"}), 500
    
def update_paper(paper_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.form  # For text fields
    file = request.files.get('file')  # For file upload

    try:
        paper = mongo.db.papers.find_one({"_id": ObjectId(paper_id)})
        if not paper:
            return jsonify({"error": "Paper not found"}), 404

        update_fields = {}
        update_fields["update_date"] = datetime.utcnow()

        # Update text fields
        if "title" in data:
            update_fields["title"] = data.get("title")
        if "abstract" in data:
            update_fields["abstract"] = data.get("abstract")
        if "keywords" in data:
            update_fields["keywords"] = request.form.getlist("keywords")
        if "authors" in data:
            update_fields["authors"] = request.form.getlist("authors")

        # If a new file is uploaded
        if file and allowed_file(file.filename):
            old_path = paper.get("paper_path")
            if old_path and os.path.exists(old_path.lstrip("/")):
                os.remove(old_path.lstrip("/"))

            # Save new file
            safe_filename = secure_filename(file.filename)
            new_path = os.path.join(UPLOAD_FOLDER, f"{paper_id}_{safe_filename}")
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            file.save(new_path)

            update_fields["paper"] = f"/{new_path}"

        # Apply updates
        if update_fields:
            mongo.db.papers.update_one(
                {"_id": ObjectId(paper_id)},
                {"$set": update_fields}
            )

        return jsonify({"message": "Paper updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update paper: {str(e)}"}), 500

def decide(paper_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    decision_value = data.get("decision")

    if decision_value not in [True, False]:
        return jsonify({"error": "Decision must be true or false"}), 400

    try:
        # Fetch the user who is making the decision
        user = mongo.db.users.find_one({"_id": ObjectId(session["user_id"])})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        name = user.get("name", "")
        surname = user.get("surname", "")
        decision_made_by = f"{name} {surname}".strip()

        # Update or set the decision
        mongo.db.papers.update_one(
            {"_id": ObjectId(paper_id)},
            {"$set": {
                "decision": decision_value,
                "decision_made_by": decision_made_by
            }}
        )

        return jsonify({"message": "Decision updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update decision: {str(e)}"}), 500
