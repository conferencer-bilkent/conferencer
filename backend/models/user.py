from bson import ObjectId

class User:
    def __init__(self, user_id, name, surname, email, password, bio="", roles=None, stat_id=None):
        self.id = str(user_id) if isinstance(user_id, ObjectId) else user_id 
        self.name = name
        self.surname = surname
        self.email = email
        self.password = password
        self.bio = bio
        self.roles = roles or []  
        self.stats = stat_id         

    def to_dict(self, include_password=False):
        user_data = {
            "id": self.id,
            "name": self.name,
            "surname": self.surname,
            "email": self.email,
            "bio": self.bio,
            "roles": self.roles,
            "stats": self.stats
        }
        if include_password:
            user_data["password"] = self.password
        return user_data
