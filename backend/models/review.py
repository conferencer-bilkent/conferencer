class Review:
    def __init__(self, paper_id, reviewer_id, reviewer_name, sub_firstname, sub_lastname, sub_email,
                 evaluation, confidence, evaluation_text="", remarks="", rates=None, created_at=None):
        self.paper_id = paper_id
        self.reviewer_id = reviewer_id
        self.reviewer_name = reviewer_name
        self.subreviewer = {
            "first_name": sub_firstname,
            "last_name": sub_lastname,
            "email": sub_email
        }
        self.evaluation = evaluation
        self.confidence = confidence
        self.evaluation_text = evaluation_text
        self.remarks = remarks
        self.rates = rates or []
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "paper_id": self.paper_id,
            "reviewer_id": self.reviewer_id,
            "reviewer_name": self.reviewer_name,
            "subreviewer": self.subreviewer,
            "evaluation": self.evaluation,
            "confidence": self.confidence,
            "evaluation_text": self.evaluation_text,
            "remarks": self.remarks,
            "rates": self.rates,
            "created_at": self.created_at
        }

    

