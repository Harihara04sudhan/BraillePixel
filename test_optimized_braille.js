// Test the optimized braille function
const brailleFunction = require('./netlify/functions/braille-optimized.js');

// Mock smiley emoji data
const smileyImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAB3RJTUUH4wMJCxoOzP4LfQAAAF1JREFUOI3t0jEKwzAMhOE/yeCxcydLXsOzODjY4LGjpUgF9+1wvNcvjE5wfJclWdp/9jUr2zv4yfoxwLGHnRH6Ps8BYGcXZzh0Ef7bv8T1xvEU8oGXgLLKzK6j8AEhKS4fzFuhrQAAAABJRU5ErkJggg==';

const mockEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
        image: smileyImageData,
        cols: 30,
        threshold: 127,
        invert: false
    })
};

const mockContext = {};

async function testOptimizedBraille() {
    try {
        console.log('🧪 Testing optimized braille function...');
        const result = await brailleFunction.handler(mockEvent, mockContext);
        
        console.log('📊 Status Code:', result.statusCode);
        
        if (result.statusCode === 200) {
            const body = JSON.parse(result.body);
            console.log('✅ Success!');
            console.log('🔍 Debug Info:', body.debug);
            console.log('📏 Output Length:', body.result.length);
            console.log('\n🎨 Braille Output:');
            console.log(body.result);
            console.log('\n✨ This should show a smiley face pattern!');
        } else {
            console.log('❌ Error:', result.body);
        }
        
    } catch (error) {
        console.error('💥 Test failed:', error);
    }
}

testOptimizedBraille();
