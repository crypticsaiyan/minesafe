from flask import Flask, request, jsonify, render_template
import whisper
import os
from werkzeug.utils import secure_filename
import tempfile
import torch

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()

# Configure GPU with memory optimization
if torch.cuda.is_available():
    device = "cuda"
    # Clear any existing GPU memory
    torch.cuda.empty_cache()
    # Set memory allocation configuration (using new env var name)
    os.environ['PYTORCH_ALLOC_CONF'] = 'expandable_segments:True'
    print(f"Using GPU: {torch.cuda.get_device_name(0)}")
    print(f"Total GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    print(f"GPU memory allocated: {torch.cuda.memory_allocated(0) / 1e9:.2f} GB")
else:
    device = "cpu"
    print("CUDA not available, using CPU")

# Load Whisper model (using 'small' model - optimal for 6GB GPU with other processes)
print("Loading Whisper small model...")
model = whisper.load_model("small", device=device)
print("Model loaded successfully!")
print(f"GPU memory after loading: {torch.cuda.memory_allocated(0) / 1e9:.2f} GB")

ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg', 'flac', 'm4a', 'webm', 'mp4'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate_audio():
    if 'audio' not in request.files:
        print("ERROR: No audio file in request")
        return jsonify({'error': 'No audio file provided'}), 400
    
    file = request.files['audio']
    
    if file.filename == '':
        print("ERROR: Empty filename")
        return jsonify({'error': 'No file selected'}), 400
    
    print(f"Received file: {file.filename}, content_type: {file.content_type}")
    
    if not allowed_file(file.filename):
        print(f"ERROR: Invalid file type: {file.filename}")
        return jsonify({'error': 'Invalid file type. Allowed types: mp3, wav, ogg, flac, m4a, webm, mp4'}), 400
    
    try:
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Also save a debug copy with timestamp
        import time
        debug_filename = f"debug_{int(time.time())}_{filename}"
        debug_filepath = os.path.join(app.config['UPLOAD_FOLDER'], debug_filename)
        import shutil
        shutil.copy(filepath, debug_filepath)
        print(f"Debug copy saved: {debug_filepath}")
        
        # Check file size
        file_size = os.path.getsize(filepath)
        print(f"Processing audio file: {filename}")
        print(f"File path: {filepath}")
        print(f"File size: {file_size} bytes")
        
        if file_size < 1000:
            print(f"ERROR: File too small ({file_size} bytes < 1000 bytes minimum)")
            os.remove(filepath)
            return jsonify({'error': 'Audio file is too small or empty. Please record longer audio.'}), 400
        
        # Transcribe and translate to English
        # Use language parameter to help with detection if needed
        print("Starting transcription...")
        result = model.transcribe(
            filepath, 
            task="translate",
            language=None,  # Auto-detect language
            fp16=False,  # Use FP32 for better compatibility
            verbose=True,
            temperature=0.0,  # More deterministic
            compression_ratio_threshold=2.4,
            logprob_threshold=-1.0,
            no_speech_threshold=0.6,  # Lower threshold to detect quieter speech
        )
        
        translation_text = result['text'].strip()
        detected_language = result.get('language', 'unknown')
        
        print(f"Translation result: '{translation_text}'")
        print(f"Detected language: {detected_language}")
        
        # If no text detected with translation, try transcription only
        if not translation_text:
            print("No translation detected, trying transcription only...")
            result = model.transcribe(
                filepath,
                task="transcribe",
                language=None,
                fp16=False,
                verbose=True,
                temperature=0.0,
                no_speech_threshold=0.6,
            )
            translation_text = result['text'].strip()
            detected_language = result.get('language', 'unknown')
            print(f"Transcription result: '{translation_text}'")
            print(f"Detected language: {detected_language}")
            
            # If we got transcription but it's not English, inform user
            if translation_text and detected_language != 'en':
                print(f"Warning: Transcribed in {detected_language}, but translation failed")
        
        # Clean up temporary file (keep debug copy)
        os.remove(filepath)
        
        if not translation_text:
            return jsonify({
                'error': 'No speech detected in audio. Please:\n1. Speak louder and closer to the microphone\n2. Check microphone settings\n3. Try recording for 3-5 seconds\n4. Ensure you\'re speaking, not just background noise'
            }), 400
        
        return jsonify({
            'success': True,
            'text': translation_text,
            'language': detected_language
        })
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        # Clean up file if it exists
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
