from flask import request, jsonify, session
from models.review import Review
from extensions import mongo
from bson import ObjectId
from datetime import datetime

def get_review_by_assignment_id(assignment_id):
    try:
        # Find the assignment
        assignment = mongo.db.assignments.find_one({"_id": ObjectId(assignment_id)})
        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404

        # Find reviews matching the assignment's reviewer_id and paper_id
        review = mongo.db.reviews.find_one({
            "reviewer_id": assignment["reviewer_id"],
            "paper_id": assignment["paper_id"]
        })

        if not review:
            return jsonify({"error": "Review not found"}), 404

        # Convert ObjectId to string
        review["_id"] = str(review["_id"])
        if "created_at" in review:
            review["created_at"] = review["created_at"].isoformat()

        return jsonify(review), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch review: {str(e)}"}), 500

def get_review(review_id):
    try:
        review = mongo.db.reviews.find_one({"_id": ObjectId(review_id)})
        if not review:
            return jsonify({"error": "Review not found"}), 404

        review["_id"] = str(review["_id"])
        review["created_at"] = review.get("created_at").isoformat() if review.get("created_at") else None

        # Find the assignments with the same reviewer_id and paper_id as the review
        assignments = mongo.db.assignments.find({
            "reviewer_id": review.get("reviewer_id"),
            "paper_id": review.get("paper_id")
        })

        # Convert assignments to a list of dictionaries
        assignment_list = []
        for assignment in assignments:
            assignment["_id"] = str(assignment["_id"])  # Convert ObjectId to string
            assignment_list.append(assignment)

        # Add assignments to the review response
        review["assignments"] = assignment_list

        return jsonify(review), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch review: {str(e)}"}), 500

def update_paper_avg_acceptance(paper_id):
    paper = mongo.db.papers.find_one({"_id": ObjectId(paper_id)})
    if not paper:
        print("Paper not found for avg_acceptance update")
        return

    review_cursor = mongo.db.reviews.find({"paper_id": paper_id})
    total_weighted = 0
    total_confidence = 0

    for review in review_cursor:
        eval_score = review.get("evaluation", 0)
        confidence = review.get("confidence", 1) or 1
        total_weighted += eval_score * confidence
        total_confidence += confidence

    avg_acceptance = total_weighted / total_confidence if total_confidence else 0.0

    mongo.db.papers.update_one(
        {"_id": ObjectId(paper_id)},
        {"$set": {"avg_acceptance": avg_acceptance}}
    )

def update_review(review_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        review = mongo.db.reviews.find_one({"_id": ObjectId(review_id)})
        if not review:
            return jsonify({"error": "Review not found"}), 404

        update_fields = {}

        for field in ["evaluation", "confidence", "evaluation_text", "remarks", "reviewer_name"]:
            if field in data:
                update_fields[field] = data[field]

        # Always update subreviewer as an object
        subreviewer = review.get("subreviewer", {})
        subreviewer["first_name"] = data.get("sub_firstname", subreviewer.get("first_name", ""))
        subreviewer["last_name"] = data.get("sub_lastname", subreviewer.get("last_name", ""))
        subreviewer["email"] = data.get("sub_email", subreviewer.get("email", ""))
        update_fields["subreviewer"] = subreviewer

        if not update_fields:
            return jsonify({"error": "No valid fields provided to update"}), 400

        # Perform update
        mongo.db.reviews.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": update_fields}
        )

        paper_id = review["paper_id"]
        update_paper_avg_acceptance(paper_id)

        return jsonify({"message": "Review updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update review: {str(e)}"}), 500

