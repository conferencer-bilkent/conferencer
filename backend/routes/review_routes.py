from flask import request, jsonify, session
from models.review import Review
from extensions import mongo
from bson import ObjectId
from datetime import datetime

def submit_review(paper_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        review = Review(
            id=ObjectId(),
            paper_id=paper_id,
            reviewer_id=session["user_id"],
            reviewer_name=data.get("reviewer_name"),
            sub_firstname=data.get("sub_firstname"),
            sub_lastname=data.get("sub_lastname"),
            sub_email=data.get("sub_email"),
            evaluation=data.get("evaluation"),
            confidence=data.get("confidence"),
            created_at=datetime.utcnow()
        )

        # Save review separately into the reviews collection
        mongo.db.reviews.insert_one(review.to_dict())

        # Also push the review into the paper's reviews array
        mongo.db.papers.update_one(
            {"_id": ObjectId(paper_id)},
            {"$push": {"reviews": review.to_dict()}}
        )

        return jsonify({"message": "Review created and linked to paper", "review_id": review.id}), 201

    except Exception as e:
        print("Review creation error:", e)
        return jsonify({"error": "Failed to create review"}), 500
