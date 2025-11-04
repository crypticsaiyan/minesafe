import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Forward the audio file to the Flask server
    const flaskFormData = new FormData();
    flaskFormData.append("audio", audioFile);

    // Make sure the Flask server is running on localhost:5000
    const flaskResponse = await fetch("http://localhost:5000/translate", {
      method: "POST",
      body: flaskFormData,
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.error ||
            "Translation failed. Make sure the Flask server is running.",
        },
        { status: flaskResponse.status }
      );
    }

    const data = await flaskResponse.json();

    return NextResponse.json({
      success: true,
      text: data.text,
      language: data.language || "unknown",
    });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to translate audio. Make sure the Flask server is running on port 5000.",
      },
      { status: 500 }
    );
  }
}
