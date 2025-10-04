/**
 * Modern Enhancements for BraillePixel
 * Advanced UI interactions and animations
 */

console.log('🎨 Loading modern enhancements...');

// Enhanced tab switching with smooth animations
function showTab(tabName) {
    console.log('🔄 Enhanced tab switching to:', tabName);
    
    // Hide all tabs with fade out
    const allTabs = document.querySelectorAll('.content-panel');
    const allButtons = document.querySelectorAll('.nav-tab');
    
    // Remove active class from all tabs and buttons
    allTabs.forEach(tab => {
        if (tab.classList.contains('active')) {
            tab.style.opacity = '0';
            setTimeout(() => {
                tab.classList.remove('active');
            }, 150);
        }
    });
    
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab with fade in
    setTimeout(() => {
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
            selectedTab.style.opacity = '0';
            requestAnimationFrame(() => {
                selectedTab.style.opacity = '1';
            });
        }
        
        // Update button state
        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }, 150);
}

// Enhanced file upload with better visual feedback
function enhanceFileUploads() {
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        const fileInput = zone.querySelector('.file-input');
        const uploadContent = zone.querySelector('.upload-content');
        
        if (!fileInput || !uploadContent) return;
        
        // Drag and drop handlers
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
            zone.style.transform = 'scale(1.02)';
        });
        
        zone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            zone.style.transform = 'scale(1)';
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            zone.style.transform = 'scale(1)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                handleFileSelection(fileInput, zone);
            }
        });
        
        // File selection handler
        fileInput.addEventListener('change', () => {
            handleFileSelection(fileInput, zone);
        });
        
        // Click handler for zone
        zone.addEventListener('click', (e) => {
            if (e.target !== fileInput) {
                e.preventDefault();
                fileInput.click();
            }
        });
    });
}

function handleFileSelection(fileInput, zone) {
    const file = fileInput.files[0];
    const uploadContent = zone.querySelector('.upload-content');
    
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showFileError(zone, 'Please select a valid image file');
            return;
        }
        
        // Show success state
        zone.classList.add('success');
        zone.classList.remove('error');
        
        uploadContent.innerHTML = `
            <div class="upload-icon">✅</div>
            <p class="upload-text">File selected successfully!</p>
            <p class="upload-hint"><strong>${file.name}</strong> (${formatFileSize(file.size)})</p>
        `;
        
        console.log('📁 File selected:', file.name, formatFileSize(file.size));
    }
}

function showFileError(zone, message) {
    zone.classList.add('error');
    zone.classList.remove('success');
    
    const uploadContent = zone.querySelector('.upload-content');
    uploadContent.innerHTML = `
        <div class="upload-icon">❌</div>
        <p class="upload-text">Error</p>
        <p class="upload-hint">${message}</p>
    `;
    
    // Reset after 3 seconds
    setTimeout(() => {
        zone.classList.remove('error');
        resetUploadZone(zone);
    }, 3000);
}

function resetUploadZone(zone) {
    const uploadContent = zone.querySelector('.upload-content');
    const isEmojiUpload = zone.id === 'emoji-upload';
    
    uploadContent.innerHTML = `
        <div class="upload-icon">${isEmojiUpload ? '🖼️' : '📸'}</div>
        <p class="upload-text">${isEmojiUpload ? 'Select image for emoji conversion' : 'Click to select or drag & drop image'}</p>
        <p class="upload-hint">${isEmojiUpload ? 'Best results with high contrast images' : 'Supports PNG, JPG, GIF, WebP'}</p>
    `;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Enhanced range sliders with better visual feedback
function enhanceRangeSliders() {
    const sliders = document.querySelectorAll('.range-input');
    
    sliders.forEach(slider => {
        const valueDisplay = document.getElementById(slider.id + '-val');
        
        if (valueDisplay) {
            // Update value display
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
                updateSliderProgress(slider);
            });
            
            // Initialize progress
            updateSliderProgress(slider);
        }
    });
}

