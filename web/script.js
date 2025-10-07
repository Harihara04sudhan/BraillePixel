// API endpoint configuration
function getApiEndpoint(endpoint) {
    // For local development, we now have fallback routes that work with both paths
    // So we can always use the /api/ paths, but keep Netlify detection for production
    const hostname = window.location.hostname;
    const isProduction = hostname.includes('netlify.app') || hostname.includes('netlify.com');
    
    console.log('API Configuration - Hostname:', hostname, 'Production:', isProduction);
    
    let apiUrl;
    if (isProduction) {
        // Production - use Netlify functions
        apiUrl = `/.netlify/functions/${endpoint}`;
    } else {
        // Local development - use Flask routes (fallback routes handle both paths)
        apiUrl = `/api/${endpoint}`;
    }
    
    console.log('Selected API URL:', apiUrl);
    return apiUrl;
}

// Tab functionality - simplified and robust
function showTab(tabName) {
    console.log('showTab called with:', tabName);
    
    try {
        // Hide all tab contents
        const contents = document.querySelectorAll('.tab-content');
        console.log('Found tab contents:', contents.length);
        contents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all buttons
        const buttons = document.querySelectorAll('.tab-btn');
        console.log('Found tab buttons:', buttons.length);
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
            console.log('Activated tab:', tabName);
        } else {
            console.error('Tab not found:', tabName);
        }
        
        // Find and activate the clicked button
        const clickedButton = event ? event.target : document.querySelector(`[onclick*="'${tabName}'"]`);
        if (clickedButton) {
            clickedButton.classList.add('active');
            console.log('Activated button');
        } else {
            console.error('Button not found for tab:', tabName);
        }
        
    } catch (error) {
        console.error('Error in showTab:', error);
    }
}

// DOM Content Loaded - Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing BraillePixel...');
    
    // Update range slider displays
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
    
    // Handle emoji render mode switching (gradient vs binary)
    const renderModeInputs = document.querySelectorAll('input[name="emoji-render-mode"]');
    renderModeInputs.forEach(input => {
        input.addEventListener('change', function() {
            const gradientControls = document.getElementById('gradient-controls');
            const binaryControls = document.getElementById('binary-controls');
            
            if (this.value === 'gradient') {
                gradientControls.style.display = 'block';
                binaryControls.style.display = 'none';
            } else {
                gradientControls.style.display = 'none';
                binaryControls.style.display = 'block';
            }
        });
    });
    
    // Handle emoji set selection
    const emojiSetSelect = document.getElementById('emoji-set');
    const customEmojiInput = document.getElementById('custom-emoji-input');
    
    if (emojiSetSelect && customEmojiInput) {
        emojiSetSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customEmojiInput.style.display = 'block';
            } else {
                customEmojiInput.style.display = 'none';
            }
        });
        
        // Initialize custom emoji input visibility
        if (emojiSetSelect.value === 'custom') {
            customEmojiInput.style.display = 'block';
        } else {
            customEmojiInput.style.display = 'none';
        }
    }
    
    // File upload handling
    initializeFileUploads();
    
    console.log('BraillePixel initialization complete!');
});

// Separate function for file upload initialization
function initializeFileUploads() {
    console.log('Initializing file uploads...');
    
    const fileInputs = document.querySelectorAll('input[type="file"]');
    console.log(`Found ${fileInputs.length} file inputs`);
    
    fileInputs.forEach((input, index) => {
        console.log(`Setting up file input ${index}: ${input.id}`);
        
        const uploadArea = input.closest('.upload-area');
        if (!uploadArea) {
            console.error(`No upload area found for input ${input.id}`);
            return;
        }
        
        // Make the upload area clickable
        uploadArea.addEventListener('click', (e) => {
            console.log('Upload area clicked for:', input.id);
            e.preventDefault();
            e.stopPropagation();
            input.click();
        });
        
        // File input change handler
        input.addEventListener('change', (e) => {
            console.log('File selected for:', input.id);
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                const paragraph = uploadArea.querySelector('p');
                if (paragraph) {
                    paragraph.innerHTML = `✅ Selected: <strong>${fileName}</strong>`;
                    uploadArea.style.borderColor = '#48bb78';
                    uploadArea.style.backgroundColor = 'rgba(72, 187, 120, 0.1)';
                }
                console.log('File processed:', fileName);
            }
        });
        
        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
                uploadArea.style.borderColor = '#667eea';
                uploadArea.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
                uploadArea.style.borderColor = '#cbd5e0';
                uploadArea.style.backgroundColor = '';
            });
        });
        
        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                const fileName = files[0].name;
                const paragraph = uploadArea.querySelector('p');
                if (paragraph) {
                    paragraph.innerHTML = `✅ Selected: <strong>${fileName}</strong>`;
                    uploadArea.style.borderColor = '#48bb78';
                    uploadArea.style.backgroundColor = 'rgba(72, 187, 120, 0.1)';
                }
            }
        });
    });
}

