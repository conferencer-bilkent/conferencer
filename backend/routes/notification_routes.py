from flask import jsonify, request, session, Blueprint
from models.notification import Notification
from bson import ObjectId
from datetime import datetime
from extensions import mongo

def get_notification():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    # Just fetch; do NOT mark read here
    notifications_cursor = mongo.db.notifications.find({"to_whom": user_id})
    result = []
    for notification in notifications_cursor:
        result.append({
            "id": str(notification["_id"]),
            "title": notification["title"],
            "content": notification["content"],
            "is_interactive": notification.get("is_interactive", False),
            "is_answered": notification.get("is_answered", False),
            "created_at": notification.get("created_at", datetime.now().isoformat()),
            "is_accepted": notification.get("is_accepted", False),
            "is_read": notification.get("is_read", False),
        })
    # newest first
    result.sort(key=lambda x: x["created_at"], reverse=True)
    return jsonify({"notifications": result})
    
def mark_all_read():
    """Endpoint to explicitly mark all of the user’s notifications as read."""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    mongo.db.notifications.update_many(
        {"to_whom": user_id, "is_read": False},
        {"$set": {"is_read": True}}
    )
    return jsonify({"message": "All notifications marked as read"}), 200


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
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    accepted = True if is_accepted.lower() == "true" else False
    try:
        res = mongo.db.notifications.update_one(
            {"_id": ObjectId(notification_id), "to_whom": user_id},
            {"$set": {"is_answered": True, "is_accepted": accepted}}
        )
        if res.modified_count == 0:
            return jsonify({"error": "Notification not found or already answered"}), 404

        notification = mongo.db.notifications.find_one({"_id": ObjectId(notification_id)})
        if notification.get("is_interactive", False):
            inv_id = notification.get("invitation_id")
            if inv_id:
                invitation = mongo.db.pcmember_invitations.find_one({
                    "_id": ObjectId(inv_id),
                    "user_id": user_id,
                    "status": "pending"
                })
                if invitation:
                    new_status = "accepted" if accepted else "rejected"
                    mongo.db.pcmember_invitations.update_one(
                        {"_id": ObjectId(inv_id)},
                        {"$set": {"status": new_status, "responded_at": datetime.utcnow()}}
                    )
                    if accepted:
                        print(f"User {user_id} accepted invitation to conference {invitation['conference_id']}")
                        print(f"Adding user to pc_members list of conference")
                        
                        update_result = mongo.db.conferences.update_one(
                            {"_id": invitation["conference_id"]},
                            {"$addToSet": {"pc_members": user_id}}
                        )
                        
                        print(f"Update result: matched={update_result.matched_count}, modified={update_result.modified_count}")
                        
                        # Verify the update worked by retrieving the updated conference
                        updated_conference = mongo.db.conferences.find_one({"_id": invitation["conference_id"]})
                        if updated_conference:
                            print(f"Conference after update: {updated_conference['name']}")
                            print(f"PC members after update: {updated_conference.get('pc_members', [])}")
                            print(f"User {user_id} in PC members: {user_id in updated_conference.get('pc_members', [])}")
                        else:
                            print(f"Warning: Could not retrieve updated conference {invitation['conference_id']}")
        return jsonify({"message": "Notification marked as answered"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to mark notification: {str(e)}"}), 500