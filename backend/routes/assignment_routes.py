from flask import request, jsonify, session
from models.assignment import Assignment
from models.paper import Paper
from extensions import mongo
from bson import ObjectId
from datetime import datetime

def create_assignment_for_track(track_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    try:
        track_id = str(track_id)
        assignment = Assignment(
            id=ObjectId(),
            reviewer_id=data.get("reviewer_id"),
            paper_id=data.get("paper_id"),
            track_id=track_id,
            created_at=datetime.utcnow()
        )

        mongo.db.assignments.insert_one(assignment.to_dict())

        mongo.db.tracks.update_one(
            {"_id": ObjectId(track_id)},
            {"$push": {"assignments": assignment.id}}  
        )

        return jsonify({"message": "Assignment created successfully", "assignment_id": assignment.id}), 201

    except Exception as e:
        print("Assignment creation error:", e)
        return jsonify({"error": "Failed to create assignment"}), 500
    
def get_assignments_for_reviewer(reviewer_id):
    try:
        assignments = list(mongo.db.assignments.find({"reviewer_id": reviewer_id}))
        for assignment in assignments:
            assignment["_id"] = str(assignment["_id"])
        return jsonify(assignments), 200
    except Exception as e:
        print("Get assignments error:", e)
        return jsonify({"error": "Failed to retrieve assignments"}), 500

def get_assigned_papers(reviewer_id):
    try:
        assignments = mongo.db.assignments.find({"reviewer_id": reviewer_id})

        if not assignments:
            return jsonify({"error": "No assignments found for this reviewer."}), 404

        paper_ids = [assignment["paper_id"] for assignment in assignments]

        papers = mongo.db.papers.find({"_id": {"$in": [ObjectId(paper_id) for paper_id in paper_ids]}})

        paper_list = [paper for paper in papers]

        return jsonify({"papers": paper_list}), 200

    except Exception as e:
        print(f"Error fetching assigned papers: {str(e)}")
        return jsonify({"error": "Failed to retrieve assigned papers."}), 500
    

def get_assignments_by_paper(paper_id):
    try:
        fake_paper_id = paper_id
        paper = mongo.db.papers.find_one({"id": fake_paper_id})
        if not paper:
            return jsonify({"error": "Paper not found"}), 404
        paper_id = str(paper["_id"])

        assignments = list(mongo.db.assignments.find({"paper_id": paper_id}))
        print("Assignments found:", assignments)
        for assignment in assignments:
            assignment["_id"] = str(assignment["_id"])
        return jsonify(assignments), 200
    except Exception as e:
        print("Get assignments error:", e)
        return jsonify({"error": "Failed to retrieve assignments"}), 500