function updateSliderProgress(slider) {
    const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--primary-500) ${percent}%, var(--gray-200) ${percent}%)`;
}

// Enhanced radio and checkbox interactions
function enhanceFormControls() {
    // Radio buttons
    const radioInputs = document.querySelectorAll('.radio-input');
    radioInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            // Add animation to selected option
            const label = radio.closest('.radio-option');
            if (label) {
                label.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    label.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Checkboxes
    const checkboxInputs = document.querySelectorAll('.checkbox-input');
    checkboxInputs.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const label = checkbox.closest('.checkbox-label');
            if (label) {
                label.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    label.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
}

// Enhanced emoji mode switching with animations
function handleEmojiModeChange() {
    const selectedMode = document.querySelector('input[name="emoji-mode"]:checked');
    const imageInput = document.getElementById('emoji-image-input');
    const textInput = document.getElementById('emoji-text-input');
    
    if (!selectedMode || !imageInput || !textInput) {
        console.warn('Emoji mode elements not found');
        return;
    }
    
    console.log('🔄 Enhanced emoji mode change to:', selectedMode.value);
    
    // Smooth transition
    if (selectedMode.value === 'text') {
        imageInput.style.opacity = '0';
        setTimeout(() => {
            imageInput.style.display = 'none';
            textInput.style.display = 'block';
            textInput.style.opacity = '0';
            requestAnimationFrame(() => {
                textInput.style.opacity = '1';
            });
        }, 150);
    } else {
        textInput.style.opacity = '0';
        setTimeout(() => {
            textInput.style.display = 'none';
            imageInput.style.display = 'block';
            imageInput.style.opacity = '0';
            requestAnimationFrame(() => {
                imageInput.style.opacity = '1';
            });
        }, 150);
    }
}

// Enhanced emoji render mode switching
function handleEmojiRenderModeChange() {
    const selectedMode = document.querySelector('input[name="emoji-render-mode"]:checked');
    const gradientControls = document.getElementById('gradient-controls');
    const binaryControls = document.getElementById('binary-controls');
    
    if (!selectedMode || !gradientControls || !binaryControls) {
        console.warn('Emoji render mode elements not found');
        return;
    }
    
    console.log('🎨 Enhanced emoji render mode change to:', selectedMode.value);
    
    if (selectedMode.value === 'binary') {
        gradientControls.style.opacity = '0';
        setTimeout(() => {
            gradientControls.style.display = 'none';
            binaryControls.style.display = 'block';
            binaryControls.style.opacity = '0';
            requestAnimationFrame(() => {
                binaryControls.style.opacity = '1';
            });
        }, 150);
    } else {
        binaryControls.style.opacity = '0';
        setTimeout(() => {
            binaryControls.style.display = 'none';
            gradientControls.style.display = 'block';
            gradientControls.style.opacity = '0';
            requestAnimationFrame(() => {
                gradientControls.style.opacity = '1';
            });
        }, 150);
    }
}

// Enhanced button interactions
function enhanceButtons() {
    const buttons = document.querySelectorAll('.generate-button, .action-button');
    
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add loading state
        const originalGenerateFunctions = {
            'generateBraille': window.generateBraille,
            'generateEmoji': window.generateEmoji,
            'generateASCII': window.generateASCII
        };
        
        // Override generate functions to add loading states
        Object.keys(originalGenerateFunctions).forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                window[funcName] = function(...args) {
                    const generateButton = document.querySelector('.generate-button');
                    if (generateButton) {
                        generateButton.classList.add('loading');
                        generateButton.style.pointerEvents = 'none';
                        
                        setTimeout(() => {
                            generateButton.classList.remove('loading');
                            generateButton.style.pointerEvents = 'auto';
                        }, 1000);
                    }
                    
                    return originalGenerateFunctions[funcName].apply(this, args);
                };
            }
        });
    });
}

// Add CSS for ripple effect
function addRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .generate-button, .action-button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .generate-button.loading {
            position: relative;
        }
        
        .generate-button.loading::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .generate-button.loading .button-icon,
        .generate-button.loading .button-text {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
}

// Enhanced emoji set selector
function enhanceEmojiSetSelector() {
    const emojiSetSelect = document.getElementById('emoji-set');
    const customEmojiInput = document.getElementById('custom-emoji-input');
    
    if (emojiSetSelect && customEmojiInput) {
        emojiSetSelect.addEventListener('change', () => {
            if (emojiSetSelect.value === 'custom') {
                customEmojiInput.style.display = 'block';
                customEmojiInput.style.opacity = '0';
                requestAnimationFrame(() => {
                    customEmojiInput.style.opacity = '1';
                });
            } else {
                customEmojiInput.style.opacity = '0';
                setTimeout(() => {
                    customEmojiInput.style.display = 'none';
                }, 150);
            }
        });
    }
}

// Enhanced copy functionality with better feedback
function enhanceCopyFunction() {
    window.copyOutput = function() {
        const output = document.getElementById('output');
        const text = output.textContent;
        const copyButton = document.querySelector('.action-button.copy');
        
        navigator.clipboard.writeText(text).then(() => {
            console.log('✅ Text copied to clipboard');
            
            // Show success feedback
            if (copyButton) {
                const originalText = copyButton.querySelector('.button-text')?.textContent || 'Copy';
                const textElement = copyButton.querySelector('.button-text');
                const iconElement = copyButton.querySelector('.button-icon');
                
                if (textElement) textElement.textContent = 'Copied!';
                if (iconElement) iconElement.textContent = '✅';
                
                copyButton.style.transform = 'scale(1.05)';
                
                setTimeout(() => {
                    if (textElement) textElement.textContent = originalText;
                    if (iconElement) iconElement.textContent = '📋';
                    copyButton.style.transform = 'scale(1)';
                }, 2000);
            }
            
            // Show toast notification
            showToast('Text copied to clipboard!', 'success');
        }).catch(err => {
            console.error('❌ Copy failed:', err);
            showToast('Copy failed. Please select the text manually.', 'error');
        });
    };
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .toast-success {
            background: var(--success-500);
        }
        
        .toast-error {
            background: var(--error-500);
        }
        
        .toast-info {
            background: var(--primary-500);
        }
        
        .toast.show {
            transform: translateX(0);
        }
    `;
    
    if (!document.querySelector('#toast-styles')) {
        style.id = 'toast-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const activePanel = document.querySelector('.content-panel.active');
            if (activePanel) {
                const generateButton = activePanel.querySelector('.generate-button');
                if (generateButton) {
                    generateButton.click();
                }
            }
        }
        
        // Ctrl/Cmd + C when output is focused to copy
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement.id === 'output') {
            e.preventDefault();
            window.copyOutput();
        }
        
        // Tab navigation (1, 2, 3)
        if (e.key >= '1' && e.key <= '3' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const target = e.target;
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'SELECT') {
                e.preventDefault();
                const tabNames = ['braille', 'emoji', 'ascii'];
                const tabIndex = parseInt(e.key) - 1;
                if (tabNames[tabIndex]) {
                    showTab(tabNames[tabIndex]);
                }
            }
        }
    });
}

