import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { alertId } = await req.json();
    
    // In production, this would update a database
    return NextResponse.json({ success: true, alertId });
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    return NextResponse.json(
      { error: "Failed to acknowledge alert" },
      { status: 500 }
    );
  }
}
