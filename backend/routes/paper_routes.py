from flask import request, jsonify, session
from models.paper import Paper, Review
from bson import ObjectId
from extensions import mongo
from datetime import datetime

def submit_paper():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    try:
        paper = Paper(
            paper_id=ObjectId(),
            title=data.get("title"),
            abstract=data.get("abstract"),
            keywords=data.get("keywords", []),
            paper_path=data.get("paper"),
            authors=data.get("authors", []),
            created_at=datetime.utcnow()
        )
        mongo.db.papers.insert_one(paper.to_dict())
        return jsonify({"message": "Paper submitted successfully", "paper_id": paper.id}), 201
    except Exception as e:
        print("Error submitting paper:", e)
        return jsonify({"error": "Failed to submit paper"}), 500


def submit_review():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    paper_id = data.get("paper_id")

    if not paper_id:
        return jsonify({"error": "Missing paper_id"}), 400

    try:
        review = Review(
            id=ObjectId(),
            userid=session["user_id"],
            pc_member_name=data.get("pc_member_name"),
            sub_firstname=data.get("sub_firstname"),
            sub_lastname=data.get("sub_lastname"),
            sub_email=data.get("sub_email"),
            evaluation=int(data.get("evaluation")),
            confidence=int(data.get("confidence")),
            created_at=datetime.utcnow()
        )

        mongo.db.papers.update_one(
            {"id": paper_id},
            {"$push": {"reviews": review.to_dict()}}
        )
        return jsonify({"message": "Review submitted successfully"}), 200
    except Exception as e:
        print("Error submitting review:", e)
        return jsonify({"error": "Failed to submit review"}), 500
