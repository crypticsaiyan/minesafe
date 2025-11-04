import { NextResponse } from "next/server";
import accidentData from "@/rag/accident_data.json";

export async function GET() {
  try {
    // Generate sample alerts based on accident data patterns
    const alerts = [
      {
        id: "alert-1",
        type: "critical",
        title: "Increase in Ground Movement Accidents",
        message:
          "Pattern detection identified 23% increase in ground movement incidents in Jharkhand coal mines over the past quarter. Immediate inspection required.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        region: "Jharkhand",
        acknowledged: false,
        actionRequired:
          "Schedule immediate geological survey and roof support inspection for all underground operations. Verify rock bolting compliance per MMR 112.",
      },
      {
        id: "alert-2",
        type: "critical",
        title: "Transportation Machinery Risk Spike",
        message:
          "AI analysis detected elevated risk of transportation machinery accidents in Q3 2022. Three incidents reported in last 30 days.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        region: "Odisha",
        acknowledged: false,
        actionRequired:
          "Implement mandatory machinery safety checks. Conduct operator retraining and certification verification. Install proximity warning systems on all dumpers.",
      },
      {
        id: "alert-3",
        type: "warning",
        title: "Regulatory Compliance Gap Detected",
        message:
          "Analysis shows 12 mines in Chhattisgarh have not updated systematic timbering rules as per MMR 1961 amendments.",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        region: "Chhattisgarh",
        acknowledged: false,
        actionRequired:
          "Issue compliance notices to affected mines. Schedule regulatory review meetings within 15 days. Update documentation.",
      },
      {
        id: "alert-4",
        type: "warning",
        title: "Seasonal Risk Pattern: Monsoon Approaching",
        message:
          "Historical data shows 32% increase in slope failure and transportation accidents during monsoon season (June-Sep).",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        region: "Maharashtra",
        acknowledged: false,
        actionRequired:
          "Conduct preventive slope stability assessments. Review drainage systems. Implement monsoon safety protocols including speed restrictions.",
      },
      {
        id: "alert-5",
        type: "info",
        title: "New Safety Regulation Update Available",
        message:
          "DGMS has published updated guidelines for underground ventilation systems. All metalliferous mines must comply by Q4 2022.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        region: "All States",
        acknowledged: false,
        actionRequired:
          "Review updated guidelines and assess current ventilation systems for compliance. Plan upgrades if necessary.",
      },
      {
        id: "alert-6",
        type: "info",
        title: "Positive Trend: West Bengal Safety Improvement",
        message:
          "Zero ground movement fatalities recorded in West Bengal coal mines for the past 90 days. Safety protocols showing effectiveness.",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        region: "West Bengal",
        acknowledged: true,
        actionRequired:
          "Document and share best practices with other regions. Continue current safety protocols.",
      },
    ];

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
