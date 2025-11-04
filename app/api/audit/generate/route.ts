import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import accidentData from "@/rag/accident_data.json";

export async function POST(req: NextRequest) {
  try {
    const { year, state } = await req.json();

    // Process accident data for the selected year/state
    let accidents: any[] = [];
    
    Object.entries(accidentData).forEach(([key, yearAccidents]: [string, any]) => {
      if (Array.isArray(yearAccidents)) {
        accidents = accidents.concat(
          yearAccidents.filter((acc) => {
            const accYear = key.includes(year);
            const accState = state === "all" || acc.location?.state === state;
            return accYear && accState;
          })
        );
      }
    });

    // Analyze patterns
    const causeCategories: Record<string, number> = {};
    const regulations: Record<string, number> = {};
    const mineNames: string[] = [];

    accidents.forEach((acc) => {
      const category = acc.cause_category || "Unknown";
      causeCategories[category] = (causeCategories[category] || 0) + 1;

      if (acc.avertable_factors) {
        const regMatch = acc.avertable_factors.match(/Regulation \d+/g);
        if (regMatch) {
          regMatch.forEach((reg: string) => {
            regulations[reg] = (regulations[reg] || 0) + 1;
          });
        }
      }

      if (acc.mine_name) {
        mineNames.push(acc.mine_name);
      }
    });

    // Generate findings
    const findings = Object.entries(causeCategories)
      .map(([category, count]) => {
        const severity =
          count > 10 ? "critical" : count > 5 ? "major" : "minor";
        return {
          category,
          severity,
          count,
          description: `${count} incidents of ${category} recorded in ${year}${
            state !== "all" ? ` in ${state}` : ""
          }. This represents ${((count / accidents.length) * 100).toFixed(
            1
          )}% of total accidents.`,
          regulation:
            Object.keys(regulations)[0] || "MMR 1961 General Safety",
        };
      })
      .sort((a, b) => b.count - a.count);

    // Generate recommendations
    const recommendations = findings.slice(0, 5).map((finding) => {
      let action = "";
      let priority: "high" | "medium" | "low" = "medium";

      if (finding.category.includes("Ground Movement")) {
        action =
          "Implement systematic rock bolting and roof support inspection protocols. Schedule weekly geological surveys.";
        priority = "high";
      } else if (finding.category.includes("Machinery")) {
        action =
          "Enforce mandatory machinery safety checks and operator training certification programs.";
        priority = "high";
      } else if (finding.category.includes("Electrical")) {
        action =
          "Conduct electrical safety audits and upgrade insulation systems. Ensure proper earthing.";
        priority = "high";
      } else if (finding.category.includes("Transport")) {
        action =
          "Review transportation protocols and implement speed limits. Install proximity warning systems.";
        priority = "medium";
      } else {
        action = `Conduct targeted safety training for ${finding.category.toLowerCase()} hazards.`;
        priority = finding.severity === "critical" ? "high" : "medium";
      }

      return {
        priority,
        action,
        regulation: finding.regulation,
        affectedMines: mineNames.slice(0, Math.min(5, mineNames.length)),
      };
    });

    // Calculate compliance score
    const criticalViolations = findings.filter(
      (f) => f.severity === "critical"
    ).length;
    const complianceScore = Math.max(
      0,
      100 - criticalViolations * 10 - findings.length * 2
    );

    // Identify high-risk areas
    const highRiskAreas = findings
      .filter((f) => f.severity === "critical")
      .map((f) => f.category);

    const report = {
      id: `AUDIT-${year}-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      period: `${year}${state !== "all" ? ` - ${state}` : ""}`,
      summary: {
        totalAccidents: accidents.length,
        criticalViolations,
        complianceScore: Math.round(complianceScore),
        highRiskAreas,
      },
      findings,
      recommendations,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating audit report:", error);
    return NextResponse.json(
      { error: "Failed to generate audit report" },
      { status: 500 }
    );
  }
}
