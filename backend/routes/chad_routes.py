from flask import jsonify, request, session, Blueprint
from models.chad import ChadMail
from bson import ObjectId
from datetime import datetime
from extensions import mongo
from routes.notification_routes import send_notification

def get_sent_chad():
    user_id = session.get('user_id')
    
    # For MongoDB, you'd query differently than with SQLAlchemy
    sent_messages = mongo.db.chad_mail.find({"from_user": user_id})
    
    messages = []
    for message in sent_messages:
        messages.append({
            'id': str(message['id']),
            'to': message['to_user'],
            'subject': message['subject'],
            'content': message['content'],
            'timestamp': message['created_at']
        })
    
    return jsonify({'sent_chads': messages})

def get_received_chad():
    user_id = session.get('user_id')
    
    received_messages = mongo.db.chad_mail.find({"to_user": user_id})
    
    messages = []
    for message in received_messages:
        messages.append({
            'id': str(message['id']),
            'from': message['from_user'],
            'subject': message['subject'],
            'content': message['content'],
            'timestamp': message['created_at']
        })
    
    return jsonify({'received_chads': messages})

def send_chad():
    data = request.get_json()
    
    if not data or not data.get('to_user') or not data.get('subject') or not data.get('content'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    from_user = session.get('user_id')
    to_user = data.get('to_user')
    subject = data.get('subject')
    content = data.get('content')
    
    # Create new message
    new_message = ChadMail(
        from_user=from_user,
        to_user=to_user,
        subject=subject,
        content=content
    )
    
    # Get sender's name
    sender = mongo.db.users.find_one({"_id": ObjectId(from_user)})
    sender_name = f"{sender['name']} {sender['surname']}" if sender else "Unknown User"
    
    # send notification
    send_notification(
        to_whom=to_user,
        title=f"New message!",
        content=f"You have a new message from {sender_name} with subject: {subject}",
        is_interactive=False
    )

    try:
        # Insert to MongoDB
        result = mongo.db.chad_mail.insert_one(new_message.to_dict())
        return jsonify({'message': 'Chad message sent successfully', 'id': str(new_message.id)}), 201
    except Exception as e:
        return jsonify({'error': f'Failed to send message: {str(e)}'}), 500