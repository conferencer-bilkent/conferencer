from flask import request, jsonify, session
from models.review import Review
from extensions import mongo
from bson import ObjectId
from datetime import datetime

def get_review(review_id):
    try:
        review = mongo.db.reviews.find_one({"_id": ObjectId(review_id)})

        if not review:
            return jsonify({"error": "Review not found"}), 404

        review_obj = Review(
            id=review["_id"],
            paper_id=review["paper_id"],
            reviewer_id=review["reviewer_id"],
            reviewer_name=review["reviewer_name"],
            sub_firstname=review["subreviewer"]["first_name"],
            sub_lastname=review["subreviewer"]["last_name"],
            sub_email=review["subreviewer"]["email"],
            evaluation=review["evaluation"],
            confidence=review["confidence"],
            created_at=review["created_at"]
        )

        return jsonify({"review": review_obj.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve review: {str(e)}"}), 500

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