// Initialize all enhancements
function initializeModernEnhancements() {
    console.log('🚀 Initializing modern enhancements...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeModernEnhancements);
        return;
    }
    
    try {
        addRippleStyles();
        enhanceFileUploads();
        enhanceRangeSliders();
        enhanceFormControls();
        enhanceButtons();
        enhanceEmojiSetSelector();
        enhanceCopyFunction();
        addKeyboardShortcuts();
        
        // Override the mode change functions
        const emojiModeRadios = document.querySelectorAll('input[name="emoji-mode"]');
        emojiModeRadios.forEach(radio => {
            radio.addEventListener('change', handleEmojiModeChange);
        });
        
        const emojiRenderModeRadios = document.querySelectorAll('input[name="emoji-render-mode"]');
        emojiRenderModeRadios.forEach(radio => {
            radio.addEventListener('change', handleEmojiRenderModeChange);
        });
        
        // Initialize state
        handleEmojiModeChange();
        handleEmojiRenderModeChange();
        
        console.log('✅ Modern enhancements loaded successfully!');
        
        // Show welcome message
        setTimeout(() => {
            showToast('Welcome to BraillePixel! Press Ctrl+Enter to generate art.', 'info');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error initializing modern enhancements:', error);
    }
}

// Auto-initialize
initializeModernEnhancements();

console.log('🎨 Modern enhancements script loaded');
