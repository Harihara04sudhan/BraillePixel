// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Update range slider displays
document.addEventListener('DOMContentLoaded', function() {
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
        const valueSpan = document.getElementById(input.id + '-val');
        if (valueSpan) {
            input.addEventListener('input', () => {
                valueSpan.textContent = input.value;
            });
        }
    });
    
    // Handle emoji mode switching
    const emojiModeInputs = document.querySelectorAll('input[name="emoji-mode"]');
    emojiModeInputs.forEach(input => {
        input.addEventListener('change', function() {
            const imageInput = document.getElementById('emoji-image-input');
            const textInput = document.getElementById('emoji-text-input');
            
            if (this.value === 'image') {
                imageInput.style.display = 'block';
                textInput.style.display = 'none';
            } else {
                imageInput.style.display = 'none';
                textInput.style.display = 'block';
            }
        });
    });
    
    // Handle emoji set selection
    const emojiSetSelect = document.getElementById('emoji-set');
    const customEmojiInput = document.getElementById('custom-emoji-input');
    
    emojiSetSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customEmojiInput.style.display = 'flex';
        } else {
            customEmojiInput.style.display = 'none';
        }
    });
});

// Braille Art Generation (Real API calls)
function generateBraille() {
    const fileInput = document.getElementById('braille-file');
    const output = document.getElementById('output');
    
    if (!fileInput.files[0]) {
        output.textContent = 'Please select an image file first.';
        return;
    }
    
    const cols = document.getElementById('braille-cols').value;
    const rows = document.getElementById('braille-rows').value;
    const threshold = document.getElementById('braille-threshold').value;
    const invert = document.getElementById('braille-invert').checked;
    
    output.textContent = 'Processing image...';
    
    // Read the file and convert to base64
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Call the backend API
        fetch('/api/braille', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageData,
                cols: parseInt(cols),
                rows: parseInt(rows),
                threshold: parseInt(threshold),
                invert: invert
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                output.textContent = 'Error: ' + data.error;
            } else {
                output.textContent = data.result;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            output.textContent = 'Error processing image: ' + error.message;
        });
    };
    
    reader.readAsDataURL(file);
}

function generateDemoBrailleArt(cols, rows) {
    // Generate demo braille art pattern
    const brailleChars = '⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿';
    
    let result = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Create a simple pattern based on position
            const intensity = Math.sin(r * 0.2) * Math.cos(c * 0.1) + 0.5;
            const charIndex = Math.floor(intensity * (brailleChars.length - 1));
            result += brailleChars[charIndex] || '⠀';
        }
        result += '\n';
    }
    
    return result;
}

// Emoji Art Generation (Real API calls)
function generateEmoji() {
    const mode = document.querySelector('input[name="emoji-mode"]:checked').value;
    const output = document.getElementById('output');
    
    if (mode === 'image') {
        const fileInput = document.getElementById('emoji-file');
        if (!fileInput.files[0]) {
            output.textContent = 'Please select an image file first.';
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = e.target.result;
            const emojiSet = document.getElementById('emoji-set').value;
            const customEmoji = document.getElementById('custom-emoji').value;
            const width = document.getElementById('emoji-width').value;
            
            output.textContent = 'Generating emoji art...';
            
            fetch('/api/emoji', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mode: 'image',
                    image: imageData,
                    width: parseInt(width),
                    emoji_set: emojiSet,
                    custom_emojis: customEmoji
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    output.textContent = 'Error: ' + data.error;
                } else {
                    output.textContent = data.result;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                output.textContent = 'Error processing image: ' + error.message;
            });
        };
        
        reader.readAsDataURL(file);
        
    } else {
        // Text mode
        const text = document.getElementById('emoji-text').value;
        const customEmoji = document.getElementById('custom-emoji').value;
        const width = document.getElementById('emoji-width').value;
        
        if (!text) {
            output.textContent = 'Please enter text to convert.';
            return;
        }
        
        output.textContent = 'Generating emoji art...';
        
        fetch('/api/emoji', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mode: 'text',
                text: text,
                emoji: customEmoji || '🔥',
                width: parseInt(width)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                output.textContent = 'Error: ' + data.error;
            } else {
                output.textContent = data.result;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            output.textContent = 'Error generating text: ' + error.message;
        });
    }
}

function generateDemoEmojiText(text, emoji, width) {
    if (!text) return 'Please enter text to convert.';
    
    // Simple text to emoji pattern
    const lines = [];
    const charHeight = 5;
    
    for (let row = 0; row < charHeight; row++) {
        let line = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === ' ') {
                line += '  ';
            } else {
                // Create simple pattern for each character
                if (row === 0 || row === 4) line += emoji + ' ';
                else if (row === 2) line += emoji + emoji;
                else line += emoji + ' ';
            }
        }
        lines.push(line);
    }
    
    return lines.join('\n');
}

