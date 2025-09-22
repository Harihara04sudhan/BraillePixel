// Emoji sets function for Netlify
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Simple emoji sets
  const emojiSets = {
    geometric: ['🔷', '🔶', '🔹', '🔸', '◻️', '◼️', '▫️', '▪️', '🔳', '🔲'],
    faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '♥️'],
    nature: ['🌲', '🌳', '🌴', '🌵', '🌶', '🍃', '🍀', '🌿', '🌱', '🌾'],
    fire: ['🔥', '💥', '✨', '⭐', '🌟', '💫', '⚡', '🌈', '☀️', '🌞'],
    water: ['💧', '💦', '🌊', '🏊', '🚿', '🛁', '🌧️', '⛈️', '🌦️', '☔']
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ sets: emojiSets })
  };
};
