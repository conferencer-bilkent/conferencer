from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
import traceback

# Import extensions from extensions.py
from extensions import mongo, jwt, bcrypt

app = Flask(__name__)
app.config["MONGO_URI"] = Config.MONGO_URI
app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY

# Initialize Flask extensions with app
mongo.init_app(app)
jwt.init_app(app)
bcrypt.init_app(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

try:
    # Test MongoDB connection
    mongo.db.list_collection_names()
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print("❌ Error connecting to MongoDB:", e)

# 🔹 Import routes AFTER initializing extensions
from routes.auth_routes import auth_bp
from routes.ping_routes import ping_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(ping_bp, url_prefix="/ping")

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
    app.run(debug=True)
