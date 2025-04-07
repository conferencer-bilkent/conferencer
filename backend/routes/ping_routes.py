from flask import Blueprint, jsonify

#ping_bp = Blueprint("ping", __name__)

#@ping_bp.route("/", methods=["GET"])
def ping():
    return jsonify({"message": "Flask server is running!"}), 200
