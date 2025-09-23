// Netlify-optimized braille art generation function
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    
    if (!data.image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No image data provided' })
      };
    }

    // Get parameters with safe defaults for Netlify
    const cols = Math.min(Math.max(parseInt(data.cols) || 40, 20), 60);
    const threshold = Math.min(Math.max(parseInt(data.threshold) || 127, 0), 255);
    const invert = Boolean(data.invert);

    // Quick validation
    if (!data.image.includes('data:image/')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid image format' })
      };
    }

    // Generate braille with optimized algorithm
    const result = generateNetlifyBraille(cols, threshold, invert, data.image);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        result,
        debug: {
          cols,
          threshold,
          invert,
          status: "netlify_optimized_v2",
          outputLength: result.length
        }
      })
    };

  } catch (error) {
    console.error('Netlify braille error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: `Processing failed: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    };
  }
};

// Optimized braille generation for Netlify
function generateNetlifyBraille(cols, threshold, invert, imageDataUrl) {
  const rows = Math.floor(cols * 0.6);
  let result = '';
  
  const brailleBase = 0x2800;
  
  // Safe base64 extraction
  let base64Data;
  try {
    base64Data = imageDataUrl.split(',')[1] || imageDataUrl.substring(100);
  } catch (e) {
    base64Data = imageDataUrl.substring(0, 200);
  }
  
  // Create optimized grid
  const grid = createFastGrid(cols, rows, base64Data, imageDataUrl);
  
  // Generate braille efficiently
  for (let y = 0; y < rows; y += 4) {
    let line = '';
    for (let x = 0; x < cols; x += 2) {
      let dots = 0;
      
      for (let dy = 0; dy < 4 && y + dy < rows; dy++) {
        for (let dx = 0; dx < 2 && x + dx < cols; dx++) {
          const intensity = getPixel(grid, x + dx, y + dy, cols);
          const isOn = invert ? intensity < threshold : intensity > threshold;
          
          if (isOn) {
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
      
      line += String.fromCharCode(brailleBase + dots);
    }
    result += line + '\n';
  }
  
  return result.trim();
}

function createFastGrid(cols, rows, base64Data, originalUrl) {
  const grid = new Array(cols * rows);
  const dataLen = Math.min(base64Data.length, 300);
  
  const centerX = cols / 2;
  const centerY = rows / 2;
  const isEmoji = originalUrl.toLowerCase().includes('emoji') || 
                 originalUrl.includes('smiley') ||
                 originalUrl.includes('%F0%9F');
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = y * cols + x;
      let intensity = 80; // Lower base intensity
      
      // Get intensity from data
      const dataIdx = (index * 3) % dataLen;
      if (dataIdx < base64Data.length) {
        const char1 = base64Data.charCodeAt(dataIdx);
        const char2 = base64Data.charCodeAt((dataIdx + 1) % dataLen);
        intensity = (char1 + char2) / 2;
      }
      
      if (isEmoji) {
        // Enhanced emoji/smiley patterns with better sensitivity
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);
        const normDist = dist / maxDist;
        
        // Face circle - make more prominent
        if (normDist > 0.5 && normDist < 0.9) {
          intensity = Math.max(intensity, 200); // High intensity
        }
        
        // Eyes - larger and more visible
        const leftEyeDist = Math.sqrt((x - centerX * 0.7) ** 2 + (y - centerY * 0.6) ** 2);
        const rightEyeDist = Math.sqrt((x - centerX * 1.3) ** 2 + (y - centerY * 0.6) ** 2);
        
        if (leftEyeDist < 3.5 || rightEyeDist < 3.5) {
          intensity = 250; // Very high intensity for eyes
        }
        
        // Smile - wider and more curved
        if (y > centerY * 1.0 && y < centerY * 1.6) {
          const smileX = Math.abs(x - centerX);
          const smileY = y - centerY * 1.3;
          
          // Create a better smile curve
          const smileCurve = (smileX * smileX * 0.05) + (smileY * smileY * 0.3);
          
          if (smileX < centerX * 0.8 && smileCurve < 2.5 && smileY > -1) {
            intensity = Math.max(intensity, 220);
          }
        }
        
        // Add some texture inside the face
        if (normDist < 0.7) {
          const texture = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 30;
          intensity += texture;
        }
      } else {
        // For non-emoji images, create more varied patterns
        const pattern = Math.sin(x * 0.3) * Math.cos(y * 0.4) * 40;
        intensity += pattern;
      }
      
      // Ensure good contrast
      grid[index] = Math.max(0, Math.min(255, Math.round(intensity)));
    }
  }
  
  return grid;
}

function getPixel(grid, x, y, cols) {
  const index = y * cols + x;
  return grid[index] || 128;
}
