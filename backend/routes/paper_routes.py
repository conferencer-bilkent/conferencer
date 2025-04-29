from flask import request, jsonify, session
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

        # 🎯 Fetch ALL reviews separately
        reviews_cursor = mongo.db.reviews.find({"paper_id": str(paper["_id"])})
        review_objs = []

        for review_doc in reviews_cursor:
            review_obj = Review(
                id=review_doc["_id"],
                paper_id=review_doc["paper_id"],
                reviewer_id=review_doc["reviewer_id"],
                reviewer_name=review_doc["reviewer_name"],
                sub_firstname=review_doc["subreviewer"]["first_name"],
                sub_lastname=review_doc["subreviewer"]["last_name"],
                sub_email=review_doc["subreviewer"]["email"],
                evaluation=review_doc["evaluation"],
                confidence=review_doc["confidence"],
                created_at=review_doc["created_at"]
            )
            review_objs.append(review_obj)

        paper_obj = Paper(
            paper_id=paper["_id"],
            title=paper["title"],
            abstract=paper["abstract"],
            keywords=paper.get("keywords", []),
            paper_path=paper["paper"],
            authors=paper.get("authors", []),
            decision=paper.get("decision"),
            track=paper.get("track"),
            bidding=paper.get("bidding"),
            assignee=paper.get("assignee"),
            reviews=review_objs,  # 🎯 real Review objects now
            created_at=paper.get("created_at")
        )

        return jsonify({"paper": paper_obj.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve paper: {str(e)}"}), 500   


def submit_paper():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    track = data.get("track_id")

    try:
        paper_data = {
            "title": data.get("title"),
            "abstract": data.get("abstract"),
            "keywords": data.get("keywords", []),
            "paper_path": data.get("paper"),
            "authors": data.get("authors", []),
            "track_id": track,
            "created_at": datetime.utcnow()
        }

        # Insert the paper and capture its ObjectId
        result = mongo.db.papers.insert_one(paper_data)
        inserted_id = result.inserted_id

        # Now update the track with the actual MongoDB _id
        mongo.db.tracks.update_one(
            {"_id": ObjectId(track)},
            {"$push": {"papers": inserted_id}}  # use actual _id here
        )

        return jsonify({
            "message": "Paper created successfully!",
            "paper_id": str(inserted_id)
        }), 201

    except Exception as e:
        print("Paper creation error:", e)
        return jsonify({"error": "Failed to create paper."}), 500

