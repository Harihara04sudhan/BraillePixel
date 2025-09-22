// Enhanced debugging version of the web interface
// This version adds more logging to help identify issues

// Enhanced API endpoint configuration with debugging
function getApiEndpoint(endpoint) {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    const isProduction = hostname.includes('netlify.app') || hostname.includes('netlify.com');
    
    console.log('🔍 API Debug Info:');
    console.log('  - Hostname:', hostname);
    console.log('  - Protocol:', protocol);
    console.log('  - Port:', port);
    console.log('  - Production:', isProduction);
    
    let apiUrl;
    if (isProduction) {
        apiUrl = `/.netlify/functions/${endpoint}`;
    } else {
        apiUrl = `/api/${endpoint}`;
    }
    
    console.log('  - API URL:', apiUrl);
    return apiUrl;
}

// Enhanced Braille Art Generation with detailed logging
async function generateBrailleWithLogging() {
    console.log('🎯 Starting Braille Generation...');
    
    const fileInput = document.getElementById('braille-file');
    const output = document.getElementById('output');
    
    if (!fileInput.files[0]) {
        const message = 'Please select an image file first.';
        console.log('❌ Error:', message);
        output.textContent = message;
        return;
    }
    
    const cols = document.getElementById('braille-cols').value;
    const rows = document.getElementById('braille-rows').value;
    const threshold = document.getElementById('braille-threshold').value;
    const invert = document.getElementById('braille-invert').checked;
    
    console.log('📊 Parameters:');
    console.log('  - Columns:', cols);
    console.log('  - Rows:', rows);
    console.log('  - Threshold:', threshold);
    console.log('  - Invert:', invert);
    
    output.textContent = 'Processing image...';
    
    const file = fileInput.files[0];
    console.log('📁 File Info:');
    console.log('  - Name:', file.name);
    console.log('  - Size:', file.size, 'bytes');
    console.log('  - Type:', file.type);
    
    const reader = new FileReader();
    
    reader.onload = async function(e) {
        const imageData = e.target.result;
        console.log('🖼️ Image Data Length:', imageData.length);
        console.log('🖼️ Image Data Preview:', imageData.substring(0, 50) + '...');
        
        const requestData = {
            image: imageData,
            cols: parseInt(cols),
            rows: parseInt(rows),
            threshold: parseInt(threshold),
            invert: invert
        };
        
        console.log('📤 Request Data:', {
            ...requestData,
            image: `${imageData.substring(0, 30)}...` // Truncate for logging
        });
        
        const apiUrl = getApiEndpoint('braille');
        console.log('🌐 Making request to:', apiUrl);
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('📥 Response Status:', response.status);
            console.log('📥 Response Headers:', [...response.headers.entries()]);
            
            const responseText = await response.text();
            console.log('📥 Raw Response:', responseText.substring(0, 200) + '...');
            
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('✅ Parsed JSON successfully');
            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError);
                console.error('❌ Response was:', responseText);
                output.textContent = 'Error: Server returned invalid JSON. Response: ' + responseText.substring(0, 200);
                return;
            }
            
            if (data.error) {
                console.error('❌ API Error:', data.error);
                output.textContent = 'Error: ' + data.error;
            } else {
                console.log('✅ Success! Result length:', data.result ? data.result.length : 0);
                output.textContent = data.result;
            }
            
        } catch (error) {
            console.error('❌ Network Error:', error);
            output.textContent = 'Network Error: ' + error.message;
        }
    };
    
    reader.readAsDataURL(file);
}

// Test function to check API availability
async function testAPIEndpoints() {
    console.log('🧪 Testing API Endpoints...');
    
    const endpoints = ['braille', 'emoji', 'ascii'];
    
    for (const endpoint of endpoints) {
        const url = getApiEndpoint(endpoint);
        console.log(`\n🔍 Testing ${endpoint} at ${url}`);
        
        try {
            const response = await fetch(url, {
                method: 'OPTIONS'
            });
            
            console.log(`  ✅ ${endpoint} OPTIONS: ${response.status}`);
            
        } catch (error) {
            console.log(`  ❌ ${endpoint} Error:`, error.message);
        }
    }
}

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Enhanced Debug Script Loaded!');
    console.log('🌍 Location:', window.location.href);
    
    // Test API endpoints after a short delay
    setTimeout(() => {
        testAPIEndpoints();
    }, 1000);
    
    // Add debug button to page
    const debugButton = document.createElement('button');
    debugButton.textContent = '🐛 Debug Braille';
    debugButton.style.position = 'fixed';
    debugButton.style.top = '10px';
    debugButton.style.right = '10px';
    debugButton.style.zIndex = '9999';
    debugButton.style.padding = '10px';
    debugButton.style.backgroundColor = '#ff6b6b';
    debugButton.style.color = 'white';
    debugButton.style.border = 'none';
    debugButton.style.borderRadius = '5px';
    debugButton.onclick = generateBrailleWithLogging;
    document.body.appendChild(debugButton);
});
