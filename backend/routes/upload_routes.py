from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from bson import ObjectId


UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file(conference_id, track_name):
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        safe_filename = secure_filename(file.filename)
        paper_id = str(ObjectId())

        save_dir = os.path.join(UPLOAD_FOLDER, conference_id, track_name)
        os.makedirs(save_dir, exist_ok=True)

        save_path = os.path.join(save_dir, f"{paper_id}_{safe_filename}")
        file.save(save_path)

        return jsonify({
            "file_path": f"/{save_path}",
            "paper_id": paper_id
        }), 201

    return jsonify({"error": "Invalid file type"}), 400
