// Simple Emoji art function for Netlify
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
    
    if (data.mode === 'text' && data.text) {
      // Simple text to emoji conversion
      const emoji = data.on_emoji || '🔥';
      const offEmoji = data.off_emoji || '⚪';
      const width = data.width || 40;
      
      // Create a simple pattern based on text
      const text = data.text.toUpperCase();
      let result = '';
      
      // Simple letter patterns (very basic)
      const patterns = {
        'H': [
          '🔥⚪🔥',
          '🔥🔥🔥',
          '🔥⚪🔥'
        ],
        'I': [
          '🔥🔥🔥',
          '⚪🔥⚪',
          '🔥🔥🔥'
        ],
        'L': [
          '🔥⚪⚪',
          '🔥⚪⚪',
          '🔥🔥🔥'
        ],
        'O': [
          '🔥🔥🔥',
          '🔥⚪🔥',
          '🔥🔥🔥'
        ]
      };
      
      // Generate pattern for first letter
      const firstChar = text[0];
      if (patterns[firstChar]) {
        result = patterns[firstChar].join('\n');
      } else {
        result = '🔥🔥🔥\n🔥⚪🔥\n🔥🔥🔥';
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          result: result,
          note: "Simplified emoji text art. Full processing temporarily unavailable."
        })
      };
    }

    // For image mode, return placeholder
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        result: '🔥🔥🔥🔥🔥\n🔥⚪⚪⚪🔥\n🔥⚪🔥⚪🔥\n🔥⚪⚪⚪🔥\n🔥🔥🔥🔥🔥',
        note: "Simplified emoji art. Full image processing temporarily unavailable."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
