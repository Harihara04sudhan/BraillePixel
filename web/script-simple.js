// Simplified BraillePixel Script - Basic Functionality Only

console.log('🚀 BraillePixel loading...');

// Simple tab functionality
function showTab(tabName) {
    console.log('📋 Switching to tab:', tabName);
    
    // Hide all tabs
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update button states
    const allButtons = document.querySelectorAll('.tab-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    // Find and activate clicked button
    if (window.event) {
        window.event.target.classList.add('active');
    }
}

// Simple generate functions with REAL image processing
function generateBraille() {
    console.log('🎨 Generate Braille called');
    
    const output = document.getElementById('output');
    const fileInput = document.getElementById('braille-file');
    
    if (!output) {
        console.error('Output element not found');
        return;
    }
    
    if (!fileInput) {
        output.textContent = 'Error: File input not found. Please refresh the page.';
        return;
    }
    
    if (!fileInput.files[0]) {
        output.textContent = 'Please select an image file first.\n\nClick the upload area above to select an image.';
        return;
    }
    
    const file = fileInput.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        output.textContent = 'Please select a valid image file (PNG, JPG, GIF, etc.).';
        return;
    }
    
    // Get parameters with fallbacks
    const colsInput = document.getElementById('braille-cols');
    const rowsInput = document.getElementById('braille-rows');
    const thresholdInput = document.getElementById('braille-threshold');
    const invertCheck = document.getElementById('braille-invert');
    
    const cols = colsInput ? parseInt(colsInput.value) || 40 : 40;
    const rows = rowsInput ? parseInt(rowsInput.value) || 24 : 24;
    const threshold = thresholdInput ? parseInt(thresholdInput.value) || 127 : 127;
    const invert = invertCheck ? invertCheck.checked : false;
    
    console.log('Braille parameters:', { file: file.name, cols, rows, threshold, invert });
    
    output.textContent = 'Processing image...';
    
    try {
        // Process the image
        processImageToBraille(file, cols, rows, threshold, invert, output);
    } catch (error) {
        console.error('Error processing braille:', error);
        output.textContent = 'Error processing image: ' + error.message;
    }
}

function generateEmoji() {
    console.log('😀 Generate Emoji called');
    
    const output = document.getElementById('output');
    const mode = document.querySelector('input[name="emoji-mode"]:checked');
    
    if (!output) {
        console.error('Output element not found');
        return;
    }
    
    if (!mode) {
        output.textContent = 'Error: Emoji mode not selected. Please refresh the page.';
        return;
    }
    
    if (mode.value === 'text') {
        const textInput = document.getElementById('emoji-text');
        const text = textInput ? textInput.value.toUpperCase() : 'HELLO';
        
        if (!text.trim()) {
            output.textContent = 'Please enter some text to convert to emoji art.';
            return;
        }
        
        // Get emoji settings for text mode
        const renderMode = document.querySelector('input[name="emoji-render-mode"]:checked');
        let onEmoji = '🔥';
        let offEmoji = '⚪';
        
        if (renderMode && renderMode.value === 'binary') {
            const onInput = document.getElementById('on-emoji');
            const offInput = document.getElementById('off-emoji');
            onEmoji = onInput ? (onInput.value.trim() || '🔥') : '🔥';
            offEmoji = offInput ? (offInput.value.trim() || '⚪') : '⚪';
        } else {
            // For gradient mode in text, use default emojis or first from custom set
            const emojiSetSelect = document.getElementById('emoji-set');
            const customEmojiInput = document.getElementById('custom-emoji');
            
            if (emojiSetSelect && emojiSetSelect.value === 'custom' && customEmojiInput) {
                const customEmojis = customEmojiInput.value.split(',').map(e => e.trim()).filter(e => e);
                if (customEmojis.length >= 2) {
                    onEmoji = customEmojis[0];
                    offEmoji = customEmojis[customEmojis.length - 1]; // Use last as background
                } else if (customEmojis.length === 1) {
                    onEmoji = customEmojis[0];
                    offEmoji = '⚪'; // Default background
                }
            }
            // For gradient mode with predefined sets, use default emojis for text
        }
        
        console.log('Text-to-emoji settings:', { text, onEmoji, offEmoji, renderMode: renderMode?.value });
        output.textContent = generateTextToEmoji(text, onEmoji, offEmoji);
    } else {
        const fileInput = document.getElementById('emoji-file');
        if (!fileInput || !fileInput.files[0]) {
            output.textContent = 'Please select an image file first.\n\nClick the upload area above to select an image.';
            return;
        }
        
        const file = fileInput.files[0];
        const widthInput = document.getElementById('emoji-width');
        const width = widthInput ? parseInt(widthInput.value) || 40 : 40;
        
        const renderModeInput = document.querySelector('input[name="emoji-render-mode"]:checked');
        const renderMode = renderModeInput ? renderModeInput.value : 'gradient';
        
        output.textContent = 'Processing image...';
        
        if (renderMode === 'binary') {
            const onInput = document.getElementById('on-emoji');
            const offInput = document.getElementById('off-emoji');
            const thresholdInput = document.getElementById('emoji-threshold');
            
            const onEmoji = onInput ? onInput.value || '🔥' : '🔥';
            const offEmoji = offInput ? offInput.value || '⚪' : '⚪';
            const threshold = thresholdInput ? parseInt(thresholdInput.value) || 128 : 128;
            
            processImageToEmojiBinary(file, width, onEmoji, offEmoji, threshold, output);
        } else {
            const emojiSetSelect = document.getElementById('emoji-set');
            const emojiSet = emojiSetSelect ? emojiSetSelect.value || 'geometric' : 'geometric';
            processImageToEmojiGradient(file, width, emojiSet, output);
        }
    }
}

