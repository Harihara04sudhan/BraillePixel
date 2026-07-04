"""BraillePixel — convert images and text to Braille, ASCII, and emoji art."""

from braillepixel.textart import image_to_braille, resize_to_cells
from braillepixel.emoji_art import (
    EMOJI_SETS,
    image_to_emoji_mosaic,
    resize_image,
    text_to_emoji_art,
)
from braillepixel.ascii_text import (
    create_border,
    create_gradient_text,
    text_to_ascii_art,
)

__version__ = "0.1.0"

__all__ = [
    "image_to_braille",
    "resize_to_cells",
    "image_to_emoji_mosaic",
    "text_to_emoji_art",
    "resize_image",
    "EMOJI_SETS",
    "text_to_ascii_art",
    "create_border",
    "create_gradient_text",
    "__version__",
]
