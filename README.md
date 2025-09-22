# BraillePixel

<!-- Badges -->
<!-- Uncomment / replace after publishing to PyPI or adding CI -->
<!-- ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) -->
<!-- ![Python Versions](https://img.shields.io/badge/python-3.9+-blue.svg) -->

🎨 **Multi-format text art generator** - Convert images and text to Braille, Emoji, and ASCII art with CLI tools + web interface.

## 🚀 Quick Demo
```bash
git clone https://github.com/Harihara04sudhan/BraillePixel.git
cd BraillePixel
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python demo.py  # See all formats in action
```

## 🌐 Web Interface
```bash
python web_server.py
# Open http://localhost:5000 for interactive GUI
```

## 📦 What's Included
- **`textart.py`** - Image → Braille art (high resolution Unicode)
- **`emoji_art.py`** - Image/text → Emoji mosaics (6 themed sets + custom)
- **`ascii_text.py`** - Text → Large ASCII art (multiple fonts + effects)
- **Web UI** - Interactive browser interface for all tools

## 🎯 Features
- **Braille Art**: 2x4 pixel density, dimension control, threshold adjustment
- **Emoji Art**: 6 emoji sets (faces, hearts, nature, etc.) + custom emojis
- **ASCII Text**: Block/simple fonts, borders, gradients, spacing control
- **Web Interface**: Drag-drop images, real-time preview, copy/download
- **CLI Tools**: Scriptable with full parameter control

## 💻 CLI Examples

### Braille Art
```bash
python textart.py image.jpg --cols 80 --threshold 140
python textart.py photo.png --rows 30 --cols 100
```

### Emoji Art
```bash
# Text to emoji
python emoji_art.py "HELLO" --mode text --emoji "🔥" --width 40

# Image to emoji mosaic
python emoji_art.py photo.jpg --emoji-set hearts --width 60
python emoji_art.py logo.png --custom-emojis "🌟,⭐,✨,💫"

# List available sets
python emoji_art.py --list-sets dummy
```

### ASCII Text Art
```bash
python ascii_text.py "BraillePixel" --font block --border "#"
python ascii_text.py "HELLO" --font simple --gradient
```

## 🖼️ Sample Output

**Braille Art** (high resolution):
```
⠀⠀⢠⣶⣄⠀⠀⣴⣦⠀⠀
⢀⣿⣿⣿⡆⢸⣿⣿⣿⡇
⢸⣿⣿⣿⡇⢸⣿⣿⣿⡇
⠈⣿⣿⣿⠇⢸⣿⣿⣿⡇
⠀⠈⠛⠋⠀⠀⠈⠛⠋⠀
```

**Emoji Art**:
```
🔥🔥 🔥🔥🔥 🔥    🔥    🔥🔥🔥  
🔥   🔥      🔥    🔥    🔥   🔥 
🔥🔥🔥🔥 🔥🔥🔥 🔥    🔥    🔥   🔥 
🔥   🔥      🔥    🔥    🔥   🔥 
🔥   🔥  🔥🔥🔥🔥 🔥🔥🔥🔥 🔥🔥🔥  
```

**ASCII Text**:
```
##################################################
# ██ ██ ████ ██   ██    ███   ████ ### ### ### ██ #
# █████ ███  ██   ██   ██ ██ ███   # # # # # # ██ #
# ██ ██ ███  ██   ██   ██ ██ ███   # # # # # # ██ #
# ██ ██ ████ ████ ████  ███  █████ ### ### ### ██ #
##################################################
```

## 🎨 Web Interface Features
- **Drag & drop** image uploads
- **Real-time** parameter adjustment
- **Multiple tabs** for different art types
- **Copy/Download** generated art
- **Mobile responsive** design

## 🛠️ Technical Details

### Braille Art
- Maps 2x4 pixel blocks → single Braille character (U+2800-U+28FF)
- Higher vertical resolution than ASCII
- Configurable dimensions & brightness threshold

### Emoji Art
- **Image mode**: Converts brightness → emoji density
- **Text mode**: Renders text as emoji patterns
- **6 built-in sets**: faces, hearts, nature, geometric, animals, food
- **Custom emoji support**

### ASCII Text
- **Font styles**: Block, Simple (extensible)
- **Effects**: Borders, gradients, spacing
- **Pattern-based** character generation

## 🔧 Installation & Setup
```bash
# Clone repo
git clone https://github.com/Harihara04sudhan/BraillePixel.git
cd BraillePixel

# Setup virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Test all features
python demo.py

# Start web interface
python web_server.py
```

## 🎯 Requirements
- **Python 3.9+** (tested on 3.13)
- **Pillow** (image processing)
- **Flask + Flask-CORS** (web interface)

## 📝 CLI Arguments

### textart.py (Braille)
- `--cols N` - Target columns
- `--rows N` - Target rows  
- `--threshold N` - Brightness threshold (0-255)

### emoji_art.py
- `--mode {image,text}` - Input type
- `--emoji EMOJI` - Single emoji (text mode)
- `--emoji-set SET` - Predefined set
- `--custom-emojis LIST` - Custom comma-separated emojis
- `--width N` - Output width

### ascii_text.py  
- `--font {block,simple}` - Font style
- `--spacing N` - Character spacing
- `--border CHAR` - Add border
- `--gradient` - Apply gradient effect

## 🔮 Roadmap
- [ ] **Color support** (ANSI/terminal colors)
- [ ] **More ASCII fonts** 
- [ ] **Animation support** (GIF frames)
- [ ] **Batch processing** mode
- [ ] **Auto-threshold** (Otsu method)
- [ ] **Invert mode** toggle

## 🤝 Contributing
1. Fork → create feature branch
2. Install: `pip install -r requirements.txt`
3. Test your changes across all tools
4. Include before/after samples
5. Submit PR

## 🐛 Troubleshooting
| Issue | Solution |
|-------|----------|
| Import errors | `pip install -r requirements.txt` |
| Web UI not loading | Check `python web_server.py` output |
| Unicode not displaying | Use Unicode-compatible terminal/font |
| Images too large | Use `--cols` to limit dimensions |
| Art too dark/light | Adjust `--threshold` value |

## 📄 License
MIT License - see [LICENSE](LICENSE)

## 🔗 Links
- **GitHub**: https://github.com/Harihara04sudhan/BraillePixel
- **Issues**: https://github.com/Harihara04sudhan/BraillePixel/issues
- **Web Demo**: Run `python web_server.py` → http://localhost:5000

---
**Made with ❤️ by Hari** | Star ⭐ if you find this useful!
