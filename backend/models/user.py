class User:
    def __init__(self, email, password, roles=None):
        self.email = email
        self.password = password
        self.roles = roles or []

    def to_dict(self):
        return {
            "email": self.email,
            "password": self.password,  # Ensure password is hashed
            "roles": self.roles
        }