def submit_review(paper_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    # Change only this part as requested
    required_fields = ["reviewer_name", "evaluation", "evaluation_text"]
    if not all(field in data for field in required_fields):
        # print the missing fields
        missing_fields = [field for field in required_fields if field not in data]
        print(f"Missing fields: {missing_fields}")

        return jsonify({"error": "Missing required fields"}), 400

    try:

        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            print(f"Missing fields: {missing_fields}")


        review = Review(
            paper_id=paper_id,
            reviewer_id=session["user_id"],
            reviewer_name=data["reviewer_name"],
            sub_firstname=data.get("sub_firstname", ""),
            sub_lastname=data.get("sub_lastname", ""),
            sub_email=data.get("sub_email", ""),
            evaluation=data["evaluation"],
            confidence=data.get("confidence", 1),
            evaluation_text=data.get("evaluation_text", ""),
            remarks=data.get("remarks", "")
        )

        user_id = session["user_id"]


        relevant_assignment = mongo.db.assignments.find_one({"paper_id": paper_id, "reviewer_id": user_id})
        if not relevant_assignment:
            return jsonify({"error": "No assignment found for this paper and user"}), 404
        
        # update relevant assignments is_pending to false
        mongo.db.assignments.update_one(
            {"paper_id": paper_id, "reviewer_id": user_id},
            {"$set": {"is_pending": False}}
        )

        # i need you to find the user submitting the review
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        # i need you to find the user stats id

        users_stat_id = user.get("stat_id")
        if not users_stat_id:
            return jsonify({"error": "User stats not found"}), 404
        
         
        # i need you to find the paper being reviewed
        paper = mongo.db.papers.find_one({"_id": ObjectId(paper_id)})
        if not paper:
            return jsonify({"error": "Paper not found"}), 404

        # i need you to calculate the time taken to review the paper
        time_taken = datetime.utcnow() - paper["created_at"]

        # the user has a field called stat. // "avg_time_to_review". update this field
        # with the time taken to review the paper
        time_taken_hours = time_taken.total_seconds() / 3600  # Convert to hours
        days = int(time_taken_hours // 24)
        remaining_hours = int(time_taken_hours % 24)
        minutes = int((time_taken_hours % 1) * 60)
        
        time_taken_readable = f"{days} days {remaining_hours} hours {minutes} minutes"
        if days == 0:
            time_taken_readable = f"{remaining_hours} hours {minutes} minutes"
        
        # Update the user's stats, which is in stat collection with id = users_stat_id
        mongo.db.stats.update_one(
            {"_id": ObjectId(users_stat_id)},
            {"$set": {
                "avg_time_to_review": time_taken_readable
            }}
        )
        
        result = mongo.db.reviews.insert_one(review.to_dict())

        mongo.db.papers.update_one(
            {"_id": ObjectId(paper_id)},
            {"$addToSet": {"reviews": result.inserted_id}}
        )

        track_id = paper.get("track")
        if track_id:
            mongo.db.tracks.update_one(
                {"_id": ObjectId(track_id)},
                {"$addToSet": {"reviews": result.inserted_id}}
            )
        else:
            print("Warning: Paper has no track_id assigned.")

        update_paper_avg_acceptance(paper_id)

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

def avg_rate_of_user():
    data = request.get_json()

    conference_id = data.get("conference_id")
    user_id = data.get("user_id")

    if not conference_id or not user_id:
        return jsonify({"error": "conference_id and user_id are required"}), 400

    try:
        # find all tracks in the conference
        tracks = list(mongo.db.tracks.find({"conference_id": conference_id}))
        if not tracks:
            return jsonify({"error": "No tracks found for this conference"}), 404

        # collect all paper ObjectIds from those tracks
        paper_ids = []
        for track in tracks:
            paper_ids.extend(track.get("papers", []))  # Already ObjectIds

        if not paper_ids:
            return jsonify({"error": "No papers found in these tracks"}), 404

        # find all reviews by this user for those papers
        reviews = list(mongo.db.reviews.find({
            "reviewer_id": user_id,
            "paper_id": {"$in": [str(pid) for pid in paper_ids]}  # Paper ids in DB are strings
        }))

        if not reviews:
            return jsonify({
                "average_rate": 0,
                "review_count": 0,
                "rate_count": 0
            }), 200

        all_rates = []
        for review in reviews:
            all_rates.extend([r["rate"] for r in review.get("rates", [])])

        if not all_rates:
            return jsonify({
                "average_rate": 0,
                "review_count": len(reviews),
                "rate_count": 0
            }), 200

        avg = sum(all_rates) / len(all_rates)

        return jsonify({
            "average_rate": round(avg, 2),
            "review_count": len(reviews),
            "rate_count": len(all_rates)
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to calculate user average rate: {str(e)}"}), 500
