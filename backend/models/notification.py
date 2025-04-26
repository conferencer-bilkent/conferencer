from bson import ObjectId
from datetime import datetime

class Notification:
    def __init__(self, id: int, title: str, content: str, is_interactive: bool, to_whom):
        self.id = ObjectId() if id is None else id
        self.title = title
        self.content = content
        self.is_interactive = is_interactive
        self.is_answered = False
        self.created_at = datetime.now()
        self.to_whom = to_whom
        self.is_accepted = False

    to_dict = lambda self: {
        "id": self.id,
        "title": self.title,
        "content": self.content,
        "is_interactive": self.is_interactive,
        "is_answered": self.is_answered,
        "created_at": self.created_at.isoformat(),
        "to_whom": self.to_whom,
        "is_accepted": self.is_accepted
    }