function generateASCII() {
    console.log('📝 Generate ASCII called');
    
    const output = document.getElementById('output');
    
    if (!output) {
        console.error('Output element not found');
        return;
    }
    
    const textInput = document.getElementById('ascii-text');
    const text = textInput ? textInput.value.toUpperCase().trim() : 'HELLO';
    
    if (!text) {
        output.textContent = 'Please enter some text to convert to ASCII art.';
        return;
    }
    
    const fontSelect = document.getElementById('ascii-font');
    const borderCheck = document.getElementById('ascii-border');
    const gradientCheck = document.getElementById('ascii-gradient');
    
    const font = fontSelect ? fontSelect.value || 'block' : 'block';
    const border = borderCheck ? borderCheck.checked : false;
    const gradient = gradientCheck ? gradientCheck.checked : false;
    
    console.log('ASCII settings:', { text, font, border, gradient });
    
    try {
        const result = generateASCIIText(text, font, border, gradient);
        output.textContent = result;
    } catch (error) {
        console.error('Error generating ASCII:', error);
        output.textContent = 'Error generating ASCII art: ' + error.message;
    }
}

// Real image processing functions
function processImageToBraille(file, cols, rows, threshold, invert, output) {
    const reader = new FileReader();
    
    reader.onerror = function() {
        output.textContent = 'Error reading image file. Please try a different image.';
    };
    
    reader.onload = function(e) {
        const img = new Image();
        
        img.onerror = function() {
            output.textContent = 'Error loading image. Please ensure it\'s a valid image file.';
        };
        
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Resize image to fit braille dimensions
                canvas.width = cols * 2; // Braille is 2 pixels wide
                canvas.height = rows * 4; // Braille is 4 pixels tall
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                let result = '';
                const brailleBase = 0x2800;
                
                for (let y = 0; y < rows; y++) {
                    let line = '';
                    for (let x = 0; x < cols; x++) {
                        let dots = 0;
                        
                        // Process 2x4 braille cell
                        for (let dy = 0; dy < 4; dy++) {
                            for (let dx = 0; dx < 2; dx++) {
                                const pixelX = x * 2 + dx;
                                const pixelY = y * 4 + dy;
                                
                                if (pixelX < canvas.width && pixelY < canvas.height) {
                                    const index = (pixelY * canvas.width + pixelX) * 4;
                                    const r = imageData.data[index];
                                    const g = imageData.data[index + 1];
                                    const b = imageData.data[index + 2];
                                    
                                    // Convert to grayscale
                                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                                    const isOn = invert ? gray < threshold : gray > threshold;
                                    
                                    if (isOn) {
                                        // Map to braille dot positions
                                        if (dx === 0 && dy === 0) dots |= 0x01;
                                        if (dx === 0 && dy === 1) dots |= 0x02;
                                        if (dx === 0 && dy === 2) dots |= 0x04;
                                        if (dx === 1 && dy === 0) dots |= 0x08;
                                        if (dx === 1 && dy === 1) dots |= 0x10;
                                        if (dx === 1 && dy === 2) dots |= 0x20;
                                        if (dx === 0 && dy === 3) dots |= 0x40;
                                        if (dx === 1 && dy === 3) dots |= 0x80;
                                    }
                                }
                            }
                        }
                        
                        line += String.fromCharCode(brailleBase + dots);
                    }
                    result += line + '\n';
                }
                
                output.textContent = result.trim();
                console.log('Braille generation completed successfully');
                
            } catch (error) {
                console.error('Canvas processing error:', error);
                output.textContent = 'Error processing image with canvas. Please try a different image.';
            }
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function processImageToEmojiBinary(file, width, onEmoji, offEmoji, threshold, output) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const height = Math.floor(width * 0.6);
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const imageData = ctx.getImageData(0, 0, width, height);
            let result = '';
            
            for (let y = 0; y < height; y++) {
                let line = '';
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const r = imageData.data[index];
                    const g = imageData.data[index + 1];
                    const b = imageData.data[index + 2];
                    
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    const emoji = gray > threshold ? onEmoji : offEmoji;
                    line += emoji;
                    
                    // Add space after each emoji except the last one in the row
                    if (x < width - 1) {
                        line += ' ';
                    }
                }
                result += line + '\n';
            }
            
            output.textContent = result.trim();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function processImageToEmojiGradient(file, width, emojiSet, output) {
    const emojiSets = {
        'geometric': ['⬛', '▪️', '🔸', '🔹', '◻️', '⬜'],
        'faces': ['😭', '😢', '😐', '🙂', '😊', '😄'],
        'hearts': ['💔', '❤️‍🩹', '❤️', '💖', '💕', '💞'],
        'nature': ['🌑', '🌘', '🌗', '🌖', '🌕', '🌟'],
        'animals': ['🐸', '🐱', '🐶', '🦊', '🐰', '🐻'],
        'food': ['🥀', '🍎', '🍊', '🍋', '🌽', '🍰']
    };
    
    const emojis = emojiSets[emojiSet] || emojiSets['geometric'];
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const height = Math.floor(width * 0.6);
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const imageData = ctx.getImageData(0, 0, width, height);
            let result = '';
            
            for (let y = 0; y < height; y++) {
                let line = '';
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const r = imageData.data[index];
                    const g = imageData.data[index + 1];
                    const b = imageData.data[index + 2];
                    
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    const emojiIndex = Math.floor((gray / 255) * (emojis.length - 1));
                    line += emojis[emojiIndex];
                    
                    // Add space after each emoji except the last one in the row
                    if (x < width - 1) {
                        line += ' ';
                    }
                }
                result += line + '\n';
            }
            
            output.textContent = result.trim();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function generateTextToEmoji(text, onEmoji, offEmoji) {
    // Fixed letter patterns for better readability
    const letterPatterns = {
        'A': ['01110', '10001', '11111', '10001', '10001'],
        'B': ['11110', '10001', '11110', '10001', '11110'],
        'C': ['01111', '10000', '10000', '10000', '01111'],
        'D': ['11110', '10001', '10001', '10001', '11110'],
        'E': ['11111', '10000', '11110', '10000', '11111'],
        'F': ['11111', '10000', '11110', '10000', '10000'],
        'G': ['01111', '10000', '10111', '10001', '01111'],
        'H': ['10001', '10001', '11111', '10001', '10001'],
        'I': ['01110', '00100', '00100', '00100', '01110'],
        'J': ['00111', '00010', '00010', '10010', '01100'],
        'K': ['10001', '10010', '11100', '10010', '10001'],
        'L': ['10000', '10000', '10000', '10000', '11111'],
        'M': ['10001', '11011', '10101', '10001', '10001'],
        'N': ['10001', '11001', '10101', '10011', '10001'],
        'O': ['01110', '10001', '10001', '10001', '01110'],
        'P': ['11110', '10001', '11110', '10000', '10000'],
        'Q': ['01110', '10001', '10101', '10011', '01101'],
        'R': ['11110', '10001', '11110', '10010', '10001'],
        'S': ['01111', '10000', '01110', '00001', '11110'],
        'T': ['11111', '00100', '00100', '00100', '00100'],
        'U': ['10001', '10001', '10001', '10001', '01110'],
        'V': ['10001', '10001', '10001', '01010', '00100'],
        'W': ['10001', '10001', '10101', '11011', '10001'],
        'X': ['10001', '01010', '00100', '01010', '10001'],
        'Y': ['10001', '01010', '00100', '00100', '00100'],
        'Z': ['11111', '00010', '00100', '01000', '11111'],
        ' ': ['00000', '00000', '00000', '00000', '00000']
    };
    
    let result = '';
    
    // Generate each row
    for (let row = 0; row < 5; row++) {
        let line = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const pattern = letterPatterns[char] || letterPatterns[' '];
            const rowPattern = pattern[row];
            
            // Convert pattern to emojis without extra spaces within letters
            for (let j = 0; j < rowPattern.length; j++) {
                const bit = rowPattern[j];
                line += bit === '1' ? onEmoji : offEmoji;
            }
            
            // Add spacing between letters (not within letters)
            if (i < text.length - 1) {
                line += offEmoji; // Single separator emoji between letters
            }
        }
        result += line + '\n';
    }
    
    return result.trim();
}

