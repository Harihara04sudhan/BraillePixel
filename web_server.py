#!/usr/bin/env python3
"""
Flask backend API for BraillePixel web interface
Handles actual image processing and art generation
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image, ImageFont, ImageDraw
import io
import base64
import sys
import os

# Import our existing modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from textart import image_to_braille, resize_to_cells
from emoji_art import image_to_emoji_mosaic, text_to_emoji_art, EMOJI_SETS, resize_image
from ascii_text import text_to_ascii_art, create_border, create_gradient_text

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return send_from_directory('web', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('web', path)

@app.route('/api/braille', methods=['POST'])
def generate_braille_api():
    """Generate Braille art from uploaded image"""
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        image_data = base64.b64decode(data['image'].split(',')[1])
        img = Image.open(io.BytesIO(image_data))
        
        # Get parameters
        cols = data.get('cols', 80)
        rows = data.get('rows', None)
        threshold = data.get('threshold', 127)
        invert = data.get('invert', False)
        
        print(f"Debug - Web API: cols={cols}, threshold={threshold}, invert={invert}", file=sys.stderr)
        
        # Process image
        img = resize_to_cells(img, cols=cols, rows=rows)
        result = image_to_braille(img, threshold=threshold, invert=invert)
        
        return jsonify({'result': result})
        
    except Exception as e:
        print(f"Error in braille API: {e}", file=sys.stderr)
        return jsonify({'error': str(e)}), 500

@app.route('/api/emoji', methods=['POST'])
def generate_emoji_api():
    """Generate emoji art from image or text"""
    try:
        data = request.get_json()
        mode = data.get('mode', 'image')
        
        if mode == 'text':
            text = data.get('text', '')
            emoji = data.get('emoji', '🔥')
            width = data.get('width', 80)
            
            if not text:
                return jsonify({'error': 'No text provided'}), 400
            
            result = text_to_emoji_art(text, emoji, width)
            
        else:  # image mode
            if 'image' not in data:
                return jsonify({'error': 'No image data provided'}), 400
            
            # Decode base64 image
            image_data = base64.b64decode(data['image'].split(',')[1])
            img = Image.open(io.BytesIO(image_data))
            
            # Get parameters
            width = data.get('width', 80)
            emoji_set = data.get('emoji_set', 'geometric')
            custom_emojis = data.get('custom_emojis', '')
            
            # Determine emoji list
            if custom_emojis:
                emoji_list = [e.strip() for e in custom_emojis.split(',') if e.strip()]
            elif emoji_set in EMOJI_SETS:
                emoji_list = EMOJI_SETS[emoji_set]
            else:
                emoji_list = EMOJI_SETS['geometric']
            
            # Process image
            img = resize_image(img, width)
            result = image_to_emoji_mosaic(img, emoji_list)
        
        return jsonify({'result': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ascii', methods=['POST'])
def generate_ascii_api():
    """Generate ASCII text art"""
    try:
        data = request.get_json()
        
        text = data.get('text', '')
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
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
        
        return jsonify({'result': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emoji-sets')
def get_emoji_sets():
    """Return available emoji sets"""
    return jsonify({
        'sets': {name: emojis[:10] for name, emojis in EMOJI_SETS.items()}
    })

if __name__ == '__main__':
    print("Starting BraillePixel Web Server...")
    print("Open http://localhost:5000 in your browser")
    app.run(debug=True, host='0.0.0.0', port=5000)
