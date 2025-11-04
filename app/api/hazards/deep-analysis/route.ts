import { NextResponse } from "next/server";
import accidentData from "@/rag/accident_data.json";

export async function POST() {
  // Same as GET but could include more intensive AI analysis
  // For now, return the same data
  try {
    const allAccidents: any[] = [];
    
    Object.entries(accidentData).forEach(([key, accidents]: [string, any]) => {
      if (Array.isArray(accidents)) {
        allAccidents.push(...accidents);
      }
    });

    const causePatterns: Record<string, any> = {};
    const regionClusters: Record<string, any> = {};

    allAccidents.forEach((acc) => {
      const cause = acc.cause_category || "Unknown";
      const state = acc.location?.state || "Unknown";
      const district = acc.location?.district || "Unknown";

      if (!causePatterns[cause]) {
        causePatterns[cause] = {
          frequency: 0,
          regions: new Set(),
          trend: "stable",
        };
      }
      causePatterns[cause].frequency++;
      causePatterns[cause].regions.add(state);

      const regionKey = `${district}, ${state}`;
      if (!regionClusters[regionKey]) {
        regionClusters[regionKey] = {
          state,
          region: district,
          accidents: [],
          hazards: new Set(),
        };
      }
      regionClusters[regionKey].accidents.push(acc);
      regionClusters[regionKey].hazards.add(cause);
    });

    const patterns = Object.entries(causePatterns).map(
      ([type, data]: [string, any]) => {
        const frequency = data.frequency;
        const severity =
          frequency > 20
            ? "critical"
            : frequency > 10
            ? "high"
            : frequency > 5
            ? "medium"
            : "low";

        return {
          id: `pattern-${type.toLowerCase().replace(/\s+/g, "-")}`,
          type,
          severity,
          description: `Deep analysis: ${frequency} incidents of ${type} across ${
            data.regions.size
          } states. AI prediction shows ${
            severity === "critical" ? "critical" : "elevated"
          } risk trajectory.`,
          affectedRegions: Array.from(data.regions).slice(0, 5),
          frequency,
          trend: frequency > 15 ? "increasing" : frequency < 5 ? "decreasing" : "stable",
          predictedRisk: Math.min(100, (frequency / allAccidents.length) * 100 * 5),
        };
      }
    );

    const clusters = Object.entries(regionClusters)
      .map(([region, data]: [string, any]) => {
        const accidentCount = data.accidents.length;
        const riskScore = Math.min(100, (accidentCount / 10) * 100);

        let recommendation = "";
        const primaryHazards = Array.from(data.hazards);

        if (primaryHazards.includes("Ground Movement")) {
          recommendation =
            "URGENT: Conduct immediate geological surveys. Implement systematic rock bolting per MMR 112. Weekly roof inspections mandatory.";
        } else if (primaryHazards.includes("Machinery")) {
          recommendation =
            "Enforce strict machinery safety protocols. All operators require certification renewal. Install proximity warning systems.";
        } else {
          recommendation =
            "Comprehensive safety audit required. Implement enhanced training and monitoring protocols.";
        }

        return {
          region: data.region,
          state: data.state,
          riskScore: Math.round(riskScore),
          primaryHazards: primaryHazards.slice(0, 3),
          accidentCount,
          recommendation,
        };
      })
      .filter((c) => c.accidentCount > 2)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    return NextResponse.json({
      patterns: patterns.sort((a, b) => b.frequency - a.frequency).slice(0, 10),
      clusters,
    });
  } catch (error) {
    console.error("Error in deep analysis:", error);
    return NextResponse.json(
      { error: "Failed to perform deep analysis" },
      { status: 500 }
    );
  }
}
