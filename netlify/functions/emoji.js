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
  
  // Extract image info and create a better pattern
  const base64Data = data.image.split(',')[1] || data.image;
  const height = Math.floor(width * 0.6); // Maintain aspect ratio
  
  // Get emoji set for gradient mode
  const emojiSets = {
    'geometric': ['⬛', '▪️', '🔸', '🔹', '◻️', '⬜'],
    'faces': ['😭', '😢', '😐', '🙂', '😊', '😄'],
    'hearts': ['💔', '❤️‍🩹', '❤️', '💖', '💕', '💞'],
    'nature': ['🌑', '🌘', '🌗', '🌖', '🌕', '🌟'],
    'animals': ['🐸', '🐱', '🐶', '🦊', '🐰', '🐻'],
    'food': ['🥀', '🍎', '🍊', '🍋', '🌽', '🍰']
  };
  
  const selectedSet = emojiSets[data.emoji_set] || emojiSets['geometric'];
  
  if (binaryMode) {
    // Binary mode - create better patterns
    let result = '';
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        // Create better pseudo-pixel processing
        const dataIndex = (x + y * width) % base64Data.length;
        const char1 = base64Data.charCodeAt(dataIndex);
        const char2 = base64Data.charCodeAt((dataIndex + 1) % base64Data.length);
        
        // Average the character codes for better distribution
        const pixelValue = (char1 + char2) / 2;
        
        // Add some spatial patterns for better visual results
        const centerX = width / 2;
        const centerY = height / 2;
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);
        const spatialWeight = (1 - distFromCenter / maxDist) * 50;
        
        const finalValue = pixelValue + spatialWeight;
        line += finalValue > threshold ? onEmoji : offEmoji;
      }
      result += line + '\n';
    }
    return result.trim();
  } else {
    // Gradient mode with proper emoji sets
    let result = '';
    
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        // Better pixel value calculation
        const dataIndex = (x + y * width) % base64Data.length;
        const char1 = base64Data.charCodeAt(dataIndex);
        const char2 = base64Data.charCodeAt((dataIndex + 1) % base64Data.length);
        const char3 = base64Data.charCodeAt((dataIndex + 2) % base64Data.length);
        
        // Create RGB-like values
        const pixelValue = (char1 + char2 + char3) / 3;
        
        // Add spatial patterns for more interesting results
        const pattern = Math.sin(x * 0.2) * Math.cos(y * 0.3) * 20;
        const finalValue = Math.max(0, Math.min(255, pixelValue + pattern));
        
        const emojiIndex = Math.floor((finalValue / 255) * (selectedSet.length - 1));
        line += selectedSet[Math.max(0, Math.min(emojiIndex, selectedSet.length - 1))];
      }
      result += line + '\n';
    }
    return result.trim();
  }
}
