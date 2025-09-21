# BraillePixel

<!-- Badges -->
<!-- Uncomment / replace after publishing to PyPI or adding CI -->
<!-- ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) -->
<!-- ![Python Versions](https://img.shields.io/badge/python-3.9+-blue.svg) -->

Lightweight CLI tool to render images as Unicode Braille art directly in your terminal.

## Repository
GitHub: https://github.com/Harihara04sudhan/BraillePixel

Clone:
```bash
git clone https://github.com/Harihara04sudhan/BraillePixel.git
cd BraillePixel
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python textart.py sample.jpg --cols 80
```

## Requirements
- Python 3.9+ (tested on 3.13)
- Pillow

## Why Braille?
Unicode Braille patterns (U+2800–U+28FF) pack an 2x4 pixel matrix into a single character, giving higher vertical resolution than standard ASCII art. This lets you represent more detail with fewer rows.

## Features
- Convert any image to Braille art
- Automatic grayscale conversion
- Dimension control by Braille cells (columns / rows)
- Aspect-ratio preserving scaling
- Adjustable brightness threshold
- Safe resizing (never produces degenerate tiny output)
- Zero external font dependencies (just a Unicode-capable terminal)

## Quick Start
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python textart.py /path/to/image.jpg --cols 80
```
If no image path is provided it defaults to `smiley.jpeg` inside the project directory.

## CLI Usage
```bash
python textart.py [image] [--cols N] [--rows N] [--max-cols N] [--threshold T]
```
Arguments:
- image: (optional) path to an image file. Defaults to bundled path.
- --cols: Target number of Braille columns (width). Scales image to fit.
- --rows: Target number of Braille rows (height). Scales to fit.
- --cols + --rows: Scales to fit inside both (like "contain").
- --max-cols: Only shrink if wider than this many columns (preserve if smaller).
- --threshold: Grayscale cutoff 0–255 (lower = lighter output). Default: 127.

Priority logic:
1. If --cols or --rows specified, they drive scaling (fit inside box).
2. Else if --max-cols specified, shrink only if necessary.
3. Else original size (cropped to even multiples of Braille cell size) is used.

## Examples
```bash
# Simple render at 60 columns
python textart.py cat.png --cols 60

# Limit by rows instead (e.g. fit small terminal height)
python textart.py portrait.jpg --rows 30

# Fit inside width AND height bounds
python textart.py scene.jpeg --cols 80 --rows 40

# Only shrink if too wide
python textart.py logo.png --max-cols 100

# Darker output (raise threshold)
python textart.py face.jpg --cols 70 --threshold 150

# Lighter output (lower threshold)
python textart.py face.jpg --cols 70 --threshold 90
```

## Sample Output
```
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢠⣶⣄⠀⠀⣴⣦⠀⠀⠀
⠀⢀⣿⣿⣿⡆⢸⣿⣿⣿⡇⠀
⠀⠈⣿⣿⣿⠇⢸⣿⣿⣿⡇⠀
⠀⠀⠈⠛⠋⠀⠀⠈⠛⠋⠀⠀
```
(Result using a simplified demo image at 18 cols.)

## How It Works
1. Image is converted to 8-bit grayscale.
2. Optionally rescaled to target Braille cell dimensions.
3. Image is cropped so width is multiple of 2 and height multiple of 4.
4. Each 2x4 block maps to a Braille symbol by setting bits for dark pixels.

Braille dot layout:
```
1 4
2 5
3 6
7 8
```
Each active dot sets a bit (dot_index - 1) added to base code point U+2800.

## Output Piping / Viewing
If your terminal scrolls a lot:
```bash
python textart.py image.jpg --cols 100 | less -R
```
`-R` preserves Unicode without escaping.

## Performance Notes
- Scaling uses Pillow's bicubic filter (fast & smooth for small terminal previews).
- Each Braille char replaces 8 pixels (2x4), reducing data volume sharply.
- Typical 80x40 cell output processes in milliseconds on modern hardware.

## Roadmap / Ideas
- Invert mode
- Auto threshold via Otsu method
- Color approximation (ANSI) pre-pass
- Export to text file (`--out`)
- GIF frame animation
- Optional dithering (Floyd–Steinberg) before threshold

## Troubleshooting
| Issue | Fix |
|-------|-----|
| ModuleNotFoundError: PIL | Run `pip install -r requirements.txt` |
| Output too tall | Use `--rows` or reduce `--cols` |
| Too dark / light | Adjust `--threshold` |
| Distorted aspect | Only specify one of `--cols` or `--rows` |
| Unicode blocks show as blanks | Use a font with Braille range support |

## Contributing
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-change`
3. Install deps: `pip install -r requirements.txt`
4. Add a before/after snippet if visual change
5. Open PR

## License
MIT

---
Feel free to open issues or extend the script.
