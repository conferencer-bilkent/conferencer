from bson import ObjectId

class User:
    def __init__(self, user_id, name, surname, email, password=None, bio="", roles=None, stat_id=None, auth_provider="local", google_id=None, affiliation=None, past_affiliations=None, preferred_keywords=None, not_preferred_keywords=None):
        self.id = str(user_id) if isinstance(user_id, ObjectId) else user_id 
        self.name = name
        self.surname = surname
        self.email = email
        self.password = password
        self.bio = bio
        self.roles = roles or []  
        self.stats = stat_id
        self.auth_provider = auth_provider
        self.google_id = google_id
        self.affiliation = affiliation or ""
        self.past_affiliations = past_affiliations or []
        self.preferred_keywords = preferred_keywords or []
        self.not_preferred_keywords = not_preferred_keywords or []

    def to_dict(self, include_password=False):
        user_data = {
            "id": self.id,
            "name": self.name,
            "surname": self.surname,
            "email": self.email,
            "bio": self.bio,
            "roles": self.roles,
            "stats": self.stats,
            "auth_provider": self.auth_provider,
            "google_id": self.google_id,
            "affiliation": self.affiliation,
            "past_affiliations": self.past_affiliations,
            "preferred_keywords": self.preferred_keywords,
            "not_preferred_keywords": self.not_preferred_keywords
        }
        if include_password:
            user_data["password"] = self.password
        return user_data
    #BURDA SANKİ BİO YU BİRAZ DAHA DALLANDIRARAK HANGİ ÜNİDEN MEZUN NEREDE ÇALIŞIYO VS ONLARI DA AYIRIRSAK KONFERANSA İNSAN DAVET EDERKEN ATIYOM BİLKENT MEZUNLARINIA SEARCH ATAR ŞIK OLUR 
    #USER CHAT İ İLE İLGİLİ Bİ KARAR ACİLİNDEN, BURADA MI OLUR, CHAT NOTIFICATION VS Bİ KONUŞAK 
    #ROL konferans bağlama vs ile alakalı bi şeye gerek yok sanırsam öylesine yazıyom 
    #conflict of interest için hocam şu id li şahıs vs diye bi alan eklenebilir     
