# Hindi to English Audio Translator

A web application that translates audio from any language (especially Hindi) to English using OpenAI's Whisper model.

## Features

- 🎤 Upload audio files in various formats (MP3, WAV, OGG, FLAC, M4A, WebM)
- 🌐 Drag & drop file upload
- 🔄 Real-time translation to English
- 🎨 Beautiful, responsive UI
- 🚀 Fast processing with Whisper medium model

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- OpenAI Whisper (audio translation)
- Werkzeug (file handling)

### 2. Run the Application

```bash
python app.py
```

The server will start on `http://localhost:5000`

## Usage

1. Open your browser and navigate to `http://localhost:5000`
2. Click the upload area or drag & drop an audio file
3. Click "Translate to English"
4. Wait for the translation (may take a few seconds depending on file size)
5. View the translated English text

## Supported Audio Formats

- MP3
- WAV
- OGG
- FLAC
- M4A
- WebM
- MP4

## Notes

- Maximum file size: 50MB
- First run will download the Whisper medium model (~1.5GB)
- Processing time depends on audio length and your hardware
- The model works best with clear audio

## Project Structure

```
hintoeng/
├── app.py              # Flask backend server
├── translate.py        # Original translation script
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html     # Frontend UI
└── README.md          # This file
```

## API Endpoint

### POST /translate

Upload an audio file for translation.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `audio` file

**Response:**
```json
{
  "success": true,
  "text": "Translated English text here",
  "language": "hi"
}
```

## Troubleshooting

**Issue:** "Model not found" error
- Solution: First run downloads the model automatically. Wait for it to complete.

**Issue:** Out of memory error
- Solution: Try using a smaller Whisper model (change "medium" to "base" in app.py)

**Issue:** Slow processing
- Solution: Consider using GPU acceleration if available, or use a smaller model
