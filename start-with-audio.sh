#!/bin/bash

# Start Flask Translation Server and Next.js Dev Server

echo "🚀 Starting Hellowbot with Audio Translation..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js."
    exit 1
fi

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $FLASK_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start Flask server in background
echo "📡 Starting Flask translation server..."
cd hintoeng
venv/bin/python app.py &
FLASK_PID=$!
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
