from PIL import Image, ImageEnhance
import sys
import os
import argparse

# Mapping 2x4 pixel blocks to a Braille character (Unicode 0x2800 base)
# Dot numbering within a Braille cell:
# 1 4
# 2 5
# 3 6
# 7 8
# Bits: (dot_number - 1) sets that bit.

def image_to_braille(img, threshold=127, invert=False):
    """Convert a grayscale PIL image to Braille art string.

    The image is sampled in 2x4 pixel blocks. Each block becomes one Braille character.
    Pixels darker than threshold are considered "on".
    """
    if img.mode != "L":
        img = img.convert("L")

    # Get image statistics for auto-threshold
    from PIL import ImageStat
    stat = ImageStat.Stat(img)
    mean_val = stat.mean[0]
    auto_threshold = mean_val * 0.85  # Slightly below mean
    
    # Use auto-threshold if default threshold is used
    if threshold == 127:
        threshold = int(auto_threshold)
        print(f"Debug - Auto threshold: {threshold} (from mean: {mean_val:.1f})", file=sys.stderr)

    width, height = img.size
    # Ensure dimensions are multiples of 2 (width) and 4 (height) by cropping
    width -= width % 2
    height -= height % 4
    if (width, height) != img.size:
        img = img.crop((0, 0, width, height))

    pixels = img.load()
    
    # Debug: Print some pixel values to understand the image
    if width >= 10 and height >= 10:
        sample_pixels = [pixels[x, y] for x in range(0, min(10, width), 2) for y in range(0, min(10, height), 2)]
        print(f"Debug - Sample pixels: {sample_pixels[:10]}", file=sys.stderr)
        print(f"Debug - Threshold: {threshold}, Min: {min(sample_pixels)}, Max: {max(sample_pixels)}", file=sys.stderr)

    lines = []
    for y in range(0, height, 4):
        line_chars = []
        for x in range(0, width, 2):
            bits = 0
            # (dx, dy, dot_number)
            mapping = [
                (0, 0, 1), (0, 1, 2), (0, 2, 3), (0, 3, 7),
                (1, 0, 4), (1, 1, 5), (1, 2, 6), (1, 3, 8),
            ]
            for dx, dy, dot in mapping:
                pixel_val = pixels[x + dx, y + dy]
                # Apply invert option or use threshold logic
                if invert:
                    condition = pixel_val > threshold
                else:
                    condition = pixel_val < threshold
                
                if condition:
                    bits |= 1 << (dot - 1)
            line_chars.append(chr(0x2800 + bits))
        lines.append("".join(line_chars))
    return "\n".join(lines)

def enhance_contrast(img):
    """Enhance image contrast for better Braille conversion"""
    from PIL import ImageOps, ImageStat
    
    # Check image statistics
    stat = ImageStat.Stat(img)
    mean_val = stat.mean[0]
    stddev = stat.stddev[0] if hasattr(stat, 'stddev') else 0
    
    print(f"Debug - Image stats: mean={mean_val:.1f}, std={stddev:.1f}", file=sys.stderr)
    
    # If very low contrast or very light/dark, use equalization
    if stddev < 20 or mean_val > 240 or mean_val < 15:
        print("Debug - Using histogram equalization", file=sys.stderr)
        return ImageOps.equalize(img)
    
    # Normal contrast enhancement for images with variation
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.3)  # Moderate contrast increase
    
    return img


def load_image(path):
    return Image.open(path).convert("L")


def resize_to_cells(img, cols=None, rows=None, max_cols=None):
    """Resize image to target number of Braille cells (cols x rows).

    Each Braille cell = 2(width) x 4(height) pixels. We preserve aspect ratio.
    Priority:
      - If cols or rows provided, scale to fit inside both (like "contain").
      - If neither provided but max_cols provided, shrink only if wider.
    """
    w, h = img.size
    width_cells = w / 2
    height_cells = h / 4

    scale_factors = []
    if cols:
        scale_factors.append(cols / width_cells)
    if rows:
        scale_factors.append(rows / height_cells)

    if scale_factors:
        scale = min(scale_factors)
    elif max_cols:
        if width_cells <= max_cols:
            return img
        scale = max_cols / width_cells
    else:
        # Default max size to prevent huge output
        scale = min(60 / width_cells, 40 / height_cells) if width_cells > 60 or height_cells > 40 else 1

    new_w = int(w * scale)
    new_h = int(h * scale)

    # Adjust to required multiples and ensure minimum size
    new_w = max(2, new_w - (new_w % 2))
    new_h = max(4, new_h - (new_h % 4))
    
    return img.resize((new_w, new_h), Image.LANCZOS)


# Keep old helper for backward compatibility (now delegates)

def auto_resize(img, max_cols=120):
    return resize_to_cells(img, max_cols=max_cols)


def parse_args():
    p = argparse.ArgumentParser(description="Convert image to Unicode Braille art")
    p.add_argument("image", nargs="?", default="/home/hari/Documents/pyart/vj.jpg", help="Image path")
    p.add_argument("--cols", type=int, help="Target number of Braille columns (width)")
    p.add_argument("--rows", type=int, help="Target number of Braille rows (height)")
    p.add_argument("--max-cols", type=int, default=None, help="Maximum columns (shrink only if wider)")
    p.add_argument("--threshold", type=int, default=127, help="Grayscale threshold 0-255 (lower = lighter)")
    p.add_argument("--invert", action="store_true", help="Invert colors (light on dark)")
    return p.parse_args()


def main():
    args = parse_args()
    image_path = args.image

    if not os.path.isfile(image_path):
        print(f"Image not found: {image_path}")
        sys.exit(1)

    try:
        img = load_image(image_path)
    except Exception as e:
        print(f"Failed to open image: {e}")
        sys.exit(1)

    img = resize_to_cells(img, cols=args.cols, rows=args.rows, max_cols=args.max_cols)
    art = image_to_braille(img, threshold=args.threshold, invert=args.invert)
    print(art)


if __name__ == "__main__":
    main()
