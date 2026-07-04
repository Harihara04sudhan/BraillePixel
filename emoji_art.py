"""Backward-compat shim — the code now lives in braillepixel.emoji_art.

Kept so existing commands like `python emoji_art.py photo.jpg --width 60`
keep working. Prefer: `braillepixel emoji photo.jpg --width 60`.
"""

from braillepixel.emoji_art import *  # noqa: F401,F403
from braillepixel.emoji_art import main

if __name__ == "__main__":
    main()
