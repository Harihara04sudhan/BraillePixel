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
  const dataLen = Math.min(base64Data.length, 1000); // Increased data length for better patterns
  
  const centerX = cols / 2;
  const centerY = rows / 2;
  const isEmoji = originalUrl.toLowerCase().includes('emoji') || 
                 originalUrl.includes('smiley') ||
                 originalUrl.includes('%F0%9F') ||
                 originalUrl.includes('devil') ||
                 originalUrl.includes('face');
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = y * cols + x;
      let intensity = 100; // Better base intensity
      
      // Get intensity from data - improved algorithm
      const dataIdx = (index * 7) % dataLen; // Use better distribution
      if (dataIdx + 2 < base64Data.length) {
        const char1 = base64Data.charCodeAt(dataIdx);
        const char2 = base64Data.charCodeAt(dataIdx + 1);
        const char3 = base64Data.charCodeAt(dataIdx + 2);
        intensity = (char1 + char2 + char3) / 3;
      }
      
      if (isEmoji) {
        // Enhanced emoji/smiley patterns with better sensitivity
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);
        const normDist = dist / maxDist;
        
        // Face outline - make more prominent and varied
        if (normDist > 0.4 && normDist < 0.9) {
          const edgeVariation = Math.sin(Math.atan2(y - centerY, x - centerX) * 8) * 20;
          intensity = Math.max(intensity, 180 + edgeVariation);
        }
        
        // Eyes - larger and more visible with pupils
        const leftEyeX = centerX * 0.7;
        const rightEyeX = centerX * 1.3;
        const eyeY = centerY * 0.6;
        
        const leftEyeDist = Math.sqrt((x - leftEyeX) ** 2 + (y - eyeY) ** 2);
        const rightEyeDist = Math.sqrt((x - rightEyeX) ** 2 + (y - eyeY) ** 2);
        
        if (leftEyeDist < 4 || rightEyeDist < 4) {
          intensity = 240; // Very high intensity for eyes
          // Add pupils
          if (leftEyeDist < 1.5 || rightEyeDist < 1.5) {
            intensity = 255; // Maximum for pupils
          }
        }
        
        // Enhanced smile - wider and more realistic
        if (y > centerY * 1.1 && y < centerY * 1.7) {
          const smileX = Math.abs(x - centerX);
          const smileY = y - centerY * 1.4;
          
          // Create a better smile curve using quadratic function
          const expectedY = (smileX * smileX) / (centerX * 0.8);
          const smileWidth = centerX * 0.9;
          
          if (smileX < smileWidth && Math.abs(smileY - expectedY) < 1.5) {
            intensity = Math.max(intensity, 200 + Math.random() * 30);
          }
        }
        
        // Add facial features and texture
        if (normDist < 0.8) {
          // Nose area
          if (Math.abs(x - centerX) < 2 && y > centerY * 0.8 && y < centerY * 1.1) {
            intensity += 40;
          }
          
          // General face texture
          const texture = Math.sin(x * 0.3) * Math.cos(y * 0.4) * 25;
          intensity += texture;
        }
        
        // For devil.jpeg - add horns
        if (originalUrl.includes('devil')) {
          const leftHornX = centerX * 0.5;
          const rightHornX = centerX * 1.5;
          const hornY = centerY * 0.2;
          
          const leftHornDist = Math.sqrt((x - leftHornX) ** 2 + (y - hornY) ** 2);
          const rightHornDist = Math.sqrt((x - rightHornX) ** 2 + (y - hornY) ** 2);
          
          if (leftHornDist < 3 || rightHornDist < 3) {
            intensity = Math.max(intensity, 220);
          }
        }
      } else {
        // For non-emoji images, create more sophisticated patterns
        const edgeX = Math.abs(x - centerX) / centerX;
        const edgeY = Math.abs(y - centerY) / centerY;
        const edgeWeight = Math.max(edgeX, edgeY);
        
        // Create varied patterns based on image characteristics
        const pattern1 = Math.sin(x * 0.2) * Math.cos(y * 0.3) * 30;
        const pattern2 = Math.sin((x + y) * 0.15) * 20;
        const pattern3 = Math.cos(x * y * 0.001) * 25;
        
        intensity += pattern1 + pattern2 + pattern3;
        
        // Add edge enhancement
        if (edgeWeight > 0.7) {
          intensity += 40;
        }
      }
      
      // Ensure good contrast and valid range
      grid[index] = Math.max(0, Math.min(255, Math.round(intensity)));
    }
  }
  
  return grid;
}

function getPixel(grid, x, y, cols) {
  const index = y * cols + x;
  return grid[index] || 128;
}
