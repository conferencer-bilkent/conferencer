import os
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/conferencer_db")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-very-secret-key")
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