function generateASCIIText(text, font, border, gradient) {
    const fonts = {
        'block': {
            'A': ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██'],
            'B': ['██████', '██  ██', '██████', '██████', '██████'],
            'C': [' █████', '██    ', '██    ', '██    ', ' █████'],
            'D': ['██████', '██  ██', '██  ██', '██  ██', '██████'],
            'E': ['██████', '██    ', '█████ ', '██    ', '██████'],
            'F': ['██████', '██    ', '█████ ', '██    ', '██    '],
            'G': [' █████', '██    ', '██ ███', '██  ██', ' █████'],
            'H': ['██  ██', '██  ██', '██████', '██  ██', '██  ██'],
            'I': ['██████', '  ██  ', '  ██  ', '  ██  ', '██████'],
            'J': ['██████', '    ██', '    ██', '██  ██', ' █████'],
            'K': ['██  ██', '██ ██ ', '████  ', '██ ██ ', '██  ██'],
            'L': ['██    ', '██    ', '██    ', '██    ', '██████'],
            'M': ['██  ██', '██████', '██████', '██  ██', '██  ██'],
            'N': ['██  ██', '███ ██', '██████', '██ ███', '██  ██'],
            'O': [' █████', '██  ██', '██  ██', '██  ██', ' █████'],
            'P': ['██████', '██  ██', '██████', '██    ', '██    '],
            'Q': [' █████', '██  ██', '██  ██', '██ ███', ' ██████'],
            'R': ['██████', '██  ██', '██████', '██ ██ ', '██  ██'],
            'S': [' █████', '██    ', ' █████', '    ██', ' █████'],
            'T': ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  '],
            'U': ['██  ██', '██  ██', '██  ██', '██  ██', ' █████'],
            'V': ['██  ██', '██  ██', '██  ██', ' ████ ', '  ██  '],
            'W': ['██  ██', '██  ██', '██████', '██████', '██  ██'],
            'X': ['██  ██', ' ████ ', '  ██  ', ' ████ ', '██  ██'],
            'Y': ['██  ██', '██  ██', ' ████ ', '  ██  ', '  ██  '],
            'Z': ['██████', '   ██ ', '  ██  ', ' ██   ', '██████'],
            ' ': ['      ', '      ', '      ', '      ', '      ']
        },
        'simple': {
            'A': [' ## ', '####', '# ##', '####', '# ##'],
            'B': ['### ', '# ##', '### ', '# ##', '### '],
            'C': ['####', '#   ', '#   ', '#   ', '####'],
            'D': ['### ', '# ##', '# ##', '# ##', '### '],
            'E': ['####', '#   ', '### ', '#   ', '####'],
            'F': ['####', '#   ', '### ', '#   ', '#   '],
            'G': ['####', '#   ', '# ##', '# ##', '####'],
            'H': ['# ##', '# ##', '####', '# ##', '# ##'],
            'I': ['####', ' ## ', ' ## ', ' ## ', '####'],
            'J': ['####', '  ##', '  ##', '# ##', '####'],
            'K': ['# ##', '### ', '##  ', '### ', '# ##'],
            'L': ['#   ', '#   ', '#   ', '#   ', '####'],
            'M': ['# ##', '####', '####', '# ##', '# ##'],
            'N': ['# ##', '####', '####', '####', '# ##'],
            'O': [' ## ', '# ##', '# ##', '# ##', ' ## '],
            'P': ['### ', '# ##', '### ', '#   ', '#   '],
            'Q': [' ## ', '# ##', '# ##', '####', ' ###'],
            'R': ['### ', '# ##', '### ', '# ##', '# ##'],
            'S': ['####', '#   ', '### ', '  ##', '### '],
            'T': ['####', ' ## ', ' ## ', ' ## ', ' ## '],
            'U': ['# ##', '# ##', '# ##', '# ##', '####'],
            'V': ['# ##', '# ##', '# ##', '####', ' ## '],
            'W': ['# ##', '# ##', '####', '####', '# ##'],
            'X': ['# ##', '####', ' ## ', '####', '# ##'],
            'Y': ['# ##', '# ##', '####', ' ## ', ' ## '],
            'Z': ['####', ' ## ', ' ## ', ' ## ', '####'],
            ' ': ['    ', '    ', '    ', '    ', '    ']
        }
    };
    
    const selectedFont = fonts[font] || fonts['block'];
    let result = [];
    
    // Generate each row
    for (let row = 0; row < 5; row++) {
        let line = '';
        for (let char of text) {
            const pattern = selectedFont[char] || selectedFont[' '];
            line += pattern[row] + ' ';
        }
        result.push(line);
    }
    
    let finalResult = result.join('\n');
    
    // Add border if requested
    if (border) {
        const maxWidth = Math.max(...result.map(line => line.length));
        const borderTop = '█'.repeat(maxWidth + 4);
        const borderSides = result.map(line => '██' + line.padEnd(maxWidth) + '██');
        const borderBottom = '█'.repeat(maxWidth + 4);
        
        finalResult = [borderTop, ...borderSides, borderBottom].join('\n');
    }
    
    // Apply gradient effect
    if (gradient) {
        const gradientChars = ['░', '▒', '▓', '█'];
        finalResult = finalResult.replace(/█/g, () => {
            return gradientChars[Math.floor(Math.random() * gradientChars.length)];
        }).replace(/#/g, () => {
            return gradientChars[Math.floor(Math.random() * gradientChars.length)];
        });
    }
    
    return finalResult;
}

