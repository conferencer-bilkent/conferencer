from flask import jsonify, request, session, Blueprint
from models.notification import Notification
from bson import ObjectId
from datetime import datetime
from extensions import mongo

def get_notification():
    user_id = session.get('user_id')
    
    notifications = mongo.db.notifications.find({"to_whom": user_id})

    result = []
    for notification in notifications:
        result.append({
            'id': str(notification['_id']),
            'title': notification['title'],
            'content': notification['content'],
            'is_interactive': notification['is_interactive'],
            'is_answered': notification.get('is_answered', False),
            'created_at': notification.get('created_at', datetime.now().isoformat()),
            'is_accepted': notification.get('is_accepted', False),
            'is_read': notification.get('is_read', False),
        })
    
    result = sorted(result, key=lambda x: x['created_at'], reverse=True)

    mongo.db.notifications.update_many(
        {"to_whom": user_id},
        {"$set": {"is_read": True}}
    )
    
    return jsonify({'notifications': result})

def send_notification(to_whom ,title, content, is_interactive=False, invitation_id=None):
    
    new_notification = Notification(
        id=None,  # Auto-generate ID
        title=title,
        content=content,
        is_interactive=is_interactive,
        to_whom=to_whom,
        invitation_id=invitation_id
    )
    
    try:
        notification_dict = new_notification.to_dict()
        
        result = mongo.db.notifications.insert_one(notification_dict)
        return jsonify({
            'message': 'Notification sent successfully', 
            'id': str(new_notification.id)
        }), 201
    except Exception as e:
        return jsonify({'error': f'Failed to send notification: {str(e)}'}), 500
    
def mark_notification_as_answered(notification_id, is_accepted):
    user_id = session.get('user_id')

    is_accepted = True if is_accepted == "true" else False

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    try:
        result = mongo.db.notifications.update_one(
            {'_id': ObjectId(notification_id), 'to_whom': user_id},
            {'$set': {'is_answered': True, 'is_accepted': is_accepted}}
        )

        if result.modified_count == 0:
            return jsonify({'error': 'Notification not found or already answered'}), 404

        notification = mongo.db.notifications.find_one({'_id': ObjectId(notification_id)})

        if notification and notification.get('is_interactive', False):
            invitation_id = notification.get('invitation_id')

            if invitation_id:
                invitation = mongo.db.pcmember_invitations.find_one({
                    "_id": ObjectId(invitation_id),
                    "user_id": user_id,
                    "status": "pending"
                })

                if invitation:
                    new_status = "accepted" if is_accepted else "rejected"

                    mongo.db.pcmember_invitations.update_one(
                        {"_id": ObjectId(invitation_id)},
                        {"$set": {"status": new_status, "responded_at": datetime.utcnow()}}
                    )

                    if is_accepted:
                        mongo.db.conferences.update_one(
                            {"_id": ObjectId(invitation["conference_id"])},
                            {"$addToSet": {"pc_members": user_id}}
                        )

        return jsonify({'message': 'Notification marked as answered'}), 200

    except Exception as e:
        return jsonify({'error': f'Failed to mark notification: {str(e)}'}), 500
