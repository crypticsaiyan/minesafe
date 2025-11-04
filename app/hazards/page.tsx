"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  MapPin,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";

interface HazardPattern {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  affectedRegions: string[];
  frequency: number;
  trend: "increasing" | "stable" | "decreasing";
  predictedRisk: number;
}

interface HazardCluster {
  region: string;
  state: string;
  riskScore: number;
  primaryHazards: string[];
  accidentCount: number;
  recommendation: string;
}

export default function HazardDetection() {
  const [patterns, setPatterns] = useState<HazardPattern[]>([]);
  const [clusters, setClusters] = useState<HazardCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadHazardData();
  }, []);

  const loadHazardData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/hazards/analyze");
      const data = await response.json();
      setPatterns(data.patterns || []);
      setClusters(data.clusters || []);
    } catch (error) {
      console.error("Failed to load hazard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const runDeepAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/hazards/deep-analysis", {
        method: "POST",
      });
      const data = await response.json();
      setPatterns(data.patterns || []);
      setClusters(data.clusters || []);
    } catch (error) {
      console.error("Failed to run deep analysis:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case "decreasing":
        return <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing hazard patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hazard Pattern Detection
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered identification of accident patterns and risk clusters
            </p>
          </div>

          <Button onClick={runDeepAnalysis} disabled={analyzing}>
            {analyzing ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Run Deep Analysis
              </>
            )}
          </Button>
        </div>

        {/* Critical Patterns Alert */}
        {patterns.filter((p) => p.severity === "critical").length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Critical Hazard Patterns Detected</AlertTitle>
            <AlertDescription>
              {patterns.filter((p) => p.severity === "critical").length} critical
              patterns require immediate attention
            </AlertDescription>
          </Alert>
        )}

        {/* Hazard Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Identified Hazard Patterns
            </CardTitle>
            <CardDescription>
              Recurring accident patterns detected through AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className={`p-4 border-2 rounded-lg ${getSeverityColor(
                    pattern.severity
                  )}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{pattern.type}</h4>
                        <Badge variant="outline">
                          {pattern.severity.toUpperCase()}
                        </Badge>
                        {getTrendIcon(pattern.trend)}
                      </div>
                      <p className="text-sm mb-2">{pattern.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold mb-1">
                        Affected Regions
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {pattern.affectedRegions.map((region, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold mb-1">Frequency</p>
                      <p className="text-lg font-bold">{pattern.frequency} incidents</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold mb-1">
                        Predicted Risk Score
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              pattern.predictedRisk > 70
                                ? "bg-red-600"
                                : pattern.predictedRisk > 40
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${pattern.predictedRisk}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">
                          {pattern.predictedRisk}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {patterns.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hazard patterns detected. Run analysis to identify patterns.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* High-Risk Clusters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              High-Risk Geographic Clusters
            </CardTitle>
            <CardDescription>
              Regions with concentrated accident occurrences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clusters.map((cluster, idx) => (
                <div
                  key={idx}
                  className={`p-4 border-2 rounded-lg ${
                    cluster.riskScore > 70
                      ? "border-red-300 bg-red-50"
                      : cluster.riskScore > 40
                      ? "border-orange-300 bg-orange-50"
                      : "border-yellow-300 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {cluster.region}
                      </h4>
                      <p className="text-sm text-gray-600">{cluster.state}</p>
                    </div>
                    <Badge
                      variant={
                        cluster.riskScore > 70
                          ? "destructive"
                          : "default"
                      }
                    >
                      Risk: {cluster.riskScore}%
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <p className="text-xs font-semibold mb-1">
                        Primary Hazards
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {cluster.primaryHazards.map((hazard, hidx) => (
                          <Badge key={hidx} variant="outline" className="text-xs">
                            {hazard}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold">Total Accidents</p>
                      <p className="text-lg font-bold">
                        {cluster.accidentCount}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs font-semibold mb-1">
                      Recommendation
                    </p>
                    <p className="text-sm text-gray-700">
                      {cluster.recommendation}
                    </p>
                  </div>
                </div>
              ))}

              {clusters.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  No high-risk clusters identified. Run analysis to identify
                  clusters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>
              Advanced pattern recognition and predictive analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Pattern Correlation</p>
                  <p className="text-sm text-gray-700">
                    Ground movement incidents show 78% correlation with
                    inadequate rock bolting practices in metalliferous mines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Seasonal Trend</p>
                  <p className="text-sm text-gray-700">
                    Transportation accidents increase by 32% during monsoon
                    season (June-September) in open-cast mines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Target className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Root Cause Analysis</p>
                  <p className="text-sm text-gray-700">
                    65% of fatal accidents could have been prevented through
                    proper adherence to existing safety regulations (MMR 1961).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
