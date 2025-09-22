"""
Netlify Function for Emoji art generation
"""
import json
import base64
import io
from PIL import Image
from utils import lambda_response, handle_cors

# Import our modules (local to this directory)
from emoji_art import image_to_emoji_mosaic, text_to_emoji_art, EMOJI_SETS, resize_image

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
        
        mode = data.get('mode', 'image')
        
        if mode == 'text':
            text = data.get('text', '')
            on_emoji = data.get('on_emoji', data.get('emoji', '🔥'))
            off_emoji = data.get('off_emoji', '⚪')
            width = data.get('width', 80)
            threshold = data.get('threshold', 128)
            
            if not text:
                return lambda_response(400, {'error': 'No text provided'})
            
            result = text_to_emoji_art(text, on_emoji=on_emoji, off_emoji=off_emoji, width=width, binary_threshold=threshold)
            
        else:  # image mode
            if 'image' not in data:
                return lambda_response(400, {'error': 'No image data provided'})
            
            # Decode base64 image
            image_data = base64.b64decode(data['image'].split(',')[1])
            img = Image.open(io.BytesIO(image_data))
            
            # Get parameters
            width = data.get('width', 80)
            binary_mode = data.get('binary_mode', False)
            on_emoji = data.get('on_emoji', '🔥')
            off_emoji = data.get('off_emoji', '⚪')
            threshold = data.get('threshold', 128)
            emoji_set = data.get('emoji_set', 'geometric')
            custom_emojis = data.get('custom_emojis', '')
            
            # Process image
            img = resize_image(img, width)
            
            if binary_mode:
                result = image_to_emoji_mosaic(
                    img, 
                    binary_mode=True,
                    on_emoji=on_emoji,
                    off_emoji=off_emoji,
                    threshold=threshold
                )
            else:
                if custom_emojis:
                    emoji_list = [e.strip() for e in custom_emojis.split(',') if e.strip()]
                elif emoji_set in EMOJI_SETS:
                    emoji_list = EMOJI_SETS[emoji_set]
                else:
                    emoji_list = EMOJI_SETS['geometric']
                
                result = image_to_emoji_mosaic(img, emoji_list=emoji_list, binary_mode=False)
        
        return lambda_response(200, {'result': result})
        
    except Exception as e:
        return lambda_response(500, {'error': str(e)})
