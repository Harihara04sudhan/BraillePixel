"""Unified CLI for BraillePixel.

Usage:
    braillepixel braille image.png --cols 80
    braillepixel emoji image.png --emoji-set geometric --width 40
    braillepixel emoji "HELLO" --mode text --emoji "🔥"
    braillepixel text "BraillePixel" --font block --border "#"
"""

import sys

USAGE = __doc__


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help"):
        print(USAGE)
        return 0

    command = sys.argv[1]
    # Rewrite argv so each sub-tool's own argparse sees its expected args
    sys.argv = [f"braillepixel-{command}"] + sys.argv[2:]

    if command == "braille":
        from braillepixel.textart import main as run
    elif command == "emoji":
        from braillepixel.emoji_art import main as run
    elif command == "text":
        from braillepixel.ascii_text import main as run
    else:
        print(f"Unknown command: {command}\n{USAGE}", file=sys.stderr)
        return 2

    run()
    return 0


if __name__ == "__main__":
    sys.exit(main())
