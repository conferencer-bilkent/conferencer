from flask import request, jsonify, session
from extensions import mongo
from bson.objectid import ObjectId
from models.role import Role
from datetime import datetime

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
        if not role:
            return jsonify({'error': 'Role not found'}), 404

        role_obj = Role(
            id=role['_id'],
            conference_id=role.get('conference_id'),
            track_id=role.get('track_id'),
            position=role.get('position'),
            is_active=role.get('is_active', True)
        )
        return jsonify(role_obj.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def get_role_status():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    user_id = session['user_id']

    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    role_ids = user.get('roles', [])
    if not role_ids:
        return jsonify({'active_roles': [], 'past_roles': []}), 200

    active_roles = []
    past_roles = []

    for role_id in role_ids:
        try:
            role_obj_id = ObjectId(role_id)
        except Exception:
            print(f"Removing invalid role from user: {role_id}")
            mongo.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"roles": role_id}}
            )
            continue

        role = mongo.db.roles.find_one({'_id': role_obj_id})
        if not role:
            continue

        conference = mongo.db.conferences.find_one({'_id': ObjectId(role['conference_id'])})
        if not conference:
            continue

        conference_name = conference.get("name", "Unknown Conference")

        # Determine if conference is past or active
        end_date = conference.get("end_date")
        if end_date and isinstance(end_date, datetime):
            is_past = end_date < datetime.utcnow()
        else:
            # If no end_date, assume active
            is_past = False

        # Prepare role description
        role_info = {
            "conference_name": conference_name,
            "position": role.get("position", "unknown")
        }

        track_id = role.get("track_id")
        if track_id and track_id != "None":
            track = mongo.db.tracks.find_one({'_id': ObjectId(track_id)})
            if track:
                role_info["track_name"] = track.get("track_name", "Unknown Track")
            else:
                role_info["track_name"] = "Unknown Track"

        # Append to active or past
        if is_past:
            past_roles.append(role_info)
        else:
            active_roles.append(role_info)

    return jsonify({
        "active_roles": active_roles,
        "past_roles": past_roles
    }), 200
