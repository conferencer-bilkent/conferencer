from bson import ObjectId
from datetime import datetime

class Track:
    def __init__(self, 
                 track_name, 
                 conference_id,
                 track_chairs=None, 
                 track_members=None,
                 papers=None, 
                 reviews=None, 
                 assignments=None, 
                 created_at=None,
                 id=None):
        self.id = ObjectId() if id is None else id
        self.track_name = track_name
        self.conference_id = str(conference_id) if isinstance(conference_id, ObjectId) else conference_id
        self.track_chairs = track_chairs or []
        self.track_members = track_members or []
        self.papers = papers or []
        self.reviews = reviews or []
        self.assignments = assignments or []  
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.id,
            "track_name": self.track_name,
            "conference_id": self.conference_id,
            "track_chairs": self.track_chairs,
            "track_members": self.track_members,
            "papers": self.papers,
            "reviews": self.reviews,
            "assignments": self.assignments,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