// Braille Art Generation (Real API calls)
function generateBraille() {
    console.log('🎯 generateBraille called');
    
    try {
        const fileInput = document.getElementById('braille-file');
        const output = document.getElementById('output');
        
        console.log('File input:', fileInput);
        console.log('Output element:', output);
        
        if (!fileInput) {
            console.error('File input not found');
            return;
        }
        
        if (!output) {
            console.error('Output element not found');
            return;
        }
        
        if (!fileInput.files[0]) {
            const message = 'Please select an image file first.';
            console.log('No file selected');
            output.textContent = message;
            return;
        }
        
        const cols = document.getElementById('braille-cols').value;
        const rows = document.getElementById('braille-rows').value;
        const threshold = document.getElementById('braille-threshold').value;
        const invert = document.getElementById('braille-invert').checked;
        
        console.log('Parameters:', { cols, rows, threshold, invert });
        
        output.textContent = 'Processing image...';
        
        // Read the file and convert to base64
        const file = fileInput.files[0];
        console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = e.target.result;
            console.log('Image data loaded, length:', imageData.length);
            
            const apiUrl = getApiEndpoint('braille');
            console.log('Making request to:', apiUrl);
            
            // Call the backend API
            fetch(apiUrl, {
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
            .then(response => {
                console.log('Braille API Response Status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Braille API Response Data:', data);
                if (data.error) {
                    console.error('API Error:', data.error);
                    // Fallback to demo pattern
                    output.textContent = 'API Error - Showing demo pattern:\n\n' + generateDemoBrailleArt(parseInt(cols), parseInt(rows));
                    if (data.stack) {
                        console.error('Server Stack:', data.stack);
                    }
                } else {
                    output.textContent = data.result;
                    if (data.debug) {
                        console.log('Debug Info:', data.debug);
                    }
                }
            })
            .catch(error => {
                console.error('Braille Generation Error:', error);
                // Show demo pattern as fallback
                const demoPattern = generateDemoBrailleArt(parseInt(cols), parseInt(rows));
                output.textContent = `Connection Error - Showing demo pattern:

${demoPattern}

Original Error: ${error.message}

💡 Try refreshing the page or check your internet connection.`;
            });
        };
        
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error('Error in generateBraille:', error);
        const output = document.getElementById('output');
        if (output) {
            output.textContent = 'Error: ' + error.message;
        }
    }
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
    const renderMode = document.querySelector('input[name="emoji-render-mode"]:checked').value;
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
            const width = document.getElementById('emoji-width').value;
            
            let requestData = {
                mode: 'image',
                image: imageData,
                width: parseInt(width),
                binary_mode: renderMode === 'binary'
            };
            
            if (renderMode === 'binary') {
                // Binary mode parameters
                requestData.on_emoji = document.getElementById('on-emoji').value || '🔥';
                requestData.off_emoji = document.getElementById('off-emoji').value || '⚪';
                requestData.threshold = parseInt(document.getElementById('emoji-threshold').value);
            } else {
                // Gradient mode parameters
                const emojiSet = document.getElementById('emoji-set').value;
                const customEmoji = document.getElementById('custom-emoji').value;
                requestData.emoji_set = emojiSet;
                requestData.custom_emojis = customEmoji;
            }
            
            output.textContent = 'Generating emoji art...';
            
            fetch(getApiEndpoint('emoji'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
            .then(response => {
                console.log('Emoji API Response Status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Emoji API Response Data:', data);
                if (data.error) {
                    console.error('API Error:', data.error);
                    // Fallback to demo pattern
                    const demoPattern = generateDemoEmojiArt(
                        requestData.emoji_set || 'geometric', 
                        requestData.custom_emojis || '', 
                        requestData.width
                    );
                    output.textContent = 'API Error - Showing demo pattern:\n\n' + demoPattern;
                } else {
                    output.textContent = data.result;
                }
            })
            .catch(error => {
                console.error('Emoji Generation Error:', error);
                // Show demo pattern as fallback
                const demoPattern = generateDemoEmojiArt(
                    requestData.emoji_set || 'geometric', 
                    requestData.custom_emojis || '', 
                    requestData.width
                );
                output.textContent = `Connection Error - Showing demo pattern:

${demoPattern}

Original Error: ${error.message}

💡 Try refreshing the page or check your internet connection.`;
            });
        };
        
        reader.readAsDataURL(file);
        
    } else {
        // Text mode (always uses binary mode for clarity)
        const text = document.getElementById('emoji-text').value;
        const width = document.getElementById('emoji-width').value;
        
        if (!text) {
            output.textContent = 'Please enter text to convert.';
            return;
        }
        
        let onEmoji, offEmoji;
        if (renderMode === 'binary') {
            onEmoji = document.getElementById('on-emoji').value || '🔥';
            offEmoji = document.getElementById('off-emoji').value || '⚪';
        } else {
            // Use first custom emoji or default for text mode
            const customEmoji = document.getElementById('custom-emoji').value;
            onEmoji = customEmoji ? customEmoji.split(',')[0].trim() : '🔥';
            offEmoji = '⚪';  // Always use contrasting background for text clarity
        }
        
        const threshold = document.getElementById('emoji-threshold') ? 
                         parseInt(document.getElementById('emoji-threshold').value) : 128;
        
        output.textContent = 'Generating emoji art...';
        
        fetch(getApiEndpoint('emoji'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mode: 'text',
                text: text,
                on_emoji: onEmoji,
                off_emoji: offEmoji,
                width: parseInt(width),
                threshold: threshold
            })
        })
        .then(response => {
            console.log('Emoji Text API Response Status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Emoji Text API Response Data:', data);
            if (data.error) {
                console.error('API Error:', data.error);
                // Fallback to demo pattern
                const demoPattern = generateDemoEmojiText(text, onEmoji, parseInt(width));
                output.textContent = 'API Error - Showing demo pattern:\n\n' + demoPattern;
            } else {
                output.textContent = data.result;
            }
        })
        .catch(error => {
            console.error('Emoji Text Generation Error:', error);
            // Show demo pattern as fallback
            const demoPattern = generateDemoEmojiText(text, onEmoji, parseInt(width));
            output.textContent = `Connection Error - Showing demo pattern:

${demoPattern}

Original Error: ${error.message}

💡 Try refreshing the page or check your internet connection.`;
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
    
    fetch(getApiEndpoint('ascii'), {
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
    .then(response => {
        console.log('ASCII API Response Status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('ASCII API Response Data:', data);
        if (data.error) {
            console.error('API Error:', data.error);
            // Fallback to demo pattern
            const demoPattern = generateDemoASCIIArt(text, font, spacing, border, gradient);
            output.textContent = 'API Error - Showing demo pattern:\n\n' + demoPattern;
        } else {
            output.textContent = data.result;
        }
    })
    .catch(error => {
        console.error('ASCII Generation Error:', error);
        // Show demo pattern as fallback
        const demoPattern = generateDemoASCIIArt(text, font, spacing, border, gradient);
        output.textContent = `Connection Error - Showing demo pattern:

${demoPattern}

Original Error: ${error.message}

💡 Try refreshing the page or check your internet connection.`;
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
    const upperText = text.toUpperCase();
    let result = [];
    
    // Generate each row
    for (let row = 0; row < 5; row++) {
        let line = '';
        for (let i = 0; i < upperText.length; i++) {
            const char = upperText[i];
            const pattern = selectedFont[char] || selectedFont[' '];
            line += pattern[row];
            
            // Add spacing between characters
            if (spacing > 0 && i < upperText.length - 1) {
                line += ' '.repeat(spacing);
            }
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
    
    // Apply gradient effect (simple version)
    if (gradient) {
        const gradientChars = ['░', '▒', '▓', '█'];
        finalResult = finalResult.replace(/█/g, () => {
            return gradientChars[Math.floor(Math.random() * gradientChars.length)];
        });
    }
    
    return finalResult;
}
    
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
    const text = output.textContent;
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess();
        }).catch(err => {
            console.error('Clipboard API failed:', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    // Create temporary textarea
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            showCopyError();
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showCopyError();
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.background = '#48bb78';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

function showCopyError() {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.textContent;
    btn.textContent = '❌ Copy Failed';
    btn.style.background = '#e53e3e';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
    
    // Also show browser-specific instructions
    alert('Copy failed. Try:\n- Right-click the output and select "Copy"\n- Or select all text manually (Ctrl+A) then copy (Ctrl+C)');
}

function selectOutput() {
    const output = document.getElementById('output');
    
    if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(output);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (document.selection) {
        const range = document.body.createTextRange();
        range.moveToElementText(output);
        range.select();
    }
}

function downloadOutput() {
    const output = document.getElementById('output');
    const text = output.textContent;
    
    if (!text || text.includes('Your generated art will appear here')) {
        alert('No art to download. Generate some art first!');
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'braillepixel-art.txt';
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show feedback
    const btn = document.querySelector('.download-btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Downloaded!';
    btn.style.background = '#48bb78';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

// Additional download function for compatibility
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

function selectOutput() {
    const output = document.getElementById('output');
    
    // Create a range and select the output content
    if (document.createRange && window.getSelection) {
        const range = document.createRange();
        range.selectNodeContents(output);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Show feedback
        const btn = document.querySelector('.select-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Selected';
        btn.style.background = '#805ad5';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
        
        // Scroll to output
        output.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    } else if (document.body.createTextRange) {
        // Fallback for older IE
        const range = document.body.createTextRange();
        range.moveToElementText(output);
        range.select();
    }
}
