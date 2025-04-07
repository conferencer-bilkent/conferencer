from flask import request, jsonify, session
from extensions import mongo
from bson.objectid import ObjectId

def assign_role():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    data = request.get_json()
    
    if not data or 'user_id' not in data or 'role' not in data:
        return jsonify({'error': 'Missing user_id or role'}), 400
    
    user_id = data['user_id']
    role = data['role']
    
    try:
        # Update the user with the new role
        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'role': role}}
        )
        
        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'Role assigned successfully'}), 200
        else:
            return jsonify({'error': 'User not found or role not changed'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

