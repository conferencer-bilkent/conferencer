from flask import request, jsonify, session, send_file
from models.paper import Paper
from models.review import Review
from extensions import mongo
from bson import ObjectId
from datetime import datetime

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


def submit_paper():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    track = data.get("track_id")

    try:
        paper = Paper(
            paper_id=ObjectId(),
            title=data.get("title"),
            abstract=data.get("abstract"),
            keywords=data.get("keywords", []),
            paper_path=data.get("paper"),
            authors=data.get("authors", []),  # Expecting full author objects
            created_by=session["user_id"],
            track=track
        )

        # Insert the paper and capture MongoDB _id
        result = mongo.db.papers.insert_one({
            "id": paper.id,
            "title": paper.title,
            "abstract": paper.abstract,
            "keywords": paper.keywords,
            "paper": paper.paper,
            "authors": paper.authors,
            "track": paper.track,
            "created_by": paper.created_by,
            "created_at": paper.created_at
        })

        # Use MongoDB's _id for track linkage
        inserted_id = result.inserted_id
        mongo.db.tracks.update_one(
            {"_id": ObjectId(track)},
            {"$push": {"papers": inserted_id}}
        )

        return jsonify({
            "message": "Paper created successfully!",
            "paper_id": str(inserted_id)
        }), 201

    except Exception as e:
        print("Paper creation error:", e)
        return jsonify({"error": "Failed to create paper."}), 500

def download_paper(paper_id):
    try:
        paper = mongo.db.papers.find_one({"_id": ObjectId(paper_id)})
        if not paper:
            return jsonify({"error": "Paper not found"}), 404

        paper_path = paper.get("paper")  # e.g., "uploads/papers/paper1.pdf"
        if not paper_path or not os.path.exists(paper_path):
            return jsonify({"error": "File not found on server"}), 404

        return send_file(paper_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": f"Failed to download paper: {str(e)}"}), 500
