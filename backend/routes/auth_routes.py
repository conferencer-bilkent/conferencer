from flask import Blueprint, request, jsonify, session
from services.auth_service import login_user, signup_user, logout_user
from extensions import mongo, bcrypt

auth_bp = Blueprint("auth", __name__)

# Login Endpoint
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    result = login_user(email, password, mongo, bcrypt)
    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Signup Endpoint
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    surname = data.get("surname")
    email = data.get("email")
    password = data.get("password")

    user_id = signup_user(name, surname, email, password, mongo, bcrypt)
    if not user_id:
        return jsonify({"error": "User already exists"}), 400

    return jsonify({
        "message": "Signup successful!",
        "user_id": user_id,
        "name": name,
        "surname": surname
    }), 201

# Logout Endpoint
@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify(logout_user()), 200

# Check if user is logged in
@auth_bp.route("/session", methods=["GET"])
def check_session():
    if "user_id" in session:
        session.modified = True  # 🔹 Ensures session remains active
        return jsonify({
            "logged_in": True,
            "user": {
                "id": session["user_id"],
                "email": session["email"],
                "name": session.get("name", ""),
                "surname": session.get("surname", "")
            }
        }), 200
    return jsonify({"logged_in": False, "error": "Session expired or invalid"}), 401

