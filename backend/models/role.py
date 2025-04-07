from bson import ObjectId

class Role:
    def __init__(
    self, id=None, conference_id=None, position=None, is_active=True):
        self.id = ObjectId() if id is None else id
        self.conference_id = conference_id
        self.position = position
        self.is_active = is_active

    def to_dict(self):
        return {
            "id": str(self.id),
            "conference_id": str(self.conference_id),
            "position": self.position,
            "is_active": self.is_active
        }
    

