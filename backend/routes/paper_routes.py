from flask import request, jsonify, session
from models.paper import Paper
from extensions import mongo
from bson import ObjectId

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
            paper_path=data.get("paper"),  # Assuming this is a URL or path to the PDF
            authors=data.get("authors", []),
            created_at=None
        )

        mongo.db.papers.insert_one(paper.to_dict())

        return jsonify({
            "message": "Paper created successfully!",
            "paper_id": paper.id
        }), 201

    except Exception as e:
        print("Paper creation error:", e)
        return jsonify({"error": "Failed to create paper."}), 500
