#!/bin/bash

# AdSense code to add
ADSENSE_CODE='    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3125411696052604"
         crossorigin="anonymous"></script>
         '

# Files that need AdSense code (files without ca-pub-3125411696052604)
FILES_TO_UPDATE=(
    "debug-emoji-text.html"
    "local-test.html"
    "test-binary-mode.html"
    "test-emoji-complete.html"
    "test-emoji-fix.html"
    "test-emoji-mode.html"
    "test-emoji-spacing.html"
    "test-end-to-end.html"
    "test-main-app-emoji.html"
    "test-manual.html"
    "test-simple-emoji.html"
    "test.html"
)

for file in "${FILES_TO_UPDATE[@]}"; do
    if [ -f "$file" ]; then
        # Check if file doesn't already have AdSense
        if ! grep -q "ca-pub-3125411696052604" "$file"; then
            echo "Adding AdSense to $file"
            # Find the </title> tag and add AdSense after it
            sed -i "/<\/title>/a\\$ADSENSE_CODE" "$file"
        else
            echo "$file already has AdSense"
        fi
    else
        echo "$file not found"
    fi
done

echo "AdSense code addition completed!"
