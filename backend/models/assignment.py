from bson import ObjectId
from datetime import datetime

class Assignment:
    def __init__(self, id, reviewer_id, paper_id, track_id, created_at=None):
        self.id = str(id) if isinstance(id, ObjectId) else id
        self.reviewer_id = str(reviewer_id)
        self.paper_id = str(paper_id)
        self.track_id = str(track_id)
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "id": self.id,
            "reviewer_id": self.reviewer_id,
            "paper_id": self.paper_id,
            "track_id": self.track_id,
            "created_at": self.created_at
        }

