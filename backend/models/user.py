from bson import ObjectId

class User:
    def __init__(self, user_id, name, surname, email, password=None, bio="", roles=None, stat_id=None, auth_provider="local", google_id=None):
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
        }
        if include_password:
            user_data["password"] = self.password
        return user_data
    #BURDA SANKİ BİO YU BİRAZ DAHA DALLANDIRARAK HANGİ ÜNİDEN MEZUN NEREDE ÇALIŞIYO VS ONLARI DA AYIRIRSAK KONFERANSA İNSAN DAVET EDERKEN ATIYOM BİLKENT MEZUNLARINIA SEARCH ATAR ŞIK OLUR 
    #USER CHAT İ İLE İLGİLİ Bİ KARAR ACİLİNDEN, BURADA MI OLUR, CHAT NOTIFICATION VS Bİ KONUŞAK 
    #ROL konferans bağlama vs ile alakalı bi şeye gerek yok sanırsam öylesine yazıyom 
    
