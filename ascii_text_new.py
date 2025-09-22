#!/usr/bin/env python3
"""
ASCII Text Art Generator
Convert text to large ASCII art using different fonts/styles
"""

import argparse
import sys

# ASCII font patterns with complete alphabet
FONTS = {
    'block': {
        'A': [
            " ███ ",
            "██ ██",
            "█████",
            "██ ██"
        ],
        'B': [
            "████ ",
            "██ ██",
            "████ ",
            "████ "
        ],
        'C': [
            " ████",
            "██   ",
            "██   ",
            " ████"
        ],
        'D': [
            "████ ",
            "██ ██",
            "██ ██",
            "████ "
        ],
        'E': [
            "█████",
            "███  ",
            "███  ",
            "█████"
        ],
        'F': [
            "█████",
            "███  ",
            "███  ",
            "██   "
        ],
        'G': [
            " ████",
            "██   ",
            "██ ██",
            " ████"
        ],
        'H': [
            "██ ██",
            "█████",
            "██ ██",
            "██ ██"
        ],
        'I': [
            "█████",
            "  ██ ",
            "  ██ ",
            "█████"
        ],
        'J': [
            "█████",
            "   ██",
            "██ ██",
            " ████"
        ],
        'K': [
            "██ ██",
            "████ ",
            "████ ",
            "██ ██"
        ],
        'L': [
            "██   ",
            "██   ",
            "██   ",
            "█████"
        ],
        'M': [
            "█████",
            "██ ██",
            "██ ██",
            "██ ██"
        ],
        'N': [
            "██ ██",
            "█████",
            "█████",
            "██ ██"
        ],
        'O': [
            " ███ ",
            "██ ██",
            "██ ██",
            " ███ "
        ],
        'P': [
            "████ ",
            "██ ██",
            "████ ",
            "██   "
        ],
        'Q': [
            " ███ ",
            "██ ██",
            "█████",
            " ████"
        ],
        'R': [
            "████ ",
            "██ ██",
            "████ ",
            "██ ██"
        ],
        'S': [
            " ████",
            "███  ",
            "  ███",
            "████ "
        ],
        'T': [
            "█████",
            "  ██ ",
            "  ██ ",
            "  ██ "
        ],
        'U': [
            "██ ██",
            "██ ██",
            "██ ██",
            " ███ "
        ],
        'V': [
            "██ ██",
            "██ ██",
            "█████",
            " ███ "
        ],
        'W': [
            "██ ██",
            "██ ██",
            "██ ██",
            "█████"
        ],
        'X': [
            "██ ██",
            " ███ ",
            " ███ ",
            "██ ██"
        ],
        'Y': [
            "██ ██",
            " ███ ",
            "  ██ ",
            "  ██ "
        ],
        'Z': [
            "█████",
            "  ███",
            "███  ",
            "█████"
        ],
        '0': [
            " ███ ",
            "██ ██",
            "██ ██",
            " ███ "
        ],
        '1': [
            "  ██ ",
            " ███ ",
            "  ██ ",
            "█████"
        ],
        '2': [
            "████ ",
            "  ███",
            "███  ",
            "█████"
        ],
        '3': [
            "████ ",
            "  ███",
            "  ███",
            "████ "
        ],
        '4': [
            "██ ██",
            "█████",
            "   ██",
            "   ██"
        ],
        '5': [
            "█████",
            "████ ",
            "  ███",
            "████ "
        ],
        '6': [
            " ███ ",
            "██   ",
            "████ ",
            " ███ "
        ],
        '7': [
            "█████",
            "   ██",
            "  ██ ",
            " ██  "
        ],
        '8': [
            " ███ ",
            "█████",
            "█████",
            " ███ "
        ],
        '9': [
            " ███ ",
            "█████",
            "   ██",
            " ███ "
        ],
        '!': [
            " ██ ",
            " ██ ",
            "    ",
            " ██ "
        ],
        '?': [
            "███ ",
            " ███",
            "  ██",
            "  ██"
        ],
        '.': [
            "   ",
            "   ",
            "   ",
            "██ "
        ],
        ',': [
            "   ",
            "   ",
            "██ ",
            "██ "
        ],
        ' ': [
            "     ",
            "     ",
            "     ",
            "     "
        ]
    },
    'simple': {
        'A': [
            " ## ",
            "# ##",
            "####",
            "# ##"
        ],
        'B': [
            "### ",
            "# ##",
            "### ",
            "### "
        ],
        'C': [
            " ###",
            "#   ",
            "#   ",
            " ###"
        ],
        'D': [
            "### ",
            "# ##",
            "# ##",
            "### "
        ],
        'E': [
            "####",
            "##  ",
            "##  ",
            "####"
        ],
        'F': [
            "####",
            "##  ",
            "##  ",
            "#   "
        ],
        'G': [
            " ###",
            "#   ",
            "# ##",
            " ###"
        ],
        'H': [
            "# ##",
            "####",
            "# ##",
            "# ##"
        ],
        'I': [
            "####",
            " ## ",
            " ## ",
            "####"
        ],
        'J': [
            "####",
            "  ##",
            "# ##",
            " ###"
        ],
        'K': [
            "# ##",
            "### ",
            "### ",
            "# ##"
        ],
        'L': [
            "#   ",
            "#   ",
            "#   ",
            "####"
        ],
        'M': [
            "####",
            "# ##",
            "# ##",
            "# ##"
        ],
        'N': [
            "# ##",
            "####",
            "####",
            "# ##"
        ],
        'O': [
            " ## ",
            "# ##",
            "# ##",
            " ## "
        ],
        'P': [
            "### ",
            "# ##",
            "### ",
            "#   "
        ],
        'Q': [
            " ## ",
            "# ##",
            "####",
            " ###"
        ],
        'R': [
            "### ",
            "# ##",
            "### ",
            "# ##"
        ],
        'S': [
            " ###",
            "##  ",
            "  ##",
            "### "
        ],
        'T': [
            "####",
            " ## ",
            " ## ",
            " ## "
        ],
        'U': [
            "# ##",
            "# ##",
            "# ##",
            " ## "
        ],
        'V': [
            "# ##",
            "# ##",
            "####",
            " ## "
        ],
        'W': [
            "# ##",
            "# ##",
            "# ##",
            "####"
        ],
        'X': [
            "# ##",
            " ## ",
            " ## ",
            "# ##"
        ],
        'Y': [
            "# ##",
            " ## ",
            " ## ",
            " ## "
        ],
        'Z': [
            "####",
            " ###",
            "##  ",
            "####"
        ],
        '0': [
            " ## ",
            "# ##",
            "# ##",
            " ## "
        ],
        '1': [
            " ## ",
            "### ",
            " ## ",
            "####"
        ],
        '2': [
            "### ",
            " ###",
            "##  ",
            "####"
        ],
        '3': [
            "### ",
            " ###",
            " ###",
            "### "
        ],
        '4': [
            "# ##",
            "####",
            "  ##",
            "  ##"
        ],
        '5': [
            "####",
            "### ",
            " ###",
            "### "
        ],
        '6': [
            " ## ",
            "#   ",
            "### ",
            " ## "
        ],
        '7': [
            "####",
            "  ##",
            " ## ",
            "##  "
        ],
        '8': [
            " ## ",
            "####",
            "####",
            " ## "
        ],
        '9': [
            " ## ",
            "####",
            "  ##",
            " ## "
        ],
        '!': [
            " # ",
            " # ",
            "   ",
            " # "
        ],
        '?': [
            "## ",
            " ##",
            " # ",
            " # "
        ],
        '.': [
            "  ",
            "  ",
            "  ",
            "# "
        ],
        ',': [
            "  ",
            "  ",
            "# ",
            "# "
        ],
        ' ': [
            "   ",
            "   ",
            "   ",
            "   "
        ]
    }
}

