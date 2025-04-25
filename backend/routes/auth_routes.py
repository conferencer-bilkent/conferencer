from flask import Blueprint, request, jsonify, session, redirect, url_for
from extensions import mongo, bcrypt
from authlib.integrations.flask_client import OAuth
from config import Config

oauth = OAuth()
google = oauth.register(
    name='google',
    client_id=Config.GOOGLE_CLIENT_ID,
    client_secret=Config.GOOGLE_CLIENT_SECRET,
    access_token_url='https://oauth2.googleapis.com/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v2/',
    userinfo_endpoint='https://www.googleapis.com/oauth2/v2/userinfo',
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    client_kwargs={'scope': 'openid email profile'},
)

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

    stat_id = mongo.db.stats.insert_one({
        "avg_time_to_review": 0,
        "avg_submit_time_before_deadline": 0,
        "deadline_compliance_rate": 0,
        "avg_rating_given": 0,
        "avg_words_per_review": 0,
        "review_rating": 0
    }).inserted_id 

    
    user_id = mongo.db.users.insert_one({
        "name": name,
        "surname": surname,
        "email": email,
        "password": hashed_password,
        "stat_id": str(stat_id)
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

def login_google():
    redirect_uri = url_for('auth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

def google_callback():
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    email = user_info.get("email")

    user = mongo.db.users.find_one({"email": email})
    if not user:
        user_id = mongo.db.users.insert_one({
            "name": user_info.get("given_name"),
            "surname": user_info.get("family_name", ""),
            "email": email,
            "auth_provider": "google",
            "google_id": user_info.get("id")
        }).inserted_id
        user = mongo.db.users.find_one({"_id": user_id})

    session["user_id"] = str(user["_id"])
    session["email"] = user["email"]
    session["name"] = user.get("name", "")
    session["surname"] = user.get("surname", "")
    session.permanent = True
    session.modified = True

    return redirect("http://localhost:5173/home")
