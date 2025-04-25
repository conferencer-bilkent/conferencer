from bson import ObjectId
from datetime import datetime

class Paper:
    def __init__(self, paper_id, title, abstract, keywords, paper_path, authors,
                 decision=None, track=None, bidding=None, assignee=None,
                 reviews=None, created_at=None):
        self.id = str(paper_id) if isinstance(paper_id, ObjectId) else paper_id
        self.title = title
        self.abstract = abstract
        self.keywords = keywords
        self.paper = paper_path
        self.authors = authors
        self.decision = decision
        self.track = track
        self.bidding = bidding
        self.assignee = assignee
        self.reviews = reviews or []
        self.created_at = created_at or datetime.utcnow()
        self.avg_acceptance = self.calculate_avg_acceptance()

    def calculate_avg_acceptance(self):
        if not self.reviews:
            return 0.0
        total_weighted = sum(r.evaluation * r.confidence for r in self.reviews)
        total_confidence = sum(r.confidence for r in self.reviews)
        return total_weighted / total_confidence if total_confidence else 0.0

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "abstract": self.abstract,
            "keywords": self.keywords,
            "paper": self.paper,
            "authors": self.authors,
            "decision": self.decision,
            "track": self.track,
            "bidding": self.bidding,
            "assignee": self.assignee,
            "reviews": [r.to_dict() for r in self.reviews],
            "created_at": self.created_at,
            "avg_acceptance": self.avg_acceptance
        }
