"""Backward-compat shim — the code now lives in braillepixel.textart.

Kept so existing commands like `python textart.py image.jpg --cols 80`
keep working. Prefer: `braillepixel braille image.jpg --cols 80`.
"""

from braillepixel.textart import *  # noqa: F401,F403
from braillepixel.textart import main

if __name__ == "__main__":
    main()
