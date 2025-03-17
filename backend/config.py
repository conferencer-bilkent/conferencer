import os
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/conferencer_db")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")
