from datetime import datetime
from bson import ObjectId

class Review:
    def __init__(self, id, userid, pc_member_name, sub_firstname, sub_lastname, sub_email, evaluation, confidence, created_at):
        self.id = str(id) if isinstance(id, ObjectId) else id
        self.userid = userid
        self.pc_member_name = pc_member_name
        self.subreviewer = {
            "first_name": sub_firstname,
            "last_name": sub_lastname,
            "email": sub_email,
            "evaluation": evaluation,
            "confidence": confidence
        }
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "pc_member_name": self.pc_member_name,
            "subreviewer": self.subreviewer,
            "created_at": self.created_at
        }

# ADD decision-track-bidding-assignee
class Paper:
    def __init__(self, paper_id, title, abstract, keywords, paper_path, authors, reviews=None, created_at=None):
        self.id = str(paper_id) if isinstance(paper_id, ObjectId) else paper_id
        self.title = title
        self.abstract = abstract
        self.keywords = keywords
        self.paper = paper_path  # PDF
        self.authors = authors  # List of dicts, each with: user_id, firstname, lastname, email, country, organization, corresponding (bool)
        self.reviews = reviews or []
        self.created_at = created_at or datetime.utcnow()
        self.avg_acceptance = self.calculate_avg_acceptance()

    def calculate_avg_acceptance(self):
        if not self.reviews:
            return 0.0
        total_weight = sum(r.subreviewer["confidence"] for r in self.reviews)
        return total_weight / total_weight if total_weight else 0.0

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "abstract": self.abstract,
            "keywords": self.keywords,
            "paper": self.paper,
            "authors": self.authors,
            "reviews": [r.to_dict() for r in self.reviews],
            "created_at": self.created_at,
            "avg_acceptance": self.avg_acceptance
        }
