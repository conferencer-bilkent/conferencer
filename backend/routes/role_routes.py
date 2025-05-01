from flask import request, jsonify, session
from extensions import mongo
from bson.objectid import ObjectId
from models.role import Role

def assign_role():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    data = request.get_json()
    
    if not data or 'user_id' not in data or 'conference_id' not in data or 'position' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    user_id = data['user_id']
    conference_id = data['conference_id']
    track_id = data.get('track_id')
    position = data['position']
    
    try:
        new_role = Role(
            conference_id=conference_id,
            track_id=track_id,
            position=position
        )
        
        role_dict = {
            '_id': new_role.id,
            'conference_id': new_role.conference_id,
            'track_id': new_role.track_id,
            'position': new_role.position,
            'is_active': new_role.is_active
        }
        
        mongo.db.roles.insert_one(role_dict)
        
        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$addToSet': {'roles': str(new_role.id)}}
        )
        
        if result.modified_count > 0:
            return jsonify({
                'success': True, 
                'message': 'Role assigned successfully',
                'role_id': str(new_role.id)
            }), 200
        else:
            return jsonify({'error': 'User not found or role not updated'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def get_roles():
    try:
        filters = {}
        if request.args.get('conference_id'):
            filters['conference_id'] = request.args.get('conference_id')
        if request.args.get('track_id'):
            filters['track_id'] = request.args.get('track_id')
        if request.args.get('position'):
            filters['position'] = request.args.get('position')
        
        roles = list(mongo.db.roles.find(filters))
        
        roles_list = []
        for role in roles:
            role_obj = Role(
                id=role['_id'],
                conference_id=role.get('conference_id'),
                track_id=role.get('track_id'),
                position=role.get('position'),
                is_active=role.get('is_active', True)
            )
            roles_list.append(role_obj.to_dict())
            
        return jsonify(roles_list), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_role(role_id):
    try:
        role = mongo.db.roles.find_one({'_id': ObjectId(role_id)})
        if role:
            role_obj = Role(
                id=role['_id'],
                conference_id=role.get('conference_id'),
                track_id=role.get('track_id'),
                position=role.get('position'),
                is_active=role.get('is_active', True)
            )
            return jsonify(role_obj.to_dict()), 200
        else:
            return jsonify({'error': 'Role not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