function generateDemoEmojiArt(emojiSet, customEmoji, width) {
    const emojiSets = {
        'faces': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣'],
        'hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍'],
        'nature': ['🌸', '🌺', '🌻', '🌹', '🌷', '🌿', '🍀', '🌾'],
        'geometric': ['⬛', '⬜', '🔲', '🔳', '◼️', '◻️', '▪️', '▫️'],
        'animals': ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
        'food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍑']
    };
    
    let emojis;
    if (emojiSet === 'custom') {
        emojis = customEmoji.split(',').map(e => e.trim()).filter(e => e);
        if (emojis.length === 0) emojis = ['🔥'];
    } else {
        emojis = emojiSets[emojiSet] || emojiSets.geometric;
    }
    
    let result = '';
    const height = Math.floor(width * 0.6); // Maintain aspect ratio
    
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            // Create pattern based on position
            const pattern = (r + c) % emojis.length;
            result += emojis[pattern];
        }
        result += '\n';
    }
    
    return result;
}

// ASCII Text Generation (Real API calls)
function generateASCII() {
    const text = document.getElementById('ascii-text').value;
    const font = document.getElementById('ascii-font').value;
    const spacing = parseInt(document.getElementById('ascii-spacing').value);
    const border = document.getElementById('ascii-border').checked;
    const gradient = document.getElementById('ascii-gradient').checked;
    const output = document.getElementById('output');
    
    if (!text) {
        output.textContent = 'Please enter text to convert.';
        return;
    }
    
    output.textContent = 'Generating ASCII art...';
    
    fetch('/api/ascii', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text,
            font: font,
            spacing: spacing,
            border: border,
            gradient: gradient
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            output.textContent = 'Error: ' + data.error;
        } else {
            output.textContent = data.result;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        output.textContent = 'Error generating ASCII: ' + error.message;
    });
}

function generateDemoASCIIArt(text, font, spacing, border, gradient) {
    const fonts = {
        'block': {
            'A': ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██'],
            'B': ['██████', '██  ██', '██████', '██████', '██████'],
            'C': [' █████', '██    ', '██    ', '██    ', ' █████'],
            'D': ['██████', '██  ██', '██  ██', '██  ██', '██████'],
            'E': ['██████', '██    ', '█████ ', '██    ', '██████'],
            'H': ['██  ██', '██  ██', '██████', '██  ██', '██  ██'],
            'L': ['██    ', '██    ', '██    ', '██    ', '██████'],
            'O': [' █████', '██  ██', '██  ██', '██  ██', ' █████'],
            ' ': ['      ', '      ', '      ', '      ', '      ']
        },
        'simple': {
            'A': [' ## ', '####', '# ##', '####', '# ##'],
            'B': ['### ', '# ##', '### ', '# ##', '### '],
            'C': ['####', '#   ', '#   ', '#   ', '####'],
            'E': ['####', '#   ', '### ', '#   ', '####'],
            'H': ['# ##', '# ##', '####', '# ##', '# ##'],
            'L': ['#   ', '#   ', '#   ', '#   ', '####'],
            'O': [' ## ', '# ##', '# ##', '# ##', ' ## '],
            ' ': ['    ', '    ', '    ', '    ', '    ']
        }
    };
    
    const fontData = fonts[font] || fonts.block;
    const height = 5;
    let result = [];
    
    // Generate each line
    for (let row = 0; row < height; row++) {
        let line = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const pattern = fontData[char] || fontData[' '];
            line += pattern[row] || '    ';
            line += ' '.repeat(spacing);
        }
        result.push(line);
    }
    
    let art = result.join('\n');
    
    // Apply gradient effect
    if (gradient) {
        const gradientChars = ' .:-=+*#%@';
        art = art.replace(/./g, (char, index) => {
            if (char === '\n') return char;
            if (char === ' ') return ' ';
            const gradIndex = Math.floor((index % 50) / 5);
            return gradientChars[Math.min(gradIndex, gradientChars.length - 1)];
        });
    }
    
    // Add border
    if (border) {
        const lines = art.split('\n');
        const maxWidth = Math.max(...lines.map(line => line.length));
        const borderLine = '#'.repeat(maxWidth + 4);
        
        const borderedLines = [borderLine];
        lines.forEach(line => {
            borderedLines.push('# ' + line.padEnd(maxWidth) + ' #');
        });
        borderedLines.push(borderLine);
        
        art = borderedLines.join('\n');
    }
    
    return art;
}

// Utility functions
function copyOutput() {
    const output = document.getElementById('output');
    navigator.clipboard.writeText(output.textContent).then(() => {
        // Show feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard');
    });
}

function downloadOutput() {
    const output = document.getElementById('output');
    const content = output.textContent;
    
    if (!content || content.trim() === 'Your generated art will appear here...') {
        alert('No content to download. Generate some art first!');
        return;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    a.click();
    window.URL.revokeObjectURL(url);
}

// File upload handling
document.addEventListener('DOMContentLoaded', function() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        const uploadArea = input.closest('.upload-area');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.style.borderColor = '#667eea';
                uploadArea.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.style.borderColor = '#cbd5e0';
                uploadArea.style.backgroundColor = '';
            });
        });
        
        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                uploadArea.querySelector('p').textContent = `Selected: ${files[0].name}`;
            }
        });
        
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                uploadArea.querySelector('p').textContent = `Selected: ${e.target.files[0].name}`;
            }
        });
    });
});
