#!/usr/bin/env python3
"""
Test utility to check audio files saved in /tmp
"""

import os
import glob
import whisper

# Find debug audio files
tmp_dir = "/tmp"
debug_files = glob.glob(os.path.join(tmp_dir, "debug_*.webm"))

if not debug_files:
    print("No debug audio files found in /tmp")
    print("Try recording something first!")
    exit(1)

# Show available files
print(f"Found {len(debug_files)} debug audio files:")
for i, f in enumerate(sorted(debug_files, reverse=True)[:5], 1):
    size = os.path.getsize(f)
    print(f"{i}. {os.path.basename(f)} - {size} bytes")

# Test the most recent one
latest_file = sorted(debug_files, reverse=True)[0]
print(f"\nTesting most recent file: {os.path.basename(latest_file)}")
print(f"File size: {os.path.getsize(latest_file)} bytes")

# Try to transcribe it
print("\nLoading Whisper model...")
model = whisper.load_model("small")

print("Attempting transcription...")
try:
    result = model.transcribe(
        latest_file,
        task="transcribe",
        language=None,
        fp16=False,
        verbose=True,
        temperature=0.0,
        no_speech_threshold=0.6,
    )
    
    print(f"\nTranscription: '{result['text']}'")
    print(f"Detected language: {result.get('language', 'unknown')}")
    
    if result['text'].strip():
        print("\n✅ Speech detected successfully!")
        
        # Try translation
        print("\nAttempting translation to English...")
        result = model.transcribe(
            latest_file,
            task="translate",
            language=None,
            fp16=False,
            verbose=True,
        )
        print(f"Translation: '{result['text']}'")
    else:
        print("\n❌ No speech detected in the audio file")
        print("\nPossible issues:")
        print("- Microphone volume too low")
        print("- Recording too short")
        print("- Only background noise recorded")
        print("- Microphone not working properly")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()

print(f"\nYou can manually test the file with:")
print(f"ffplay {latest_file}")
print(f"or")
print(f"vlc {latest_file}")
