import { NextResponse } from "next/server";
import accidentData from "@/rag/accident_data.json";

export async function GET() {
  try {
    // Flatten all accident data
    const allAccidents: any[] = [];
    
    Object.entries(accidentData).forEach(([key, accidents]: [string, any]) => {
      if (Array.isArray(accidents)) {
        allAccidents.push(...accidents);
      }
    });

    // Analyze patterns
    const causePatterns: Record<string, any> = {};
    const regionClusters: Record<string, any> = {};

    allAccidents.forEach((acc) => {
      const cause = acc.cause_category || "Unknown";
      const state = acc.location?.state || "Unknown";
      const district = acc.location?.district || "Unknown";

      // Track cause patterns
      if (!causePatterns[cause]) {
        causePatterns[cause] = {
          frequency: 0,
          regions: new Set(),
          trend: "stable",
        };
      }
      causePatterns[cause].frequency++;
      causePatterns[cause].regions.add(state);

      // Track regional clusters
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

    // Generate hazard patterns
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
          description: `${frequency} incidents of ${type} identified across multiple regions. Pattern analysis shows ${
            severity === "critical" ? "immediate" : "ongoing"
          } risk requiring attention.`,
          affectedRegions: Array.from(data.regions).slice(0, 5),
          frequency,
          trend: frequency > 15 ? "increasing" : "stable",
          predictedRisk: Math.min(100, (frequency / allAccidents.length) * 100 * 5),
        };
      }
    );

    // Generate risk clusters
    const clusters = Object.entries(regionClusters)
      .map(([region, data]: [string, any]) => {
        const accidentCount = data.accidents.length;
        const riskScore = Math.min(100, (accidentCount / 10) * 100);

        let recommendation = "";
        const primaryHazards = Array.from(data.hazards);

        if (primaryHazards.includes("Ground Movement")) {
          recommendation =
            "Conduct geological surveys and implement systematic rock bolting. Schedule weekly roof inspections.";
        } else if (primaryHazards.includes("Machinery")) {
          recommendation =
            "Enforce machinery safety protocols and operator certification. Install proximity sensors.";
        } else if (primaryHazards.includes("Transport")) {
          recommendation =
            "Review haul road conditions and implement speed limits. Install warning systems at intersections.";
        } else {
          recommendation =
            "Conduct comprehensive safety audit and implement targeted training programs.";
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
    console.error("Error analyzing hazards:", error);
    return NextResponse.json(
      { error: "Failed to analyze hazard patterns" },
      { status: 500 }
    );
  }
}
