from flask_jwt_extended import create_access_token

def login_user(email, password, mongo, bcrypt):
    user = mongo.db.users.find_one({"email": email})
    if user and bcrypt.check_password_hash(user["password"], password):
        token = create_access_token(identity=str(user["_id"]))
        return {
            "token": token,
            "user": {"id": str(user["_id"]), "email": user["email"]}
        }
    return None

def signup_user(email, password, mongo, bcrypt):
    if mongo.db.users.find_one({"email": email}):
        return None  # User already exists
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    user_id = mongo.db.users.insert_one({
        "email": email,
        "password": hashed_password
    }).inserted_id
    return str(user_id)
