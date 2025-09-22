"""
Netlify Function for ASCII text art generation
"""
import json
from utils import lambda_response, handle_cors

# Import our modules (local to this directory)
from ascii_text import text_to_ascii_art, create_border, create_gradient_text

def handler(event, context):
    # Handle CORS
    cors_response = handle_cors(event)
    if cors_response:
        return cors_response
    
    try:
        # Parse the request body
        if event.get('body'):
            data = json.loads(event['body'])
        else:
            return lambda_response(400, {'error': 'No request body provided'})
        
        text = data.get('text', '')
        if not text:
            return lambda_response(400, {'error': 'No text provided'})
        
        font = data.get('font', 'block')
        spacing = data.get('spacing', 1)
        border = data.get('border', False)
        gradient = data.get('gradient', False)
        
        # Generate ASCII art
        result = text_to_ascii_art(text, font, spacing)
        
        # Apply effects
        if gradient:
            result = create_gradient_text(result)
        
        if border:
            result = create_border(result, '#')
        
        return lambda_response(200, {'result': result})
        
    except Exception as e:
        return lambda_response(500, {'error': str(e)})