// Handle emoji mode switching (image vs text)
function handleEmojiModeChange() {
    const selectedMode = document.querySelector('input[name="emoji-mode"]:checked');
    const imageInput = document.getElementById('emoji-image-input');
    const textInput = document.getElementById('emoji-text-input');
    
    if (!selectedMode || !imageInput || !textInput) {
        console.warn('Emoji mode elements not found');
        return;
    }
    
    console.log('🔄 Emoji mode changed to:', selectedMode.value);
    
    if (selectedMode.value === 'text') {
        // Show text input, hide image input
        imageInput.style.display = 'none';
        textInput.style.display = 'block';
        console.log('✅ Switched to text input mode');
    } else {
        // Show image input, hide text input
        imageInput.style.display = 'block';
        textInput.style.display = 'none';
        console.log('✅ Switched to image input mode');
    }
}

// Handle emoji render mode switching (gradient vs binary)
function handleEmojiRenderModeChange() {
    const selectedMode = document.querySelector('input[name="emoji-render-mode"]:checked');
    const gradientControls = document.getElementById('gradient-controls');
    const binaryControls = document.getElementById('binary-controls');
    
    if (!selectedMode || !gradientControls || !binaryControls) {
        console.warn('Emoji render mode elements not found');
        return;
    }
    
    console.log('🎨 Emoji render mode changed to:', selectedMode.value);
    
    if (selectedMode.value === 'binary') {
        // Show binary controls, hide gradient controls
        gradientControls.style.display = 'none';
        binaryControls.style.display = 'block';
        console.log('✅ Switched to binary render mode');
    } else {
        // Show gradient controls, hide binary controls
        gradientControls.style.display = 'block';
        binaryControls.style.display = 'none';
        console.log('✅ Switched to gradient render mode');
    }
}

