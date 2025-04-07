from flask import Blueprint, request, jsonify, session
from extensions import mongo, bcrypt


def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = mongo.db.users.find_one({"email": email})
    if user and bcrypt.check_password_hash(user["password"], password):
        session["user_id"] = str(user["_id"])
        session["email"] = user["email"]
        session["name"] = user.get("name", "")
        session["surname"] = user.get("surname", "")
        session.permanent = True
        session.modified = True

        return jsonify({
            "message": "Login successful!",
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user.get("name", ""),
                "surname": user.get("surname", "")
            }
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401

def signup():
    data = request.json
    name = data.get("name")
    surname = data.get("surname")
    email = data.get("email")
    password = data.get("password")

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    user_id = mongo.db.users.insert_one({
        "name": name,
        "surname": surname,
        "email": email,
        "password": hashed_password
    }).inserted_id

    return jsonify({
        "message": "Signup successful!",
        "user_id": str(user_id),
        "name": name,
        "surname": surname
    }), 201

def logout():
    session.clear()
    session.modified = True
    return jsonify({"message": "Logout successful!"}), 200

def check_session():
    if "user_id" in session:
        session.modified = True
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