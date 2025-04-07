from flask import Blueprint, jsonify

def ping():
    return jsonify({"message": "Flask server is running!"}), 200