// Utility functions
function copyOutput() {
    const output = document.getElementById('output');
    const text = output.textContent;
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('✅ Text copied to clipboard');
            alert('Text copied to clipboard! ✅');
        }).catch(err => {
            console.error('❌ Copy failed:', err);
            // Fallback to manual selection
            selectOutput();
            alert('Please press Ctrl+C to copy the selected text.');
        });
    } else {
        // Fallback for older browsers
        selectOutput();
        alert('Text selected. Please press Ctrl+C to copy.');
    }
}

function selectOutput() {
    const output = document.getElementById('output');
    
    try {
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(output);
            selection.removeAllRanges();
            selection.addRange(range);
            console.log('✅ Text selected');
        } else if (document.selection) {
            // IE fallback
            const range = document.body.createTextRange();
            range.moveToElementText(output);
            range.select();
        }
    } catch (err) {
        console.error('❌ Selection failed:', err);
        output.focus();
    }
}

function downloadOutput() {
    const output = document.getElementById('output');
    const text = output.textContent;
    
    try {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'braillepixel-art.txt';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('✅ File download initiated');
        alert('File download started! 💾');
    } catch (err) {
        console.error('❌ Download failed:', err);
        alert('Download failed. Please copy the text manually.');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM loaded, initializing...');
    
    // Initialize file upload areas
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        const fileInput = area.querySelector('input[type="file"]');
        if (fileInput) {
            // Make upload area clickable (but prevent double trigger)
            area.addEventListener('click', (e) => {
                // Only trigger if the click is NOT on the file input itself
                if (e.target !== fileInput) {
                    e.preventDefault();
                    e.stopPropagation();
                    fileInput.click();
                }
            });
            
            // Handle file selection
            fileInput.addEventListener('change', (e) => {
                console.log('File selected for:', fileInput.id);
                if (e.target.files.length > 0) {
                    const fileName = e.target.files[0].name;
                    const paragraph = area.querySelector('p');
                    if (paragraph) {
                        paragraph.innerHTML = `✅ Selected: <strong>${fileName}</strong>`;
                        area.style.borderColor = '#48bb78';
                        area.style.backgroundColor = 'rgba(72, 187, 120, 0.1)';
                    }
                    console.log('File processed:', fileName);
                }
            });
            
            // Prevent the file input from triggering the area click
            fileInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });
    
    // Initialize sliders
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        const valueDisplay = document.getElementById(slider.id + '-val');
        if (valueDisplay) {
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
            });
        }
    });
    
    // Initialize emoji mode switching
    const emojiModeRadios = document.querySelectorAll('input[name="emoji-mode"]');
    emojiModeRadios.forEach(radio => {
        radio.addEventListener('change', handleEmojiModeChange);
    });
    
    // Initialize emoji render mode switching
    const emojiRenderModeRadios = document.querySelectorAll('input[name="emoji-render-mode"]');
    emojiRenderModeRadios.forEach(radio => {
        radio.addEventListener('change', handleEmojiRenderModeChange);
    });
    
    // Initialize emoji mode display
    handleEmojiModeChange();
    handleEmojiRenderModeChange();
    
    console.log('✅ BraillePixel initialized successfully!');
    
    // Run comprehensive test
    runComprehensiveTest();
});

