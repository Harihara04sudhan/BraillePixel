"""
Netlify Function for getting emoji sets
"""
import json
from utils import lambda_response, handle_cors

# Import our modules (local to this directory)
from emoji_art import EMOJI_SETS

def handler(event, context):
    # Handle CORS
    cors_response = handle_cors(event)
    if cors_response:
        return cors_response
    
    try:
        return lambda_response(200, {
            'sets': {name: emojis[:10] for name, emojis in EMOJI_SETS.items()}
        })
        
    except Exception as e:
        return lambda_response(500, {'error': str(e)})
