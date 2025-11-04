import whisper

# Load the medium model (good for Hindi)
model = whisper.load_model("medium")

# Transcribe & translate into English
result = model.transcribe("input_hindi_audio.mp3", task="translate")

print("Translated English Text:")
print(result["text"])