// Enhanced, bulletproof braille generation function
function generateBrailleRobust() {
    console.log('🚀 Starting robust braille generation...');
    
    // Get elements with error checking
    const fileInput = document.getElementById('braille-file');
    const output = document.getElementById('output');
    
    if (!fileInput) {
        console.error('❌ File input not found');
        return;
    }
    
    if (!output) {
        console.error('❌ Output element not found');
        return;
    }
    
    if (!fileInput.files[0]) {
        const message = '❌ Please select an image file first.';
        console.log(message);
        output.textContent = message;
        output.style.color = 'red';
        return;
    }
    
    // Get parameters
    const colsElement = document.getElementById('braille-cols');
    const rowsElement = document.getElementById('braille-rows');
    const thresholdElement = document.getElementById('braille-threshold');
    const invertElement = document.getElementById('braille-invert');
    
    const cols = colsElement ? colsElement.value : 40;
    const rows = rowsElement ? rowsElement.value : 20;
    const threshold = thresholdElement ? thresholdElement.value : 127;
    const invert = invertElement ? invertElement.checked : false;
    
    console.log('📊 Parameters:', { cols, rows, threshold, invert });
    
    // Update output with clear indication of processing
    output.textContent = '🔄 Processing image...\nPlease wait...';
    output.style.color = 'blue';
    output.style.fontWeight = 'bold';
    
    // Read the file
    const file = fileInput.files[0];
    console.log('📁 File Info:', { name: file.name, size: file.size, type: file.type });
    
    const reader = new FileReader();
    
    reader.onerror = function() {
        const message = '❌ Error reading file';
        console.error(message);
        output.textContent = message;
        output.style.color = 'red';
    };
    
    reader.onload = async function(e) {
        try {
            console.log('📖 File read successfully');
            const imageData = e.target.result;
            console.log('🖼️ Image data length:', imageData.length);
            
            // Clear any previous styling
            output.style.color = '';
            output.style.fontWeight = '';
            
            // Get API URL
            const hostname = window.location.hostname;
            const isProduction = hostname.includes('netlify.app') || hostname.includes('netlify.com');
            const apiUrl = isProduction ? '/.netlify/functions/braille' : '/api/braille';
            
            console.log('🌐 Making request to:', apiUrl);
            console.log('🌐 Production mode:', isProduction);
            
            // Prepare request data
            const requestData = {
                image: imageData,
                cols: parseInt(cols),
                rows: parseInt(rows), 
                threshold: parseInt(threshold),
                invert: invert
            };
            
            // Make the request with detailed error handling
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('📥 Response status:', response.status);
            console.log('📥 Response headers:', [...response.headers.entries()]);
            
            // Get response text first
            const responseText = await response.text();
            console.log('📥 Raw response length:', responseText.length);
            console.log('📥 Raw response preview:', responseText.substring(0, 200));
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${responseText}`);
            }
            
            // Parse JSON
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('✅ JSON parsed successfully');
            } catch (parseError) {
                console.error('❌ JSON parse error:', parseError);
                throw new Error(`Invalid JSON response: ${parseError.message}\nResponse: ${responseText.substring(0, 500)}`);
            }
            
            // Handle response
            if (data.error) {
                console.error('❌ API returned error:', data.error);
                output.textContent = `❌ Error: ${data.error}`;
                output.style.color = 'red';
                if (data.stack) {
                    console.error('Stack trace:', data.stack);
                }
            } else if (data.result) {
                console.log('✅ Success! Result length:', data.result.length);
                
                // Set the result with success styling
                output.textContent = data.result;
                output.style.color = 'green';
                output.style.fontFamily = 'monospace';
                output.style.fontSize = '12px';
                output.style.lineHeight = '1.2';
                
                // Log debug info if available
                if (data.debug) {
                    console.log('🔍 Debug info:', data.debug);
                }
                
                // Scroll output into view
                output.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
            } else {
                console.error('❌ No result in response:', data);
                output.textContent = `❌ No result returned from server\nResponse: ${JSON.stringify(data)}`;
                output.style.color = 'red';
            }
            
        } catch (error) {
            console.error('❌ Error during processing:', error);
            output.textContent = `❌ Error: ${error.message}`;
            output.style.color = 'red';
            output.style.fontWeight = 'normal';
        }
    };
    
    // Start reading the file
    reader.readAsDataURL(file);
}

// Override the original function when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Replace the original generateBraille function
    if (typeof window.generateBraille === 'function') {
        window.generateBrailleOriginal = window.generateBraille;
    }
    window.generateBraille = generateBrailleRobust;
    
    console.log('🔧 Robust braille function installed');
    
    // Add a test button for debugging
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 Test Robust Function';
    testButton.style.position = 'fixed';
    testButton.style.top = '60px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '8px 12px';
    testButton.style.backgroundColor = '#28a745';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.fontSize = '12px';
    testButton.onclick = generateBrailleRobust;
    document.body.appendChild(testButton);
});
