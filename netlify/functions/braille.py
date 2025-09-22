"""
Netlify Function for Braille art generation
"""
import json
import base64
import io
from PIL import Image
from utils import lambda_response, handle_cors

# Import our modules (local to this directory)
from textart import image_to_braille, resize_to_cells

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
        
        if 'image' not in data:
            return lambda_response(400, {'error': 'No image data provided'})
        
        # Decode base64 image
        image_data = base64.b64decode(data['image'].split(',')[1])
        img = Image.open(io.BytesIO(image_data))
        
        # Get parameters
        cols = data.get('cols', 80)
        rows = data.get('rows', None)
        threshold = data.get('threshold', 127)
        invert = data.get('invert', False)
        
        # Process image
        img = resize_to_cells(img, cols=cols, rows=rows)
        result = image_to_braille(img, threshold=threshold, invert=invert)
        
        return lambda_response(200, {'result': result})
        
    except Exception as e:
        return lambda_response(500, {'error': str(e)})
