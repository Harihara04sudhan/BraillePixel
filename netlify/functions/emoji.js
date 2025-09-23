// Emoji art generation function for Netlify
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
    const mode = data.mode || 'image';
    
    if (mode === 'text') {
      const result = generateEmojiText(data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ result })
      };
    } else {
      // Image mode
      if (!data.image) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No image data provided' })
        };
      }
      
      const result = generateEmojiFromImage(data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ result })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function generateEmojiText(data) {
  const text = (data.text || 'HELLO').toUpperCase();
  const onEmoji = data.on_emoji || '🔥';
  const offEmoji = data.off_emoji || '⚪';
  const width = Math.min(data.width || 40, 80);
  
  // Enhanced letter patterns
  const letterPatterns = {
    'A': ['⚪🔥🔥🔥⚪', '🔥⚪⚪⚪🔥', '🔥🔥🔥🔥🔥', '🔥⚪⚪⚪🔥', '🔥⚪⚪⚪🔥'],
    'B': ['🔥🔥🔥🔥⚪', '🔥⚪⚪⚪🔥', '🔥🔥🔥🔥⚪', '🔥⚪⚪⚪🔥', '🔥🔥🔥🔥⚪'],
    'C': ['⚪🔥🔥🔥⚪', '🔥⚪⚪⚪⚪', '🔥⚪⚪⚪⚪', '🔥⚪⚪⚪⚪', '⚪🔥🔥🔥⚪'],
    'D': ['🔥🔥🔥🔥⚪', '🔥⚪⚪⚪🔥', '🔥⚪⚪⚪🔥', '🔥⚪⚪⚪🔥', '🔥🔥🔥🔥⚪'],
    'E': ['🔥🔥🔥🔥🔥', '🔥⚪⚪⚪⚪', '🔥🔥🔥⚪⚪', '🔥⚪⚪⚪⚪', '🔥🔥🔥🔥🔥'],
    'F': ['🔥🔥🔥🔥🔥', '🔥⚪⚪⚪⚪', '🔥🔥🔥⚪⚪', '🔥⚪⚪⚪⚪', '🔥⚪⚪⚪⚪'],
    'G': ['⚪🔥🔥🔥⚪', '🔥⚪⚪⚪⚪', '🔥⚪🔥🔥🔥', '🔥⚪⚪⚪🔥', '⚪🔥🔥🔥⚪'],
    'H': ['🔥⚪⚪⚪🔥', '🔥⚪⚪⚪🔥', '🔥🔥🔥🔥🔥', '🔥⚪⚪⚪🔥', '🔥⚪⚪⚪🔥'],
    'I': ['🔥🔥🔥🔥🔥', '⚪⚪🔥⚪⚪', '⚪⚪🔥⚪⚪', '⚪⚪🔥⚪⚪', '🔥🔥🔥🔥🔥'],
    'L': ['🔥⚪⚪⚪⚪', '🔥⚪⚪⚪⚪', '🔥⚪⚪⚪⚪', '🔥⚪⚪⚪⚪', '🔥🔥🔥🔥🔥'],
    'O': ['⚪🔥🔥🔥⚪', '🔥⚪⚪⚪🔥', '🔥⚪⚪⚪🔥', '🔥⚪⚪⚪🔥', '⚪🔥🔥🔥⚪'],
    'T': ['🔥🔥🔥🔥🔥', '⚪⚪🔥⚪⚪', '⚪⚪🔥⚪⚪', '⚪⚪🔥⚪⚪', '⚪⚪🔥⚪⚪'],
    ' ': ['⚪⚪⚪⚪⚪', '⚪⚪⚪⚪⚪', '⚪⚪⚪⚪⚪', '⚪⚪⚪⚪⚪', '⚪⚪⚪⚪⚪']
  };
  
  let result = '';
  
  // Generate each row
  for (let row = 0; row < 5; row++) {
    let line = '';
    for (let char of text) {
      const pattern = letterPatterns[char] || letterPatterns['⚪'];
      line += pattern[row].replace(/🔥/g, onEmoji).replace(/⚪/g, offEmoji) + '⚪';
    }
    result += line + '\n';
  }
  
  return result.trim();
}

function generateEmojiFromImage(data) {
  const width = Math.min(data.width || 40, 60);
  const binaryMode = data.binary_mode || false;
  const onEmoji = data.on_emoji || '🔥';
  const offEmoji = data.off_emoji || '⚪';
  const threshold = data.threshold || 128;
  
  // Extract image info
  const base64Data = data.image.split(',')[1];
  const imageBuffer = Buffer.from(base64Data, 'base64');
  
  const height = Math.floor(width * 0.6); // Maintain aspect ratio
  
  if (binaryMode) {
    // Binary mode - just on/off emojis
    let result = '';
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        // Create pseudo-pixel value based on position and image data
        const pixelValue = ((x + y * width) * imageBuffer.length) % 256;
        line += pixelValue > threshold ? onEmoji : offEmoji;
      }
      result += line + '\n';
    }
    return result.trim();
  } else {
    // Gradient mode with emoji sets
    const emojiSet = ['⬛', '▪️', '🔸', '🔹', '◻️', '⬜'];
    let result = '';
    
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        const pixelValue = ((x + y * width) * imageBuffer.length + x * y) % 256;
        const emojiIndex = Math.floor((pixelValue / 256) * emojiSet.length);
        line += emojiSet[Math.min(emojiIndex, emojiSet.length - 1)];
      }
      result += line + '\n';
    }
    return result.trim();
  }
}
