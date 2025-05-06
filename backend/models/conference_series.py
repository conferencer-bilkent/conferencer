from bson import ObjectId
from datetime import datetime

class ConferenceSeries:
    def __init__(self, series_name, owner_id, conferences=None, created_at=None, id=None):
        self.id = ObjectId() if id is None else id
        self.series_name = series_name
        self.owner_id = str(owner_id) if isinstance(owner_id, ObjectId) else owner_id
        self.conferences = [str(cid) for cid in conferences] if conferences else []
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.id,
            "series_name": self.series_name,
            "owner_id": self.owner_id,
            "conferences": self.conferences,
            "created_at": self.created_at
        }
