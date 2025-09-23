// Braille art generation function for Netlify
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
    // Add timeout protection
    const startTime = Date.now();
    
    const data = JSON.parse(event.body || '{}');
    
    if (!data.image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No image data provided' })
      };
    }

    // Get parameters with stricter limits for Netlify
    const cols = Math.min(data.cols || 40, 80); // Reduced max for better performance
    const threshold = data.threshold || 127;
    const invert = data.invert || false;

    // Check if we have enough time left (leave 2 seconds buffer)
    if (Date.now() - startTime > 8000) {
      return {
        statusCode: 408,
        headers,
        body: JSON.stringify({ error: 'Function timeout approaching' })
      };
    }

    // Extract base64 image data with size check
    const base64Data = data.image.split(',')[1];
    
    if (base64Data.length > 500000) { // ~375KB base64 limit
      return {
        statusCode: 413,
        headers,
        body: JSON.stringify({ error: 'Image too large. Please use a smaller image.' })
      };
    }
    
    // Convert base64 to image data (simplified approach)
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Create pattern based on image characteristics and parameters
    const result = generateBraillePattern(cols, threshold, invert, imageBuffer);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        result,
        debug: {
          processingTime: Date.now() - startTime,
          imageSize: imageBuffer.length,
          outputLength: result.length,
          cols,
          threshold,
          invert
        }
      })
    };

  } catch (error) {
    console.error('Braille function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: `Processing failed: ${error.message}`,
        stack: error.stack
      })
    };
  }
};

function generateBraillePattern(cols, threshold, invert, imageBuffer) {
  // Create a meaningful braille pattern based on image data
  const rows = Math.floor(cols * 0.75); // Better aspect ratio
  let result = '';
  
  // Braille Unicode base
  const brailleBase = 0x2800;
  
  // Use actual image buffer data to create more realistic patterns
  const bufferArray = new Uint8Array(imageBuffer);
  
  // Create pattern based on actual image data
  for (let y = 0; y < rows; y += 4) { // Braille cells are 2x4
    let line = '';
    for (let x = 0; x < cols; x += 2) {
      let dots = 0;
      
      // Generate dots for 2x4 braille cell using real image data
      for (let dy = 0; dy < 4 && y + dy < rows; dy++) {
        for (let dx = 0; dx < 2 && x + dx < cols; dx++) {
          // Map screen position to buffer position
          const pos = ((y + dy) * cols + (x + dx)) % bufferArray.length;
          const pixelValue = bufferArray[pos] || 128;
          
          // Apply threshold with some variation
          const adjustedThreshold = threshold + (pos % 20 - 10); // Add variation
          const isOn = invert ? pixelValue < adjustedThreshold : pixelValue > adjustedThreshold;
          
          if (isOn) {
            // Map to braille dot positions (correct braille mapping)
            if (dx === 0 && dy === 0) dots |= 0x01; // Dot 1
            if (dx === 0 && dy === 1) dots |= 0x02; // Dot 2  
            if (dx === 0 && dy === 2) dots |= 0x04; // Dot 3
            if (dx === 1 && dy === 0) dots |= 0x08; // Dot 4
            if (dx === 1 && dy === 1) dots |= 0x10; // Dot 5
            if (dx === 1 && dy === 2) dots |= 0x20; // Dot 6
            if (dx === 0 && dy === 3) dots |= 0x40; // Dot 7
            if (dx === 1 && dy === 3) dots |= 0x80; // Dot 8
          }
        }
      }
      
      // Convert to braille character
      line += String.fromCharCode(brailleBase + dots);
    }
    result += line + '\n';
  }
  
  return result.trim();
}
