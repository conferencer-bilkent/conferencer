from flask import session

def login_user(email, password, mongo, bcrypt):
    user = mongo.db.users.find_one({"email": email})
    if user and bcrypt.check_password_hash(user["password"], password):
        session["user_id"] = str(user["_id"])
        session["email"] = user["email"]
        session["name"] = user.get("name", "")
        session["surname"] = user.get("surname", "")

        session.permanent = True
        session.modified = True

        return {
            "message": "Login successful!",
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user.get("name", ""),
                "surname": user.get("surname", "")
            }
        }
    return None


def signup_user(name, surname, email, password, mongo, bcrypt):
    if mongo.db.users.find_one({"email": email}):
        return None
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    user_id = mongo.db.users.insert_one({
        "name": name,
        "surname": surname,
        "email": email,
        "password": hashed_password
    }).inserted_id
    return str(user_id)

def logout_user():
    session.clear()
    session.modified = True
    return {"message": "Logout successful!"}
