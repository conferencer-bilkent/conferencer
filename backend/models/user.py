from bson import ObjectId

class User:
    def __init__(self, user_id, name, surname, email, password):
        self.id = str(user_id) if isinstance(user_id, ObjectId) else user_id  # Ensure ID is string
        self.name = name
        self.surname = surname
        self.email = email
        self.password = password

    def to_dict(self, include_password=False):
        user_data = {
            "id": self.id,
            "name": self.name,
            "surname": self.surname,
            "email": self.email
        }
        if include_password:
            user_data["password"] = self.password
        return user_data
