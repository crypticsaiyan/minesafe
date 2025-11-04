# Quick Start Guide - Audio Translation Feature

## 🚀 Quick Start (Easiest Method)

Use the convenience script to start both servers:

```bash
./start-with-audio.fish
# or
./start-with-audio.sh
```

This will:
1. Start the Flask translation server on port 5000
2. Start the Next.js dev server on port 3000
3. Automatically clean up when you exit

## 📋 Manual Start

### Terminal 1 - Flask Server
```bash
cd hintoeng
venv/bin/python app.py
```

### Terminal 2 - Next.js App
```bash
npm run dev
```

## 🎤 Using the Feature

1. Open your browser to `http://localhost:3000/chat`
2. Look for the microphone icon 🎤 next to the input field
3. Click to start recording (icon turns red and pulses)
4. Speak in any language (Hindi, English, etc.)
5. Click again to stop and translate
6. The English translation appears in the input field
7. Review, edit if needed, and send!

## ✅ What's Fixed

- ✅ All npm dependencies installed
- ✅ Python virtual environment created
- ✅ All Python packages installed (Flask, Whisper, PyTorch)
- ✅ TypeScript compilation errors resolved
- ✅ Linting warnings fixed
- ✅ Startup scripts updated to use venv
- ✅ .gitignore updated to exclude venv

## 🔧 System Info Detected

- **OS**: Garuda Linux (Arch-based)
- **GPU**: NVIDIA GeForce RTX 4050 Laptop GPU (6GB)
- **Python**: 3.13.7
- **Node**: v25.0.0
- **Shell**: Fish

Your GPU is perfect for running Whisper's "small" model with plenty of headroom!

## ⚠️ Troubleshooting

### Flask server won't start
```bash
cd hintoeng
venv/bin/pip install -r requirements.txt
```

### "Cannot find module 'react'"
```bash
npm install
```

### Permission denied on startup script
```bash
chmod +x start-with-audio.fish start-with-audio.sh
```

## 📝 Files Created/Modified

**New Files:**
- `hooks/use-audio-recorder.ts` - Audio recording hook
- `components/ai-elements/audio-recorder-button.tsx` - Mic button component
- `app/api/translate-audio/route.ts` - Translation API endpoint
- `hintoeng/venv/` - Python virtual environment (excluded from git)
- `start-with-audio.fish` & `start-with-audio.sh` - Startup scripts
- `AUDIO_FEATURE_SETUP.md` - Detailed setup guide
- `AUDIO_ARCHITECTURE.md` - Technical architecture
- `QUICK_START.md` - This file

**Modified Files:**
- `app/chat/page.tsx` - Added audio button integration
- `components/ai-elements/prompt-input.tsx` - Fixed linting issues
- `.gitignore` - Added Python exclusions

## 🎯 Everything is Ready!

All dependencies are installed and configured. Just run:

```bash
./start-with-audio.fish
```

Then open `http://localhost:3000/chat` and start using the audio feature! 🎉
