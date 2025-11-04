"use client";

import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { Loader2Icon, MicIcon, MicOffIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface AudioRecorderButtonProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export function AudioRecorderButton({
  onTranscriptionComplete,
  disabled = false,
}: AudioRecorderButtonProps) {
  const {
    isRecording,
    startRecording,
    stopRecording,
    error: recordingError,
  } = useAudioRecorder();

  const [isTranslating, setIsTranslating] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      // Check minimum recording duration
      const recordingDuration = recordingStartTime 
        ? Date.now() - recordingStartTime 
        : 0;
      
      if (recordingDuration < 1000) {
        toast.error("Recording too short. Please speak for at least 1 second.");
        await stopRecording(); // Stop anyway to reset state
        setRecordingStartTime(null);
        return;
      }

      // Stop recording and translate
      const audioBlob = await stopRecording();
      setRecordingStartTime(null);

      if (!audioBlob) {
        toast.error("Failed to capture audio");
        return;
      }

      // Check blob size
      if (audioBlob.size < 100) {
        toast.error("Recording is empty or too short. Please try again.");
        return;
      }

      console.log(`Audio blob size: ${audioBlob.size} bytes`);
      
      setIsTranslating(true);

      try {
        // Convert blob to file
        const audioFile = new File([audioBlob], "recording.webm", {
          type: "audio/webm",
        });

        // Send to translation API
        const formData = new FormData();
        formData.append("audio", audioFile);

        const response = await fetch("/api/translate-audio", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error("Translation failed:", errorData);
          throw new Error(errorData.error || "Translation failed");
        }

        const data = await response.json();
        console.log("Translation successful:", data);

        if (data.text) {
          onTranscriptionComplete(data.text);
          toast.success("Audio translated successfully!");
        } else {
          throw new Error("No text received from translation");
        }
      } catch (error) {
        console.error("Translation error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to translate audio. Please try again."
        );
      } finally {
        setIsTranslating(false);
      }
    } else {
      // Start recording
      await startRecording();
      setRecordingStartTime(Date.now());
      toast.info("Recording... Click again to stop and translate");
    }
  }, [isRecording, startRecording, stopRecording, onTranscriptionComplete, recordingStartTime]);

  // Show error toast if recording error occurs
  if (recordingError) {
    toast.error(recordingError);
  }

  const isLoading = isTranslating;
  const isActive = isRecording || isTranslating;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggleRecording}
      disabled={disabled || isLoading}
      className={isRecording ? "text-red-500 animate-pulse" : ""}
      title={
        isRecording
          ? "Stop recording and translate"
          : "Record audio to translate"
      }
    >
      {isLoading ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : isRecording ? (
        <MicOffIcon className="size-4" />
      ) : (
        <MicIcon className="size-4" />
      )}
    </Button>
  );
}
