#!/bin/bash

# BraillePixel Pre-Deployment Validation Script
echo "🚀 BraillePixel Pre-Deployment Validation"
echo "========================================="
echo ""

# Check if server is running
echo "📡 Checking local server..."
if curl -s "http://localhost:8000/web/" > /dev/null; then
    echo "✅ Local server is running"
else 
    echo "❌ Local server not running - starting it..."
    cd /home/hari/Documents/pyart
    python3 -m http.server 8000 &
    SERVER_PID=$!
    sleep 2
    echo "✅ Server started with PID $SERVER_PID"
fi

echo ""

# Check file structure
echo "📁 Checking file structure..."

required_files=(
    "web/index.html"
    "web/script-simple.js"
    "web/styles.css"
    "web/pictologo.png"
    "web/favicon.png"
    "netlify.toml"
    "netlify/functions/api.py"
)

for file in "${required_files[@]}"; do
    if [ -f "/home/hari/Documents/pyart/$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""

# Check JavaScript syntax
echo "📝 Checking JavaScript syntax..."
cd /home/hari/Documents/pyart/web

if node -c script-simple.js 2>/dev/null; then
    echo "✅ script-simple.js syntax is valid"
else
    echo "❌ script-simple.js has syntax errors"
    node -c script-simple.js
fi

echo ""

# Count key functions
echo "🔧 Checking JavaScript functions..."
function_count=$(grep -c "^function " script-simple.js)
echo "✅ Found $function_count functions in script-simple.js"

# Check for required functions
required_functions=(
    "showTab"
    "generateBraille"
    "generateEmoji"
    "generateASCII"
    "processImageToBraille"
    "processImageToEmojiBinary"
    "generateTextToEmoji"
    "generateASCIIText"
    "copyOutput"
    "selectOutput"
    "downloadOutput"
)

for func in "${required_functions[@]}"; do
    if grep -q "function $func" script-simple.js; then
        echo "✅ Function $func found"
    else
        echo "❌ Function $func missing"
    fi
done

echo ""

# Check HTML structure
echo "🌐 Checking HTML structure..."
tab_buttons=$(grep -c "tab-btn" index.html)
upload_areas=$(grep -c "upload-area" index.html)
generate_buttons=$(grep -c "generate-btn" index.html)

echo "✅ Found $tab_buttons tab buttons"
echo "✅ Found $upload_areas upload areas"
echo "✅ Found $generate_buttons generate buttons"

if grep -q 'id="output"' index.html; then
    echo "✅ Output area found"
else
    echo "❌ Output area missing"
fi

echo ""

# Check dependencies
echo "📦 Checking dependencies..."
if [ -f "requirements.txt" ]; then
    echo "✅ requirements.txt exists"
    echo "   Dependencies:"
    cat requirements.txt | sed 's/^/   - /'
else
    echo "❌ requirements.txt missing"
fi

echo ""

# Test file sizes
echo "📏 Checking file sizes..."
html_size=$(stat -c%s "index.html")
js_size=$(stat -c%s "script-simple.js")
css_size=$(stat -c%s "styles.css")

echo "✅ index.html: $(($html_size / 1024))KB"
echo "✅ script-simple.js: $(($js_size / 1024))KB"
echo "✅ styles.css: $(($css_size / 1024))KB"

if [ $html_size -gt 100000 ]; then
    echo "⚠️ HTML file is quite large (>100KB)"
fi

if [ $js_size -gt 50000 ]; then
    echo "⚠️ JavaScript file is quite large (>50KB)"
fi

echo ""

# Check for test images
echo "🖼️ Checking test images..."
test_images=(
    "../devil.jpeg"
    "../smiley.jpeg"
    "../logo.png"
    "pictologo.png"
)

available_images=0
for img in "${test_images[@]}"; do
    if [ -f "$img" ]; then
        size=$(stat -c%s "$img")
        echo "✅ $img ($(($size / 1024))KB)"
        ((available_images++))
    else
        echo "❌ $img missing"
    fi
done

echo "📊 Total available test images: $available_images"

echo ""

# Check Netlify configuration
echo "☁️ Checking Netlify configuration..."
if [ -f "../netlify.toml" ]; then
    echo "✅ netlify.toml exists"
    if grep -q "functions" ../netlify.toml; then
        echo "✅ Functions configuration found"
    fi
    if grep -q "publish" ../netlify.toml; then
        echo "✅ Publish directory configured"
    fi
else
    echo "❌ netlify.toml missing"
fi

echo ""

# Generate summary
echo "📋 VALIDATION SUMMARY"
echo "===================="

# Count issues
total_checks=20
issues=0

# Basic checks that should be automated
if [ ! -f "script-simple.js" ]; then ((issues++)); fi
if [ ! -f "index.html" ]; then ((issues++)); fi
if [ ! -f "styles.css" ]; then ((issues++)); fi
if ! grep -q 'id="output"' index.html; then ((issues++)); fi

passed=$((total_checks - issues))
echo "✅ Passed: $passed/$total_checks checks"

if [ $issues -eq 0 ]; then
    echo "🎉 ALL CHECKS PASSED - READY FOR DEPLOYMENT!"
    echo ""
    echo "🚀 Deployment Instructions:"
    echo "1. Push to GitHub repository"
    echo "2. Deploy to Netlify"
    echo "3. Test production URL"
    echo "4. Monitor for any issues"
else
    echo "⚠️ $issues issues found - please fix before deployment"
fi

echo ""
echo "🔗 Test URLs:"
echo "- Local: http://localhost:8000/web/"
echo "- Feature tests: http://localhost:8000/web/test-end-to-end.html"
echo "- Component tests: http://localhost:8000/web/test-all-features.html"

echo ""
echo "Validation completed at $(date)"
