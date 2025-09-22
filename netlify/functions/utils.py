"""
Shared utilities for Netlify Functions
"""
import json

def lambda_response(status_code, body):
    """Create a proper Lambda response"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
        },
        'body': json.dumps(body)
    }

def handle_cors(event):
    """Handle CORS preflight requests"""
    if event.get('httpMethod') == 'OPTIONS':
        return lambda_response(200, {'message': 'OK'})
    return None
