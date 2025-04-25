from bson import ObjectId
from datetime import datetime

class ChadMail:
    def __init__(self, from_user, to_user, subject, content):
        self.id = ObjectId()
        self.from_user = from_user
        self.to_user = to_user
        self.subject = subject
        self.content = content
        self.created_at = datetime.now()
        
    def to_dict(self):
        """Convert the ChadMail object to a dictionary."""
        return {
            "id": str(self.id),
            "from_user": str(self.from_user) if isinstance(self.from_user, ObjectId) else self.from_user,
            "to_user": str(self.to_user) if isinstance(self.to_user, ObjectId) else self.to_user,
            "subject": self.subject,
            "content": self.content,
            "created_at": self.created_at.isoformat()
        }