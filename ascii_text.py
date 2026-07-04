"""Backward-compat shim — the code now lives in braillepixel.ascii_text.

Kept so existing commands like `python ascii_text.py "HI" --font block`
keep working. Prefer: `braillepixel text "HI" --font block`.
"""

from braillepixel.ascii_text import *  # noqa: F401,F403
from braillepixel.ascii_text import main

if __name__ == "__main__":
    main()
