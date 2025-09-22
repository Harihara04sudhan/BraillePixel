#!/usr/bin/env python3
"""
Emoji Mosaic Generator
Convert images to emoji art using your chosen emoji
"""

from PIL import Image
import sys
import os
import argparse

# Common emoji sets for different styles
EMOJI_SETS = {
    'faces': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰'],
    'hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖'],
    'nature': ['🌸', '🌺', '🌻', '🌹', '🌷', '🌿', '🍀', '🌾', '🌵', '🌲', '🌳', '🌴', '🌱', '🌿', '🍃', '🌺'],
    'geometric': ['⬛', '⬜', '🔲', '🔳', '◼️', '◻️', '▪️', '▫️', '🔸', '🔹', '🔶', '🔷', '🔴', '🟠', '🟡', '🟢'],
    'animals': ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🦋'],
    'food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍑', '🍒', '🥥', '🥝', '🍅', '🥑', '🍆', '🥕', '🌽']
}

def resize_image(img, width_chars=80):
    """Resize image maintaining aspect ratio for emoji mosaic"""
    w, h = img.size
    # Emoji characters are roughly square in most terminals
    aspect_ratio = w / h
    height_chars = int(width_chars / aspect_ratio)
    
    return img.resize((width_chars, height_chars), Image.BICUBIC)

def image_to_emoji_mosaic(img, emoji_list, density_levels=16):
    """Convert grayscale image to emoji mosaic"""
    if img.mode != "L":
        img = img.convert("L")
    
    pixels = img.load()
    width, height = img.size
    
    # Create density map from emoji list
    if len(emoji_list) < density_levels:
        # Repeat emojis to reach desired density levels
        expanded_emoji = []
        for i in range(density_levels):
            expanded_emoji.append(emoji_list[i % len(emoji_list)])
        emoji_list = expanded_emoji
    else:
        # Use subset if too many emojis
        emoji_list = emoji_list[:density_levels]
    
    lines = []
    for y in range(height):
        line = []
        for x in range(width):
            pixel = pixels[x, y]
            # Map pixel brightness (0-255) to emoji index
            emoji_index = min(int(pixel / 256 * len(emoji_list)), len(emoji_list) - 1)
            line.append(emoji_list[emoji_index])
        lines.append(''.join(line))
    
    return '\n'.join(lines)

def text_to_emoji_art(text, emoji='🔥', width=80):
    """Convert text to emoji art using PIL for text rendering"""
    from PIL import ImageFont, ImageDraw
    
    try:
        # Try to load a font (adjust path as needed)
        font_size = 60
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        try:
            # Fallback font
            font = ImageFont.load_default()
            font_size = 30
        except:
            print("Warning: Could not load font, text rendering may not work properly")
            return text.replace(' ', emoji)
    
    # Calculate image size needed for text
    bbox = font.getbbox(text)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Create image with text
    img = Image.new('RGB', (text_width + 20, text_height + 20), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((10, 10), text, font=font, fill='black')
    
    # Convert to grayscale and resize
    img = img.convert('L')
    img = resize_image(img, width)
    
    # Convert to emoji using single emoji for consistency
    return image_to_emoji_mosaic(img, [emoji, ' '], density_levels=2)

def parse_args():
    parser = argparse.ArgumentParser(description="Convert images or text to emoji art")
    parser.add_argument('input', help='Image path or text to convert')
    parser.add_argument('--mode', choices=['image', 'text'], default='image', 
                       help='Convert image file or text string')
    parser.add_argument('--emoji', help='Single emoji to use (for text mode)')
    parser.add_argument('--emoji-set', choices=list(EMOJI_SETS.keys()), 
                       help='Predefined emoji set to use')
    parser.add_argument('--custom-emojis', help='Custom emoji list (comma-separated)')
    parser.add_argument('--width', type=int, default=80, 
                       help='Width in characters')
    parser.add_argument('--list-sets', action='store_true', 
                       help='List available emoji sets')
    
    return parser.parse_args()

def main():
    args = parse_args()
    
    if args.list_sets:
        print("Available emoji sets:")
        for name, emojis in EMOJI_SETS.items():
            print(f"  {name}: {' '.join(emojis[:10])}{'...' if len(emojis) > 10 else ''}")
        return
    
    if args.mode == 'text':
        if not args.emoji:
            print("Error: --emoji required for text mode")
            sys.exit(1)
        
        result = text_to_emoji_art(args.input, args.emoji, args.width)
        print(result)
        
    elif args.mode == 'image':
        if not os.path.isfile(args.input):
            print(f"Error: Image file not found: {args.input}")
            sys.exit(1)
        
        # Determine emoji set to use
        if args.custom_emojis:
            emoji_list = args.custom_emojis.split(',')
        elif args.emoji_set:
            emoji_list = EMOJI_SETS[args.emoji_set]
        elif args.emoji:
            emoji_list = [args.emoji, ' ']  # Single emoji with space for contrast
        else:
            emoji_list = EMOJI_SETS['geometric']  # Default
        
        try:
            img = Image.open(args.input)
            img = resize_image(img, args.width)
            result = image_to_emoji_mosaic(img, emoji_list)
            print(result)
        except Exception as e:
            print(f"Error processing image: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
