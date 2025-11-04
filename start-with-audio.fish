#!/usr/bin/env fish

# Start Flask Translation Server and Next.js Dev Server

echo "🚀 Starting Hellowbot with Audio Translation..."
echo ""

# Check if Python is available
if not command -v python3 &> /dev/null
    echo "❌ Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
end

# Check if Node.js is available
if not command -v node &> /dev/null
    echo "❌ Node.js is not installed. Please install Node.js."
    exit 1
end

# Start Flask server in background
echo "📡 Starting Flask translation server..."
cd hintoeng
venv/bin/python app.py &
set FLASK_PID $last_pid
cd ..

# Wait for Flask server to start
echo "⏳ Waiting for Flask server to initialize..."
sleep 3

# Start Next.js dev server
echo "🌐 Starting Next.js development server..."
echo ""
echo "📱 Chat interface: http://localhost:3000/chat"
echo "🎤 Click the microphone icon to record and translate audio"
echo ""
npm run dev

# Cleanup: Kill Flask server when Next.js exits
kill $FLASK_PID
