from bson import ObjectId
from datetime import datetime
from extensions import mongo

class Paper:
    def __init__(self, paper_id, title, abstract, keywords, paper_path, authors, created_by,
                 decision=None, decision_made_by = None, track=None, biddings=None, assignee=None,
                 reviews=None, created_at=None, submission_date=None, update_date=None):
        self.id = str(paper_id) if isinstance(paper_id, ObjectId) else paper_id
        self.title = title
        self.abstract = abstract
        self.keywords = keywords
        self.paper_path = paper_path
        self.authors = authors
        self.decision = decision
        self.decision_made_by = decision_made_by
        self.track = track
        self.biddings = biddings or []
        self.assignee = assignee
        self.reviews = reviews or []
        self.created_by = created_by
        self.created_at = created_at or datetime.utcnow()
        self.submission_date = submission_date or self.created_at
        self.update_date = update_date or []
        self.avg_acceptance = self.calculate_avg_acceptance()

    def calculate_avg_acceptance(self):
        if not self.reviews:
            return 0.0

        total_weighted = 0
        total_confidence = 0

        for review_id in self.reviews:
            review = mongo.db.reviews.find_one({"_id": ObjectId(review_id)})
            if review:
                eval_score = review.get("evaluation", 0)
                confidence = review.get("confidence", 1)
                total_weighted += eval_score * confidence
                total_confidence += confidence

        return total_weighted / total_confidence if total_confidence else 0.0

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "abstract": self.abstract,
            "keywords": self.keywords,
            "paper_path": self.paper_path,
            "authors": self.authors,
            "decision": self.decision,
            "decision_made_by": self.decision_made_by,
            "track": self.track,
            "biddings": self.biddings,
            "assignee": self.assignee,
            "reviews": self.reviews,
            "created_by": self.created_by,
            "created_at": self.created_at,
            "submission_date": self.submission_date,
            "update_date": self.update_date,
            "avg_acceptance": self.avg_acceptance
        }


