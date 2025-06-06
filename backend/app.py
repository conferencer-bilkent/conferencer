from flask import Flask, jsonify, session
from flask_session import Session
from flask_cors import CORS
from config import Config
import traceback
from routes.auth_routes import oauth

# Import extensions from extensions.py
from extensions import mongo, jwt, bcrypt

app = Flask(__name__)
app.config["MONGO_URI"] = Config.MONGO_URI
# app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
app.config["SECRET_KEY"] = Config.SECRET_KEY  # session security

# # 🔹 Session Configuration for Persistence
# app.config["SESSION_TYPE"] = "filesystem"  # Ensures session persistence
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_USE_SIGNER"] = True

# Initialize Flask extensions with app
# Session(app)
mongo.init_app(app)
# jwt.init_app(app)
bcrypt.init_app(app)
oauth.init_app(app)

# CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
CORS(app, supports_credentials=True) 

try:
    # Test MongoDB connection
    mongo.db.list_collection_names()
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print("❌ Error connecting to MongoDB:", e)

# 🔹 Import routes AFTER initializing extensions
from routes.routes import all_routes


# Register blueprints
for bp, prefix in all_routes:
    app.register_blueprint(bp, url_prefix=prefix)

# Global error handler with detailed logs
@app.errorhandler(Exception)
def handle_exception(e):
    error_message = traceback.format_exc()
    print("🚨 ERROR:", error_message)  # Logs error to console
    return jsonify({"error": str(e)}), 500

# Root route for health check
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask server is running!"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
