#!/usr/bin/env python3
"""
Test script to verify the web API is working correctly
"""

import requests
import json
import base64
import io
from PIL import Image

def test_braille_api():
    # Create a simple test image
    img = Image.new('RGB', (40, 40), color='white')
    
    # Draw a simple pattern
    for i in range(10, 30):
        for j in range(10, 30):
            if (i + j) % 4 == 0:
                img.putpixel((i, j), (0, 0, 0))  # black pixels in a pattern

    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    img_data = f'data:image/png;base64,{img_str}'

    # Test both endpoints
    endpoints = [
        'http://localhost:5000/api/braille',
        'http://localhost:5000/.netlify/functions/braille'
    ]
    
    for endpoint in endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            response = requests.post(endpoint, 
                                   json={
                                       'image': img_data, 
                                       'cols': 20, 
                                       'threshold': 127
                                   },
                                   headers={'Content-Type': 'application/json'},
                                   timeout=10)
            
            print(f"Status: {response.status_code}")
            print(f"Content-Type: {response.headers.get('Content-Type', 'Unknown')}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if 'result' in data:
                        result = data['result']
                        print(f"✅ SUCCESS - Generated {len(result)} characters")
                        print("Preview:")
                        lines = result.split('\n')
                        for line in lines[:3]:  # Show first 3 lines
                            print(f"  {line}")
                        if len(lines) > 3:
                            print(f"  ... ({len(lines)-3} more lines)")
                    else:
                        print("❌ FAIL - No result in response")
                except json.JSONDecodeError as e:
                    print(f"❌ FAIL - Invalid JSON: {e}")
                    print(f"Response text: {response.text[:100]}...")
            else:
                print(f"❌ FAIL - HTTP {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ ERROR - Request failed: {e}")

if __name__ == '__main__':
    print("🧪 Testing BraillePixel Web API")
    print("=" * 50)
    test_braille_api()
    print("\n" + "=" * 50)
    print("✨ Test complete!")
