from bson import ObjectId

class User_Stat:
    def __init__(self, id, avg_time_to_review, avg_submit_time_before_deadline, deadline_compliance_rate, avg_rating_given, avg_words_per_review, review_rating):
        self.id = ObjectId()
        self.avg_time_to_review = avg_time_to_review
        self.avg_submit_time_before_deadline = avg_submit_time_before_deadline
        self.deadline_compliance_rate = deadline_compliance_rate
        self.avg_rating_given = avg_rating_given
        self.avg_words_per_review = avg_words_per_review
        self.review_rating = review_rating
        
    def to_dict(self):
        return {
            "id": str(self.id),
            "avg_time_to_review": self.avg_time_to_review,
            "avg_submit_time_before_deadline": self.avg_submit_time_before_deadline,
            "deadline_compliance_rate": self.deadline_compliance_rate,
            "avg_rating_given": self.avg_rating_given,
            "avg_words_per_review": self.avg_words_per_review,
            "review_rating": self.review_rating
        }
       
