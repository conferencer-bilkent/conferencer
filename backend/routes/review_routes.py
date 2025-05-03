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

        review["_id"] = str(review["_id"])
        review["created_at"] = review.get("created_at").isoformat() if review.get("created_at") else None

        return jsonify(review), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch review: {str(e)}"}), 500

def update_review(review_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        review = mongo.db.reviews.find_one({"_id": ObjectId(review_id)})
        if not review:
            return jsonify({"error": "Review not found"}), 404

        update_fields = {}

        for field in ["evaluation", "confidence", "evaluation_text", "remarks", "reviewer_name",
                      "sub_firstname", "sub_lastname", "sub_email"]:
            if field in data:
                update_fields[field] = data[field]

        sub_fields = ["sub_firstname", "sub_lastname", "sub_email"]
        if any(field in data for field in sub_fields):
            subreviewer = review.get("subreviewer", {})
            if "sub_firstname" in data:
                subreviewer["first_name"] = data["sub_firstname"]
            if "sub_lastname" in data:
                subreviewer["last_name"] = data["sub_lastname"]
            if "sub_email" in data:
                subreviewer["email"] = data["sub_email"]
            update_fields["subreviewer"] = subreviewer

        if not update_fields:
            return jsonify({"error": "No valid fields provided to update"}), 400

        # Perform update
        mongo.db.reviews.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": update_fields}
        )

        return jsonify({"message": "Review updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update review: {str(e)}"}), 500

def submit_review():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    required_fields = ["paper_id", "reviewer_name", "sub_firstname", "sub_lastname", "sub_email", "evaluation", "confidence"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        review = Review(
            paper_id=data["paper_id"],
            reviewer_id=session["user_id"],
            reviewer_name=data["reviewer_name"],
            sub_firstname=data["sub_firstname"],
            sub_lastname=data["sub_lastname"],
            sub_email=data["sub_email"],
            evaluation=data["evaluation"],
            confidence=data["confidence"],
            evaluation_text=data.get("evaluation_text", ""),
            remarks=data.get("remarks", "")
        )

        result = mongo.db.reviews.insert_one(review.to_dict())

        return jsonify({
            "message": "Review created successfully",
            "review_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": f"Failed to create review: {str(e)}"}), 500

def get_reviews_by_paper(paper_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        reviews = mongo.db.reviews.find({"paper_id": paper_id})
        review_list = []
        
        for review in reviews:
            # Convert ObjectId to string for JSON serialization
            review["_id"] = str(review["_id"])
            if "created_at" in review:
                review["created_at"] = review["created_at"].isoformat()
            review_list.append(review)

        return jsonify({"reviews": review_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch reviews: {str(e)}"}), 500

def rate_review(review_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["user_id"]
    data = request.get_json()

    if not data or "rate" not in data:
        return jsonify({"error": "Rate value is required"}), 400

    try:
        rate_value = int(data["rate"])

        # Find the review
        review = mongo.db.reviews.find_one({"_id": ObjectId(review_id)})
        if not review:
            return jsonify({"error": "Review not found"}), 404

        rates = review.get("rates", [])
        updated = False

        # Update rate if already rated by this user
        for r in rates:
            if r["userid"] == user_id:
                r["rate"] = rate_value
                updated = True
                break

        if not updated:
            # Add new rate
            rates.append({"userid": user_id, "rate": rate_value})

        # Update the review document
        mongo.db.reviews.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": {"rates": rates}}
        )

        return jsonify({"message": "Rate added/updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to rate review: {str(e)}"}), 500
    
def avg_rate(review_id):
    try:
        review = mongo.db.reviews.find_one({"_id": ObjectId(review_id)})
        if not review:
            return jsonify({"error": "Review not found"}), 404

        rates = review.get("rates", [])

        if not rates:
            return jsonify({"average_rate": 0, "count": 0}), 200

        total = sum(r["rate"] for r in rates)
        count = len(rates)
        average = total / count if count > 0 else 0

        return jsonify({
            "average_rate": round(average, 2),
            "count": count
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to calculate average rate: {str(e)}"}), 500
