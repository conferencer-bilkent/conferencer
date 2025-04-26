from flask import jsonify
from models.keywords import Keywords
from flask import request

keywords_instance = Keywords()

def get_keywords():
    """Get all keywords"""
    try:
        return jsonify({
            'success': True,
            'keywords': keywords_instance.to_dict()
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
            
        keywords_instance.keywords = keywords
        
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
