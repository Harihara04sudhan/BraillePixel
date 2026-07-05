#!/usr/bin/env python3
"""
Demo script to showcase all BraillePixel features
"""

import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SMILEY = os.path.join(HERE, "examples", "smiley.jpeg")


def run(script, *args):
    """Run one of the CLI tools with the current Python interpreter."""
    subprocess.run([sys.executable, os.path.join(HERE, script), *args])


def run_demo():
    print("🎨 BraillePixel Demo - Multiple Art Generation Methods\n")
    print("=" * 60)

    # Test 1: Braille Art
    print("\n1️⃣  BRAILLE ART (Original)")
    print("-" * 30)
    run("textart.py", SMILEY, "--cols", "25", "--rows", "15")

    # Test 2: Emoji Art - Text
    print("\n\n2️⃣  EMOJI TEXT ART")
    print("-" * 30)
    run("emoji_art.py", "PIXEL", "--mode", "text", "--emoji", "🔥", "--width", "25")

    # Test 3: Emoji Art - Image
    print("\n\n3️⃣  EMOJI IMAGE ART")
    print("-" * 30)
    run("emoji_art.py", SMILEY, "--emoji-set", "geometric", "--width", "20")

    # Test 4: ASCII Text Art
    print("\n\n4️⃣  ASCII TEXT ART")
    print("-" * 30)
    run("ascii_text.py", "BraillePixel", "--font", "block", "--border", "#")

    # Test 5: Different Emoji Sets
    print("\n\n5️⃣  DIFFERENT EMOJI SETS")
    print("-" * 30)
    print("Hearts Theme:")
    run("emoji_art.py", "LOVE", "--mode", "text", "--emoji", "❤️", "--width", "20")

    print("\nNature Theme:")
    run("emoji_art.py", SMILEY, "--emoji-set", "nature", "--width", "15")

    print("\n\n✨ WEB INTERFACE AVAILABLE")
    print("-" * 30)
    print("For interactive use, run: python web_server.py")
    print("Then open: http://localhost:5000")
    print("\n🎯 All tools support different options - check --help for each!")


if __name__ == "__main__":
    run_demo()
