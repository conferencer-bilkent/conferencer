from bson import ObjectId
from datetime import datetime

class Review:
    def __init__(self, id, paper_id, reviewer_id, reviewer_name, sub_firstname, sub_lastname, sub_email, evaluation, confidence, created_at):
        self.id = str(id) if isinstance(id, ObjectId) else id
        self.paper_id = str(paper_id)
        self.reviewer_id = reviewer_id
        self.reviewer_name = reviewer_name
        self.subreviewer = {
            "first_name": sub_firstname,
            "last_name": sub_lastname,
            "email": sub_email
        }
        self.evaluation = evaluation
        self.confidence = confidence
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "id": self.id,
            "paper_id": self.paper_id,
            "reviewer_id": self.reviewer_id,
            "reviewer_name": self.reviewer_name,
            "subreviewer": self.subreviewer,
            "evaluation": self.evaluation,
            "confidence": self.confidence,
            "created_at": self.created_at
        }
