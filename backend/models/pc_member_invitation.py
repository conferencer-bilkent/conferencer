from bson import ObjectId
from datetime import datetime

class PCMemberInvitation:
    def __init__(self, id=None, conference_id=None, user_id=None, status="pending", created_at=None, responded_at=None):
        self.id = ObjectId() if id is None else id
        self.conference_id = conference_id
        self.user_id = user_id
        self.status = status  # "pending", "accepted", "rejected"
        self.created_at = created_at or datetime.utcnow()
        self.responded_at = responded_at

    def to_dict(self):
        return {
            "_id": self.id,
            "conference_id": self.conference_id,
            "user_id": self.user_id,
            "status": self.status,
            "created_at": self.created_at,
            "responded_at": self.responded_at
        }
