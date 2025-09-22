// Simple ASCII art function for Netlify
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
    
    if (!data.text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No text provided' })
      };
    }

    // Simple ASCII art patterns
    const text = data.text.toUpperCase();
    const patterns = {
      'A': [
        ' ██████ ',
        '██    ██',
        '████████',
        '██    ██',
        '██    ██'
      ],
      'B': [
        '███████ ',
        '██    ██',
        '███████ ',
        '██    ██',
        '███████ '
      ],
      'C': [
        ' ██████ ',
        '██      ',
        '██      ',
        '██      ',
        ' ██████ '
      ],
      'H': [
        '██    ██',
        '██    ██',
        '████████',
        '██    ██',
        '██    ██'
      ],
      'I': [
        '████████',
        '   ██   ',
        '   ██   ',
        '   ██   ',
        '████████'
      ],
      'L': [
        '██      ',
        '██      ',
        '██      ',
        '██      ',
        '████████'
      ],
      'O': [
        ' ██████ ',
        '██    ██',
        '██    ██',
        '██    ██',
        ' ██████ '
      ],
      'T': [
        '████████',
        '   ██   ',
        '   ██   ',
        '   ██   ',
        '   ██   '
      ]
    };

    let result = '';
    
    // Generate ASCII for each character
    for (let i = 0; i < 5; i++) { // 5 rows
      let line = '';
      for (let char of text) {
        if (patterns[char]) {
          line += patterns[char][i] + '  ';
        } else {
          line += '████████  '; // Default block
        }
      }
      result += line.trimEnd() + '\n';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        result: result.trim(),
        note: "Simplified ASCII art. Full font support temporarily unavailable."
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
