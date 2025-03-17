from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from services.auth_service import login_user, signup_user
from extensions import mongo, bcrypt  # Import extensions directly

auth_bp = Blueprint("auth", __name__)

# Login Endpoint
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Now using imported `mongo` and `bcrypt` from extensions.py
    result = login_user(email, password, mongo, bcrypt)
    if result:
        return jsonify({
            "message": "Login successful!",
            "access_token": result["token"],
            "user": result["user"]
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Signup Endpoint
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Using imported `mongo` and `bcrypt`
    user_id = signup_user(email, password, mongo, bcrypt)
    if not user_id:
        return jsonify({"error": "User already exists"}), 400

    return jsonify({
        "message": "Signup successful!",
        "user_id": user_id
    }), 201

# Example of a protected route
@auth_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Hello, user {current_user}!"}), 200
