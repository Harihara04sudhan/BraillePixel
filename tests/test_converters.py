"""Tests for BraillePixel core converters."""

import pytest
from PIL import Image

from braillepixel import (
    EMOJI_SETS,
    create_border,
    image_to_braille,
    image_to_emoji_mosaic,
    resize_to_cells,
    text_to_ascii_art,
    text_to_emoji_art,
)

BRAILLE_RANGE = (0x2800, 0x28FF)


@pytest.fixture
def gradient_image():
    """A small horizontal black→white gradient."""
    img = Image.new("L", (64, 32))
    img.putdata([int(255 * (i % 64) / 63) for i in range(64 * 32)])
    return img


@pytest.fixture
def black_image():
    return Image.new("L", (16, 16), color=0)


@pytest.fixture
def white_image():
    return Image.new("L", (16, 16), color=255)


class TestBraille:
    def test_returns_braille_characters(self, gradient_image):
        art = image_to_braille(gradient_image)
        assert isinstance(art, str)
        assert len(art) > 0
        chars = {c for line in art.splitlines() for c in line}
        assert any(BRAILLE_RANGE[0] <= ord(c) <= BRAILLE_RANGE[1] for c in chars)

    def test_half_image_has_empty_and_full_cells(self):
        # Left half black, right half white → both cell extremes present
        img = Image.new("L", (32, 16), color=0)
        img.paste(255, (16, 0, 32, 16))
        art = image_to_braille(img).replace("\n", "")
        assert chr(0x2800) in art
        assert chr(0x28FF) in art

    def test_invert_flips_output(self):
        img = Image.new("L", (32, 16), color=0)
        img.paste(255, (16, 0, 32, 16))
        normal = image_to_braille(img)
        inverted = image_to_braille(img, invert=True)
        assert normal != inverted

    def test_dimensions_match_cells(self, gradient_image):
        art = image_to_braille(gradient_image)
        lines = art.splitlines()
        # 64x32 px → 32 cols (÷2), 8 rows (÷4)
        assert len(lines) == 32 // 4
        assert all(len(line) == 64 // 2 for line in lines)


class TestResize:
    def test_resize_to_cols(self, gradient_image):
        resized = resize_to_cells(gradient_image, cols=10)
        assert resized.size[0] <= 10 * 2

    def test_max_cols_shrinks_only_when_wider(self, gradient_image):
        resized = resize_to_cells(gradient_image, max_cols=10)
        assert resized.size[0] <= 10 * 2
        small = Image.new("L", (8, 8))
        untouched = resize_to_cells(small, max_cols=100)
        assert untouched.size == (8, 8)


class TestEmoji:
    def test_mosaic_contains_emoji(self, gradient_image):
        art = image_to_emoji_mosaic(gradient_image.convert("RGB"))
        assert isinstance(art, str)
        assert len(art) > 0

    def test_binary_mode_uses_two_emoji(self, gradient_image):
        art = image_to_emoji_mosaic(
            gradient_image.convert("RGB"),
            binary_mode=True,
            on_emoji="🔥",
            off_emoji="⚪",
        )
        assert "🔥" in art or "⚪" in art

    def test_text_to_emoji_art(self):
        art = text_to_emoji_art("HI", width=40)
        assert isinstance(art, str)
        assert len(art) > 0

    def test_emoji_sets_defined(self):
        assert isinstance(EMOJI_SETS, dict)
        assert len(EMOJI_SETS) > 0


class TestAsciiText:
    def test_basic_render(self):
        art = text_to_ascii_art("HI")
        assert isinstance(art, str)
        assert len(art.splitlines()) > 1

    def test_border_wraps_content(self):
        bordered = create_border("hello", border_char="#")
        assert "#" in bordered
        assert "hello" in bordered