def text_to_ascii_art(text, font='block', spacing=1):
    """Convert text to ASCII art using specified font"""
    text = text.upper()
    font_data = FONTS.get(font, FONTS['block'])
    
    if not text:
        return ""
    
    # Get height of font
    if not font_data:
        return "Error: Font not found"
    
    height = len(font_data[list(font_data.keys())[0]])
    
    # Build each line
    lines = []
    for row in range(height):
        line = ""
        for char in text:
            if char in font_data:
                line += font_data[char][row]
            else:
                # Unknown character - use space or default pattern
                if ' ' in font_data:
                    line += font_data[' '][row]
                else:
                    line += '   '  # fallback spaces
            
            # Add spacing between characters
            if char != ' ':
                line += ' ' * spacing
        lines.append(line)
    
    return '\n'.join(lines)

def create_border(text_lines, border_char='#', padding=1):
    """Add border around ASCII art"""
    lines = text_lines.split('\n')
    if not lines:
        return ""
    
    max_width = max(len(line) for line in lines)
    
    # Top border
    bordered = [border_char * (max_width + 2 * padding + 2)]
    
    # Side borders with padding
    for line in lines:
        padded_line = line.ljust(max_width)
        bordered.append(border_char + ' ' * padding + padded_line + ' ' * padding + border_char)
    
    # Bottom border
    bordered.append(border_char * (max_width + 2 * padding + 2))
    
    return '\n'.join(bordered)

def create_gradient_text(text, chars=' .:-=+*#%@'):
    """Create gradient effect using different ASCII characters"""
    if not text:
        return ""
    
    lines = text.split('\n')
    result_lines = []
    
    for line in lines:
        new_line = ""
        for i, char in enumerate(line):
            if char == ' ':
                new_line += ' '
            else:
                # Map position to gradient character
                gradient_index = min(i % len(chars), len(chars) - 1)
                new_line += chars[gradient_index]
        result_lines.append(new_line)
    
    return '\n'.join(result_lines)

def parse_args():
    parser = argparse.ArgumentParser(description="Convert text to ASCII art")
    parser.add_argument('text', help='Text to convert to ASCII art')
    parser.add_argument('--font', choices=list(FONTS.keys()), default='block',
                       help='Font style to use')
    parser.add_argument('--spacing', type=int, default=1,
                       help='Spacing between characters')
    parser.add_argument('--border', help='Add border with specified character')
    parser.add_argument('--gradient', action='store_true',
                       help='Apply gradient effect')
    parser.add_argument('--list-fonts', action='store_true',
                       help='List available fonts')
    
    return parser.parse_args()

def main():
    args = parse_args()
    
    if args.list_fonts:
        print("Available fonts:")
        for font_name in FONTS:
            print(f"  {font_name}")
            # Show sample
            sample = text_to_ascii_art('ABC', font_name, 1)
            for line in sample.split('\n'):
                print(f"    {line}")
            print()
        return
    
    # Generate ASCII art
    result = text_to_ascii_art(args.text, args.font, args.spacing)
    
    # Apply effects
    if args.gradient:
        result = create_gradient_text(result)
    
    if args.border:
        result = create_border(result, args.border)
    
    print(result)

if __name__ == "__main__":
    main()