// Comprehensive test function
function runComprehensiveTest() {
    console.log('🧪 Running comprehensive functionality test...');
    
    const tests = [
        { name: 'Tab buttons', selector: '.tab-btn', expected: 3 },
        { name: 'Upload areas', selector: '.upload-area', expected: 2 },
        { name: 'File inputs', selector: 'input[type="file"]', expected: 3 },
        { name: 'Generate buttons', selector: '.generate-btn', expected: 3 },
        { name: 'Range sliders', selector: 'input[type="range"]', expected: 6 },
        { name: 'Output area', selector: '#output', expected: 1 },
        { name: 'Braille controls', selector: '#braille-cols, #braille-rows, #braille-threshold', expected: 3 },
        { name: 'Emoji controls', selector: '#emoji-width, #emoji-threshold', expected: 2 },
        { name: 'ASCII controls', selector: '#ascii-text, #ascii-font', expected: 2 }
    ];
    
    let allPassed = true;
    
    tests.forEach(test => {
        const elements = document.querySelectorAll(test.selector);
        const found = elements.length;
        const passed = found >= test.expected;
        
        console.log(`${passed ? '✅' : '❌'} ${test.name}: ${found}/${test.expected} found`);
        
        if (!passed) {
            allPassed = false;
            console.error(`Missing elements for: ${test.name}`);
        }
    });
    
    // Test functions exist
    const functions = ['showTab', 'generateBraille', 'generateEmoji', 'generateASCII', 'copyOutput', 'selectOutput', 'downloadOutput'];
    functions.forEach(func => {
        const exists = typeof window[func] === 'function';
        console.log(`${exists ? '✅' : '❌'} Function ${func}: ${exists ? 'exists' : 'missing'}`);
        if (!exists) allPassed = false;
    });
    
    console.log(`🎯 Comprehensive test ${allPassed ? 'PASSED' : 'FAILED'}`);
    
    if (allPassed) {
        console.log('🚀 All systems ready for deployment!');
    } else {
        console.warn('⚠️ Some issues detected - check console for details');
    }
}

console.log('📝 BraillePixel script loaded');
