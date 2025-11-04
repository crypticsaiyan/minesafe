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
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  X,
} from "lucide-react";

interface SafetyAlert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  region: string;
  acknowledged: boolean;
  actionRequired: string;
}

export default function AlertsMonitoring() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [monitoring, setMonitoring] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/alerts/list");
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error("Failed to load alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId }),
      });

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      );
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  };

  const dismissAlert = async (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const startMonitoring = () => {
    setMonitoring(true);
    // In production, this would set up real-time monitoring
    setTimeout(() => {
      setMonitoring(false);
    }, 3000);
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "warning":
        return "border-orange-500 bg-orange-50";
      case "info":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <Bell className="h-5 w-5 text-orange-600" />;
      case "info":
        return <Eye className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const criticalCount = alerts.filter(
    (a) => a.type === "critical" && !a.acknowledged
  ).length;
  const warningCount = alerts.filter(
    (a) => a.type === "warning" && !a.acknowledged
  ).length;
  const acknowledgedCount = alerts.filter((a) => a.acknowledged).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alerts...</p>
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
              Safety Alerts & Monitoring
            </h1>
            <p className="text-gray-600 mt-1">
              Autonomous safety monitoring and alert system
            </p>
          </div>

          <Button onClick={startMonitoring} disabled={monitoring}>
            {monitoring ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Scanning...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Start Monitoring
              </>
            )}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {criticalCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Require immediate action
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {warningCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Preventive actions needed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Acknowledged
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {acknowledgedCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Being addressed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>
              Real-time safety notifications and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts
                .filter((a) => !a.acknowledged)
                .map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border-l-4 rounded-lg ${getAlertColor(
                      alert.type
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{alert.title}</h4>
                            <Badge
                              variant={
                                alert.type === "critical"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {alert.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                            <span>Region: {alert.region}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-semibold mb-1">
                        Recommended Action:
                      </p>
                      <p className="text-sm text-gray-700">
                        {alert.actionRequired}
                      </p>
                    </div>
                  </div>
                ))}

              {alerts.filter((a) => !a.acknowledged).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No active alerts. All systems operational.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Acknowledged Alerts */}
        {acknowledgedCount > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Acknowledged Alerts</CardTitle>
              <CardDescription>
                Alerts being addressed by operators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts
                  .filter((a) => a.acknowledged)
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 border rounded-lg bg-gray-50 opacity-75"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">
                            {alert.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {alert.message}
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monitoring Status */}
        <Card>
          <CardHeader>
            <CardTitle>Autonomous Monitoring Status</CardTitle>
            <CardDescription>
              Real-time scanning of DGMS updates and mine inspection reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">DGMS Data Feed</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Pattern Detection Engine</span>
                </div>
                <Badge variant="secondary">Running</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Risk Assessment AI</span>
                </div>
                <Badge variant="secondary">Operational</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
