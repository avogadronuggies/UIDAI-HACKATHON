"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  apiService,
  Metrics,
  StateData,
  AgeGroup,
  Anomaly,
  Insight,
  TrendsData,
} from "./api";

// Dynamically import Leaflet map to avoid SSR issues
const IndiaMapLeaflet = dynamic(() => import("./IndiaMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

type Props = {
  activeSection: string;
};

const MainContent = ({ activeSection }: Props) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [topStates, setTopStates] = useState<StateData[]>([]);
  const [allStates, setAllStates] = useState<StateData[]>([]);
  const [ageDistribution, setAgeDistribution] = useState<AgeGroup[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [trendsPeriod, setTrendsPeriod] = useState<number>(30);
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Load trends data when period changes
    if (!loading) {
      loadTrendsData(trendsPeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendsPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        metricsData,
        statesData,
        allStatesData,
        demographicsData,
        anomaliesData,
        insightsData,
        trendsDataResponse,
      ] = await Promise.all([
        apiService.getMetrics(),
        apiService.getStates(5),
        apiService.getAllStates(),
        apiService.getDemographics(),
        apiService.getAnomalies(),
        apiService.getInsights(),
        apiService.getTrends(30),
      ]);

      setMetrics(metricsData);
      setTopStates(statesData.top_states);
      setAllStates(allStatesData.states);
      setAgeDistribution(demographicsData.age_distribution);
      setAnomalies(anomaliesData.anomalies);
      setInsights(insightsData.insights);
      setTrendsData(trendsDataResponse);
      setError(null);
    } catch (err) {
      setError(
        "Failed to load data. Make sure the API server is running on http://localhost:8000",
      );
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendsData = async (days: number) => {
    try {
      const trendsDataResponse = await apiService.getTrends(days);
      setTrendsData(trendsDataResponse);
    } catch (err) {
      console.error("Error loading trends data:", err);
    }
  };

  const metricsDisplay = metrics
    ? [
        {
          label: "Total Enrolments",
          value: metrics.total_enrollments_formatted,
          change: `${metrics.records_count.enrollment.toLocaleString()} records`,
        },
        {
          label: "Demographic Updates",
          value: metrics.total_demographic_updates_formatted,
          change: `${metrics.records_count.demographic.toLocaleString()} records`,
        },
        {
          label: "Biometric Updates",
          value: metrics.total_biometric_updates_formatted,
          change: `${metrics.records_count.biometric.toLocaleString()} records`,
        },
        {
          label: "Data Quality Score",
          value: `${metrics.data_quality_score}/100`,
          change: "Cleaned & validated",
        },
      ]
    : [];

  // Placeholder content for other sections
  const placeholders: Record<string, React.ReactNode> = {
    trends: (
      <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Enrollment Trends
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Time series analysis of enrollments and updates
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Period Selector */}
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setTrendsPeriod(7)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  trendsPeriod === 7
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTrendsPeriod(30)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  trendsPeriod === 30
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTrendsPeriod(90)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  trendsPeriod === 90
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                90 Days
              </button>
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setChartType("line")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  chartType === "line"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType("area")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  chartType === "area"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  chartType === "bar"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Bar
              </button>
            </div>
          </div>
        </div>

        {loading || !trendsData ? (
          <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading trends data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Main Time Series Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                All Operations - {trendsData.period}
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                {chartType === "line" ? (
                  <LineChart
                    data={trendsData.dates.map((date, idx) => ({
                      date: new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                      enrollment: trendsData.enrollment[idx],
                      demographic: trendsData.demographic[idx],
                      biometric: trendsData.biometric[idx],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Line
                      type="monotone"
                      dataKey="enrollment"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ fill: "#4f46e5", r: 3 }}
                      name="Enrollments"
                    />
                    <Line
                      type="monotone"
                      dataKey="demographic"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ fill: "#06b6d4", r: 3 }}
                      name="Demographic Updates"
                    />
                    <Line
                      type="monotone"
                      dataKey="biometric"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6", r: 3 }}
                      name="Biometric Updates"
                    />
                  </LineChart>
                ) : chartType === "area" ? (
                  <AreaChart
                    data={trendsData.dates.map((date, idx) => ({
                      date: new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                      enrollment: trendsData.enrollment[idx],
                      demographic: trendsData.demographic[idx],
                      biometric: trendsData.biometric[idx],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Area
                      type="monotone"
                      dataKey="enrollment"
                      stackId="1"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.6}
                      name="Enrollments"
                    />
                    <Area
                      type="monotone"
                      dataKey="demographic"
                      stackId="1"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.6}
                      name="Demographic Updates"
                    />
                    <Area
                      type="monotone"
                      dataKey="biometric"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                      name="Biometric Updates"
                    />
                  </AreaChart>
                ) : (
                  <BarChart
                    data={trendsData.dates.map((date, idx) => ({
                      date: new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                      enrollment: trendsData.enrollment[idx],
                      demographic: trendsData.demographic[idx],
                      biometric: trendsData.biometric[idx],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Bar
                      dataKey="enrollment"
                      fill="#4f46e5"
                      name="Enrollments"
                    />
                    <Bar
                      dataKey="demographic"
                      fill="#06b6d4"
                      name="Demographic Updates"
                    />
                    <Bar
                      dataKey="biometric"
                      fill="#8b5cf6"
                      name="Biometric Updates"
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Individual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enrollments Chart */}
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-lg p-6 border border-indigo-200">
                <h4 className="text-md font-semibold text-indigo-900 mb-4">
                  Enrollments Trend
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={trendsData.dates.map((date, idx) => ({
                      date: new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                      value: trendsData.enrollment[idx],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#c7d2fe" />
                    <XAxis
                      dataKey="date"
                      stroke="#4f46e5"
                      style={{ fontSize: "10px" }}
                    />
                    <YAxis stroke="#4f46e5" style={{ fontSize: "10px" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ fill: "#4f46e5", r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-indigo-700">Total</span>
                  <span className="text-xl font-bold text-indigo-900">
                    {(
                      trendsData.enrollment.reduce((a, b) => a + b, 0) / 1000
                    ).toFixed(1)}
                    K
                  </span>
                </div>
              </div>

              {/* Demographics Chart */}
              <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg shadow-lg p-6 border border-cyan-200">
                <h4 className="text-md font-semibold text-cyan-900 mb-4">
                  Demographic Updates
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={trendsData.dates.map((date, idx) => ({
                      date: new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                      value: trendsData.demographic[idx],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#a5f3fc" />
                    <XAxis
                      dataKey="date"
                      stroke="#06b6d4"
                      style={{ fontSize: "10px" }}
                    />
                    <YAxis stroke="#06b6d4" style={{ fontSize: "10px" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ fill: "#06b6d4", r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-cyan-700">Total</span>
                  <span className="text-xl font-bold text-cyan-900">
                    {(
                      trendsData.demographic.reduce((a, b) => a + b, 0) / 1000
                    ).toFixed(1)}
                    K
                  </span>
                </div>
              </div>

              {/* Biometric Chart */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-lg p-6 border border-purple-200">
                <h4 className="text-md font-semibold text-purple-900 mb-4">
                  Biometric Updates
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={trendsData.dates.map((date, idx) => ({
                      date: new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                      value: trendsData.biometric[idx],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd6fe" />
                    <XAxis
                      dataKey="date"
                      stroke="#8b5cf6"
                      style={{ fontSize: "10px" }}
                    />
                    <YAxis stroke="#8b5cf6" style={{ fontSize: "10px" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6", r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-purple-700">Total</span>
                  <span className="text-xl font-bold text-purple-900">
                    {(
                      trendsData.biometric.reduce((a, b) => a + b, 0) / 1000
                    ).toFixed(1)}
                    K
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                <div className="text-sm text-gray-600">
                  Avg Daily Enrollments
                </div>
                <div className="text-2xl font-bold text-indigo-600 mt-1">
                  {(
                    trendsData.enrollment.reduce((a, b) => a + b, 0) /
                    trendsData.enrollment.length
                  ).toFixed(0)}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                <div className="text-sm text-gray-600">Peak Enrollments</div>
                <div className="text-2xl font-bold text-indigo-600 mt-1">
                  {Math.max(...trendsData.enrollment)}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                <div className="text-sm text-gray-600">Avg Daily Updates</div>
                <div className="text-2xl font-bold text-cyan-600 mt-1">
                  {(
                    (trendsData.demographic.reduce((a, b) => a + b, 0) +
                      trendsData.biometric.reduce((a, b) => a + b, 0)) /
                    trendsData.dates.length
                  ).toFixed(0)}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                <div className="text-sm text-gray-600">Total Operations</div>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {(
                    (trendsData.enrollment.reduce((a, b) => a + b, 0) +
                      trendsData.demographic.reduce((a, b) => a + b, 0) +
                      trendsData.biometric.reduce((a, b) => a + b, 0)) /
                    1000
                  ).toFixed(1)}
                  K
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    ),
    demographics: (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-slate-900 mb-4">
            Age Distribution
          </p>
          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : ageDistribution.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pie Chart */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-900 mb-4">
                  Visual Distribution
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={
                        ageDistribution as unknown as Record<
                          string,
                          number | string
                        >[]
                      }
                      dataKey="percentage"
                      nameKey="group"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry: AgeGroup & { cx?: number; cy?: number }) =>
                        `${entry.group}: ${entry.percentage}%`
                      }
                      labelLine={true}
                    >
                      {ageDistribution.map((entry, index) => {
                        const colors = ["#4f46e5", "#06b6d4", "#8b5cf6"];
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      formatter={(
                        value: number,
                        name: string,
                        props: { payload: AgeGroup },
                      ) => [
                        `${value}% (${props.payload.count.toLocaleString()} people)`,
                        props.payload.group,
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Cards */}
              <div className="space-y-3">
                {ageDistribution.map((age) => (
                  <div
                    key={age.group}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {age.group}
                        </p>
                        <p className="text-sm text-slate-600">
                          {age.count.toLocaleString()} enrollments
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">
                          {age.percentage}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${age.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">No data available</p>
          )}
        </div>
      </div>
    ),
    regions: (
      <div className="space-y-6">
        {/* Leaflet Map */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-sm text-slate-600">Loading map data...</p>
          </div>
        ) : allStates.length > 0 ? (
          <IndiaMapLeaflet stateData={allStates.filter((s) => s.code)} />
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-sm text-slate-600">No data available</p>
          </div>
        )}

        {/* Top States List */}
        <div className="mt-8">
          <p className="text-lg font-semibold text-slate-900 mb-4">
            Top 5 States by Enrollment
          </p>
          <div className="space-y-3">
            {topStates.map((state, idx) => (
              <div
                key={state.state}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {state.state}
                      </p>
                      <p className="text-sm text-slate-600">
                        {state.districts} districts • {state.pincodes} pincodes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">
                      {state.enrollments_formatted}
                    </p>
                    <p className="text-xs text-slate-500">enrollments</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    anomalies: (
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-900">
          Detected Anomalies & Patterns
        </p>
        {loading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : (
          <ul className="space-y-3">
            {anomalies.map((anomaly, idx) => (
              <li
                key={idx}
                className={`rounded-xl px-4 py-3 text-sm ${
                  anomaly.severity === "warning"
                    ? "bg-amber-50 text-amber-800"
                    : "bg-blue-50 text-blue-800"
                }`}
              >
                <p className="font-semibold">{anomaly.message}</p>
                <p className="text-xs mt-1">{anomaly.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    ),
    quality: (
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-900">
          Data Quality Metrics
        </p>
        {metrics && (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Overall Score
              </p>
              <p className="text-3xl font-bold text-emerald-600">
                {metrics.data_quality_score}
              </p>
              <p className="text-sm text-slate-600">Out of 100</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Biometric Success
              </p>
              <p className="text-3xl font-bold text-emerald-600">
                {metrics.biometric_success_rate}%
              </p>
              <p className="text-sm text-slate-600">Success rate</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Total Records
              </p>
              <p className="text-3xl font-bold text-indigo-600">4.3M+</p>
              <p className="text-sm text-slate-600">Cleaned records</p>
            </div>
          </div>
        )}
      </div>
    ),
    settings: (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Settings placeholder - API configuration coming soon
        </p>
      </div>
    ),
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 max-w-md">
          <p className="text-red-800 font-semibold mb-2">⚠️ Connection Error</p>
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-8 py-6 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Unlocking societal trends
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Aadhaar Enrolment & Updates
          </h1>
          <p className="text-sm text-slate-600">
            Real-time data from 4.3M+ cleaned records
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            🔄 Refresh Data
          </button>
        </div>
      </header>

      <div className="space-y-6 p-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading data...</p>
          </div>
        )}

        {!loading && activeSection === "overview" && (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricsDisplay.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-emerald-600">
                    {metric.change}
                  </p>
                </div>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Top States by Enrollment
                    </p>
                    <p className="text-xs text-slate-500">
                      Highest enrollment states
                    </p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    Live
                  </span>
                </div>
                <div className="space-y-3">
                  {topStates.slice(0, 5).map((state, idx) => (
                    <div
                      key={state.state}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-900">
                        {idx + 1}. {state.state}
                      </span>
                      <span className="text-sm font-semibold text-indigo-600">
                        {state.enrollments_formatted}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Detected Patterns
                  </p>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Active
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-slate-700">
                  {anomalies.slice(0, 3).map((anomaly, idx) => (
                    <li key={idx} className="rounded-xl bg-slate-50 px-3 py-3">
                      {anomaly.message}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Key Insights
                </p>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  {insights.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                    >
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-slate-600">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Recommended Actions
                  </p>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Suggested
                  </span>
                </div>
                <ol className="space-y-2 text-sm text-slate-700">
                  {insights.map((insight, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {idx + 1}
                      </span>
                      <span>{insight.action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </>
        )}

        {!loading && activeSection !== "overview" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {placeholders[activeSection] || (
              <p className="text-sm text-slate-600">Section coming soon.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default MainContent;
