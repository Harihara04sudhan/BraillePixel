#!/bin/bash

# BraillePixel Deployment Script
# This script helps deploy the fixed version to Netlify

echo "🚀 BraillePixel Deployment Helper"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "netlify.toml" ]; then
    echo "❌ Error: netlify.toml not found. Make sure you're in the project root directory."
    exit 1
fi

echo "✅ Found netlify.toml - we're in the right directory"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📂 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Add all files
echo "📁 Adding all files to git..."
git add .

# Create commit
echo "💾 Creating commit..."
COMMIT_MESSAGE="🔧 Fix Netlify functions and improve error handling - $(date '+%Y-%m-%d %H:%M')"
git commit -m "$COMMIT_MESSAGE"

echo "✅ Changes committed successfully"

# Check for netlify CLI
if command -v netlify &> /dev/null; then
    echo "🌐 Netlify CLI found - deploying..."
    netlify deploy --prod
    echo "✅ Deployment complete!"
    echo ""
    echo "🎉 Your site should now be working!"
    echo "📊 Test your deployment:"
    echo "   1. Visit your main site"
    echo "   2. Try the debug page: your-site.netlify.app/debug-api.html"
    echo "   3. Test all three art generators"
else
    echo "⚠️  Netlify CLI not found."
    echo ""
    echo "📋 Manual deployment steps:"
    echo "   1. Go to your Netlify dashboard"
    echo "   2. Connect your repository or drag/drop the project folder"
    echo "   3. Set build command: echo 'Building static site...'"
    echo "   4. Set publish directory: web"
    echo "   5. Deploy!"
    echo ""
    echo "💡 Or install Netlify CLI:"
    echo "   npm install -g netlify-cli"
    echo "   netlify login"
    echo "   netlify init"
    echo "   netlify deploy --prod"
fi

echo ""
echo "🔍 After deployment, test these URLs:"
echo "   Main site: https://your-site.netlify.app/"
echo "   Debug tool: https://your-site.netlify.app/debug-api.html"
echo ""
echo "📝 If issues persist, check the debug tool output"
echo "   and Netlify function logs in your dashboard."
