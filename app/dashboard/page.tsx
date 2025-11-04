"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, TrendingUp, MapPin, Clock } from "lucide-react";

interface AccidentData {
  year: string;
  accidents: any[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [accidentData, setAccidentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load accident data
    fetch("/api/accidents/stats")
      .then((res) => res.json())
      .then((data) => {
        setAccidentData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load accident data:", err);
        setLoading(false);
      });
  }, []);

  // Filter data based on selections
  const filteredData = accidentData.filter((accident) => {
    const yearMatch = selectedYear === "all" || accident.year === selectedYear;
    const stateMatch =
      selectedState === "all" || accident.state === selectedState;
    return yearMatch && stateMatch;
  });

  // Calculate statistics
  const totalAccidents = filteredData.length;
  const totalVictims = filteredData.reduce(
    (sum, acc) => sum + (acc.victims?.length || 0),
    0
  );

  // Group by cause category
  const causeCategoryData = filteredData.reduce((acc: any, curr) => {
    const category = curr.cause_category || "Unknown";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(causeCategoryData).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Monthly trend
  const monthlyData = filteredData.reduce((acc: any, curr) => {
    const month = curr.month || "Unknown";
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const lineChartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    accidents: count,
  }));

  // State-wise data
  const stateData = filteredData.reduce((acc: any, curr) => {
    const state = curr.state || "Unknown";
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(stateData)
    .map(([state, count]) => ({
      state,
      accidents: count,
    }))
    .sort((a, b) => (b.accidents as number) - (a.accidents as number))
    .slice(0, 10);

  // Get unique years and states for filters
  const years = ["all", ...new Set(accidentData.map((a) => a.year))];
  const states = ["all", ...new Set(accidentData.map((a) => a.state))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accident data...</p>
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
              Mining Safety Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              DGMS India Accident Analysis (2015-2022)
            </p>
          </div>

          <div className="flex gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year === "all" ? "All Years" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state === "all" ? "All States" : state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Accidents
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAccidents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Recorded incidents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Victims
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVictims}</div>
              <p className="text-xs text-muted-foreground mt-1">
                People affected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Cause</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {pieChartData[0]?.name || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {pieChartData[0]?.value || 0} incidents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Affected State
              </CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {barChartData[0]?.state || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {barChartData[0]?.accidents || 0} incidents
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accidents by Cause Category */}
          <Card>
            <CardHeader>
              <CardTitle>Accidents by Cause Category</CardTitle>
              <CardDescription>
                Distribution of accidents across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* State-wise Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 States by Accidents</CardTitle>
              <CardDescription>
                States with highest accident frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accidents" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Accident Trend</CardTitle>
            <CardDescription>
              Accident frequency over time periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accidents"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Accidents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Accidents</CardTitle>
            <CardDescription>Latest recorded incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.slice(0, 5).map((accident, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">
                        {accident.cause_category}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {accident.date}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      {accident.mine_name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {accident.location?.district}, {accident.location?.state}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {accident.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
