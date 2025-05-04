class Affiliations:
    def __init__(self):
        self.affiliations = []

    def to_dict(self):
        return {
            "affiliations": self.affiliations
        }