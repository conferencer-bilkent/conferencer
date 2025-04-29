from flask import jsonify
from models.keywords import Keywords
from flask import request
from extensions import mongo


def get_keywords():
    """Get all keywords"""
    # find keywords collection from mongodb and retreive it, there is no function built in
    try:
        keywords = mongo.db.keywords.find_one()
        if not keywords:
            return jsonify({
                'success': False,
                'error': 'No keywords found'
            }), 404

        keyword_result = Keywords()
        keyword_result.keywords = keywords.get('keywords', [])

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

    try:
        return jsonify({
            'success': True,
            'keywords': keyword_result.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    
def add_keyword(keyword):
    try:
        if not keyword:
            return jsonify({
                'success': False,
                'error': 'Keyword is required'
            }), 400
        
        if keyword in keywords_instance.keywords:
            return jsonify({
                'success': False,
                'error': 'Keyword already exists'
            }), 400
            
        keywords_instance.keywords.append(keyword)
        keywords_instance.save_to_mongodb()  # Save to MongoDB
  
        return jsonify({
            'success': True,
            'keywords': keywords_instance.to_dict()
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    
def set_keywords():
    """Set all keywords"""
    try:
        data = request.get_json()
        keywords = data.get('keywords')
        if not keywords:
            return jsonify({
                'success': False,
                'error': 'Keywords are required'
            }), 400
        
        # Check if keywords is a list
        if not isinstance(keywords, list):
            return jsonify({
                'success': False,
                'error': 'Keywords should be a list'
            }), 400
        
        # turn keywords into a Keywords object
        keywords_instance = Keywords()
        keywords_instance.keywords = keywords
        # Save to MongoDB
        mongo.db.keywords.update_one({}, {"$set": {"keywords": keywords}}, upsert=True)

        return jsonify({
            'success': True,
            'message': 'Keywords set successfully',
            'keywords': keywords_instance.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


class Keywords:
    def __init__(self):
        self.keywords = []

    def to_dict(self):
        return {
            "keywords": self.keywords
        }