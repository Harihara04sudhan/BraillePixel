// ASCII art generation function for Netlify
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

    const text = data.text.toUpperCase();
    const font = data.font || 'block';
    const border = data.border || false;
    const gradient = data.gradient || false;
    
    let result = generateASCIIArt(text, font);
    
    // Apply effects
    if (border) {
      result = addBorder(result);
    }
    
    if (gradient) {
      result = applyGradient(result);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function generateASCIIArt(text, font) {
  // Enhanced ASCII patterns
  const blockPatterns = {
    'A': [
      '  ██████  ',
      ' ██    ██ ',
      '██      ██',
      '██████████',
      '██      ██',
      '██      ██',
      '██      ██'
    ],
    'B': [
      '██████████',
      '██      ██',
      '██      ██',
      '██████████',
      '██      ██',
      '██      ██',
      '██████████'
    ],
    'C': [
      ' ████████ ',
      '██      ██',
      '██        ',
      '██        ',
      '██        ',
      '██      ██',
      ' ████████ '
    ],
    'D': [
      '██████████',
      '██      ██',
      '██      ██',
      '██      ██',
      '██      ██',
      '██      ██',
      '██████████'
    ],
    'E': [
      '██████████',
      '██        ',
      '██        ',
      '██████    ',
      '██        ',
      '██        ',
      '██████████'
    ],
    'F': [
      '██████████',
      '██        ',
      '██        ',
      '██████    ',
      '██        ',
      '██        ',
      '██        '
    ],
    'G': [
      ' ████████ ',
      '██      ██',
      '██        ',
      '██   █████',
      '██      ██',
      '██      ██',
      ' ████████ '
    ],
    'H': [
      '██      ██',
      '██      ██',
      '██      ██',
      '██████████',
      '██      ██',
      '██      ██',
      '██      ██'
    ],
    'I': [
      '██████████',
      '    ██    ',
      '    ██    ',
      '    ██    ',
      '    ██    ',
      '    ██    ',
      '██████████'
    ],
    'L': [
      '██        ',
      '██        ',
      '██        ',
      '██        ',
      '██        ',
      '██        ',
      '██████████'
    ],
    'O': [
      ' ████████ ',
      '██      ██',
      '██      ██',
      '██      ██',
      '██      ██',
      '██      ██',
      ' ████████ '
    ],
    'T': [
      '██████████',
      '    ██    ',
      '    ██    ',
      '    ██    ',
      '    ██    ',
      '    ██    ',
      '    ██    '
    ],
    ' ': [
      '          ',
      '          ',
      '          ',
      '          ',
      '          ',
      '          ',
      '          '
    ]
  };

  const simplePatterns = {
    'A': ['█████', '█   █', '█████', '█   █', '█   █'],
    'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
    'C': ['█████', '█    ', '█    ', '█    ', '█████'],
    'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
    'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
    'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
    'O': ['█████', '█   █', '█   █', '█   █', '█████'],
    'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
    ' ': ['     ', '     ', '     ', '     ', '     ']
  };

  const patterns = font === 'simple' ? simplePatterns : blockPatterns;
  const height = font === 'simple' ? 5 : 7;
  
  let result = '';
  
  // Generate each row
  for (let row = 0; row < height; row++) {
    let line = '';
    for (let char of text) {
      const pattern = patterns[char] || patterns[' '];
      line += pattern[row] + '  ';
    }
    result += line.trimEnd() + '\n';
  }

  return result.trim();
}

function addBorder(text) {
  const lines = text.split('\n');
  const maxWidth = Math.max(...lines.map(line => line.length));
  
  const border = '█'.repeat(maxWidth + 4);
  const result = [border];
  
  for (const line of lines) {
    result.push('█ ' + line.padEnd(maxWidth) + ' █');
  }
  
  result.push(border);
  return result.join('\n');
}

function applyGradient(text) {
  const gradientChars = ['█', '▓', '▒', '░', ' '];
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    const gradientIndex = Math.floor((index / lines.length) * (gradientChars.length - 1));
    return line.replace(/█/g, gradientChars[gradientIndex]);
  }).join('\n');
}
