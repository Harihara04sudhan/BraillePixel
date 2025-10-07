// Test the enhanced braille function with different scenarios
const fs = require('fs');
const path = require('path');

// Import the braille function
const brailleFunction = require('./netlify/functions/braille.js');

// Test cases
const testCases = [
    {
        name: "Small Black Square",
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFElEQVR42mNkYPhfz0AEYBxVSF+FAP//AwBVgAFNSZtjlAAAAABJRU5ErkJggg==',
        cols: 30,
        threshold: 127,
        invert: false
    },
    {
        name: "Smiley Emoji Simulation",
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAEpJREFUOE9jZKAQMFKon2E4OuDfCGBkZGT8j0eDE5B/HQ02ejcaAAZA6HEA',
        cols: 40,
        threshold: 100,
        invert: false
    },
    {
        name: "High Contrast Test",
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFElEQVR42mNkYPhfz0AEYBxVSF+FAP//AwBVgAFNSZtjlAAAAABJRU5ErkJggg==',
        cols: 20,
        threshold: 200,
        invert: true
    }
];

async function testBrailleFunction() {
    console.log('🧪 Testing Enhanced Braille Function...\n');
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n🔍 Test ${i + 1}: ${testCase.name}`);
        console.log('='[50]);
        
        // Create mock Netlify event
        const mockEvent = {
            httpMethod: 'POST',
            body: JSON.stringify({
                image: testCase.image,
                cols: testCase.cols,
                threshold: testCase.threshold,
                invert: testCase.invert
            })
        };

        const mockContext = {};

        try {
            const result = await brailleFunction.handler(mockEvent, mockContext);
            
            console.log('✅ Status Code:', result.statusCode);
            
            if (result.statusCode === 200) {
                const body = JSON.parse(result.body);
                
                console.log('📊 Debug Info:');
                console.log('  - Algorithm:', body.debug?.algorithm || 'N/A');
                console.log('  - Cols:', body.debug?.cols || 'N/A');
                console.log('  - Threshold:', body.debug?.threshold || 'N/A');
                console.log('  - Output Length:', body.debug?.outputLength || 'N/A');
                
                if (body.result) {
                    console.log('\n🎨 Braille Output:');
                    console.log(body.result);
                    
                    // Analysis
                    const uniqueChars = new Set(body.result.replace(/\n/g, '')).size;
                    const totalChars = body.result.replace(/\n/g, '').length;
                    const complexity = uniqueChars / totalChars;
                    
                    console.log('\n📈 Pattern Analysis:');
                    console.log('  - Total characters:', totalChars);
                    console.log('  - Unique characters:', uniqueChars);
                    console.log('  - Pattern complexity:', (complexity * 100).toFixed(1) + '%');
                    
                    // Check if it's not all blank
                    const blankChar = '⠀';
                    const nonBlankChars = body.result.replace(/\n/g, '').replace(new RegExp(blankChar, 'g'), '').length;
                    console.log('  - Non-blank characters:', nonBlankChars);
                    console.log('  - Pattern variation:', nonBlankChars > 0 ? '✅ Good' : '❌ Too uniform');
                }
            } else {
                console.log('❌ Error Response:', result.body);
            }
            
        } catch (error) {
            console.error('❌ Test failed:', error.message);
        }
        
        console.log('\n' + '-'.repeat(50));
    }
    
    console.log('\n🎯 Test Summary:');
    console.log('- Enhanced algorithm should show varied braille patterns');
    console.log('- Smiley simulation should have more structured output');
    console.log('- Different thresholds should produce different results');
}

testBrailleFunction();
