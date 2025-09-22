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

def image_to_emoji_mosaic(img, emoji_list=None, density_levels=16, on_emoji='🔥', off_emoji='⚪', binary_mode=False, threshold=128):
    """
    Convert grayscale image to emoji mosaic
    
    Args:
        img: PIL Image object
        emoji_list: List of emojis for gradient mode (deprecated, use binary_mode=False)
        density_levels: Number of density levels for gradient mode
        on_emoji: Emoji for "on" pixels in binary mode
        off_emoji: Emoji for "off" pixels in binary mode  
        binary_mode: If True, use only on_emoji and off_emoji based on threshold
        threshold: Brightness threshold for binary mode (0-255)
    """
    if img.mode != "L":
        img = img.convert("L")
    
    pixels = img.load()
    width, height = img.size
    
    if binary_mode:
        # Binary mode: use only on_emoji and off_emoji
        lines = []
        for y in range(height):
            line = []
            for x in range(width):
                pixel = pixels[x, y]
                # Use on_emoji for pixels above threshold, off_emoji for below
                emoji = on_emoji if pixel >= threshold else off_emoji
                line.append(emoji)
            lines.append(''.join(line))
        return '\n'.join(lines)
    else:
        # Gradient mode: use emoji_list with density levels
        if not emoji_list:
            emoji_list = ['⬛', '⬜']  # Default fallback
        
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

def text_to_emoji_art(text, on_emoji='🔥', off_emoji='⚪', width=80, binary_threshold=128):
    """
    Convert text to emoji art using PIL for text rendering
    
    Args:
        text: Text to convert
        on_emoji: Emoji for text pixels (foreground)
        off_emoji: Emoji for background pixels  
        width: Target width in characters
        binary_threshold: Brightness threshold for binary conversion (0-255)
    """
    from PIL import ImageFont, ImageDraw
    
    try:
        # Try to load a font (adjust path as needed)
        font_size = 60
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        try:
            # Try other common font locations
            font_paths = [
                "/System/Library/Fonts/Helvetica.ttc",  # macOS
                "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",  # Some Linux
                "/Windows/Fonts/arial.ttf",  # Windows
            ]
            font = None
            for path in font_paths:
                try:
                    font = ImageFont.truetype(path, font_size)
                    break
                except:
                    continue
            
            if not font:
                # Fallback to default
                font = ImageFont.load_default()
                font_size = 30
        except:
            print("Warning: Could not load font, text rendering may not work properly")
            # Return simple replacement as fallback
            result = []
            for char in text:
                if char == ' ':
                    result.append(off_emoji * 3)  # Space between words
                else:
                    result.append(on_emoji * 3)  # Simple block per character
            return '\n'.join([' '.join(result)])
    
    # Calculate image size needed for text
    bbox = font.getbbox(text)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Add padding for better rendering
    padding = max(20, font_size // 4)
    img_width = text_width + 2 * padding
    img_height = text_height + 2 * padding
    
    # Create image with text (white background, black text)
    img = Image.new('RGB', (img_width, img_height), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((padding, padding), text, font=font, fill='black')
    
    # Convert to grayscale and resize
    img = img.convert('L')
    img = resize_image(img, width)
    
    # Convert to binary emoji art for better text clarity
    return image_to_emoji_mosaic(img, binary_mode=True, on_emoji=on_emoji, off_emoji=off_emoji, threshold=binary_threshold)

def parse_args():
    parser = argparse.ArgumentParser(description="Convert images or text to emoji art")
    parser.add_argument('input', help='Image path or text to convert')
    parser.add_argument('--mode', choices=['image', 'text'], default='image', 
                       help='Convert image file or text string')
    parser.add_argument('--on-emoji', default='🔥', 
                       help='Emoji for "on" pixels (foreground) in binary mode')
    parser.add_argument('--off-emoji', default='⚪', 
                       help='Emoji for "off" pixels (background) in binary mode')
    parser.add_argument('--binary', action='store_true',
                       help='Use binary mode (on/off emojis only) instead of gradient')
    parser.add_argument('--threshold', type=int, default=128,
                       help='Brightness threshold for binary mode (0-255)')
    parser.add_argument('--emoji', help='Single emoji to use (legacy, use --on-emoji instead)')
    parser.add_argument('--emoji-set', choices=list(EMOJI_SETS.keys()), 
                       help='Predefined emoji set to use (gradient mode)')
    parser.add_argument('--custom-emojis', help='Custom emoji list (comma-separated, gradient mode)')
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
        # Use new improved text-to-emoji function
        on_emoji = args.on_emoji
        if args.emoji:  # Legacy support
            on_emoji = args.emoji
        
        result = text_to_emoji_art(
            args.input, 
            on_emoji=on_emoji,
            off_emoji=args.off_emoji,
            width=args.width,
            binary_threshold=args.threshold
        )
        print(result)
        
    elif args.mode == 'image':
        if not os.path.isfile(args.input):
            print(f"Error: Image file not found: {args.input}")
            sys.exit(1)
        
        try:
            img = Image.open(args.input)
            img = resize_image(img, args.width)
            
            if args.binary:
                # Binary mode with on/off emojis
                result = image_to_emoji_mosaic(
                    img, 
                    binary_mode=True,
                    on_emoji=args.on_emoji,
                    off_emoji=args.off_emoji,
                    threshold=args.threshold
                )
            else:
                # Gradient mode with emoji sets
                if args.custom_emojis:
                    emoji_list = args.custom_emojis.split(',')
                elif args.emoji_set:
                    emoji_list = EMOJI_SETS[args.emoji_set]
                elif args.emoji:
                    emoji_list = [args.emoji, ' ']  # Single emoji with space for contrast
                else:
                    emoji_list = EMOJI_SETS['geometric']  # Default
                
                result = image_to_emoji_mosaic(img, emoji_list=emoji_list, binary_mode=False)
            
            print(result)
            
        except Exception as e:
            print(f"Error processing image: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
