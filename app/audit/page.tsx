"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Shield,
  Loader2,
} from "lucide-react";

interface AuditReport {
  id: string;
  generatedAt: string;
  period: string;
  summary: {
    totalAccidents: number;
    criticalViolations: number;
    complianceScore: number;
    highRiskAreas: string[];
  };
  findings: {
    category: string;
    severity: "critical" | "major" | "minor";
    count: number;
    description: string;
    regulation: string;
  }[];
  recommendations: {
    priority: "high" | "medium" | "low";
    action: string;
    regulation: string;
    affectedMines: string[];
  }[];
}

export default function SafetyAuditReports() {
  const [selectedYear, setSelectedYear] = useState<string>("2022");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);

  const generateReport = async () => {
    setGenerating(true);

    try {
      const response = await fetch("/api/audit/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: selectedYear,
          state: selectedState,
        }),
      });

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const reportText = `
MINING SAFETY AUDIT REPORT
Generated: ${new Date(report.generatedAt).toLocaleString()}
Period: ${report.period}

EXECUTIVE SUMMARY
================
Total Accidents: ${report.summary.totalAccidents}
Critical Violations: ${report.summary.criticalViolations}
Compliance Score: ${report.summary.complianceScore}%
High-Risk Areas: ${report.summary.highRiskAreas.join(", ")}

FINDINGS
========
${report.findings.map((f) => `
${f.category} (${f.severity.toUpperCase()})
Count: ${f.count}
Description: ${f.description}
Regulation: ${f.regulation}
`).join("\n")}

RECOMMENDATIONS
===============
${report.recommendations.map((r) => `
Priority: ${r.priority.toUpperCase()}
Action: ${r.action}
Regulation: ${r.regulation}
Affected Mines: ${r.affectedMines.join(", ")}
`).join("\n")}
    `;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `safety-audit-report-${selectedYear}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "major":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "minor":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Automated Safety Audit Reports
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered analysis of mining safety compliance
            </p>
          </div>
        </div>

        {/* Report Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Audit Report
            </CardTitle>
            <CardDescription>
              Select parameters to generate a comprehensive safety audit report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"].map(
                      (year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                    <SelectItem value="Odisha">Odisha</SelectItem>
                    <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateReport}
                disabled={generating}
                className="min-w-[150px]"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Display */}
        {report && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Accidents
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {report.summary.totalAccidents}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Critical Violations
                  </CardTitle>
                  <Shield className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {report.summary.criticalViolations}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Compliance Score
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {report.summary.complianceScore}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Report Actions
                  </CardTitle>
                  <Download className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={downloadReport}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* High-Risk Areas Alert */}
            {report.summary.highRiskAreas.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>High-Risk Areas Identified</AlertTitle>
                <AlertDescription>
                  {report.summary.highRiskAreas.join(", ")}
                </AlertDescription>
              </Alert>
            )}

            {/* Findings */}
            <Card>
              <CardHeader>
                <CardTitle>Audit Findings</CardTitle>
                <CardDescription>
                  Detailed analysis of safety violations and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.findings.map((finding, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border rounded-lg ${getSeverityColor(
                        finding.severity
                      )}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{finding.category}</h4>
                          <Badge variant="outline" className="mt-1">
                            {finding.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-2xl font-bold">
                          {finding.count}
                        </span>
                      </div>
                      <p className="text-sm mt-2">{finding.description}</p>
                      <p className="text-xs mt-2 font-mono">
                        Regulation: {finding.regulation}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Safety Recommendations</CardTitle>
                <CardDescription>
                  Prioritized actions for compliance and risk mitigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getPriorityColor(rec.priority) as any}>
                              {rec.priority.toUpperCase()} PRIORITY
                            </Badge>
                          </div>
                          <p className="font-medium">{rec.action}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Regulation: {rec.regulation}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-700">
                          <strong>Affected Mines:</strong>{" "}
                          {rec.affectedMines.slice(0, 3).join(", ")}
                          {rec.affectedMines.length > 3 &&
                            ` +${rec.affectedMines.length - 3} more`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
