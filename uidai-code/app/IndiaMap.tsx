"use client";

import React from "react";

interface StateData {
  state: string;
  enrollments: number;
  code: string;
}

interface IndiaMapProps {
  stateData: StateData[];
}

// Simplified India map with major states - coordinates for SVG paths
// Using approximate state boundaries for visualization
const IndiaMap: React.FC<IndiaMapProps> = ({ stateData }) => {
  // Create a color scale based on enrollment density
  const getColorForState = (stateName: string): string => {
    const state = stateData.find(
      (s) =>
        s.state.toLowerCase().includes(stateName.toLowerCase()) ||
        stateName.toLowerCase().includes(s.state.toLowerCase()),
    );

    if (!state) return "#e0e0e0";

    const maxEnrollments = Math.max(...stateData.map((s) => s.enrollments));
    const ratio = state.enrollments / maxEnrollments;

    // Color scale from light blue to dark blue
    if (ratio > 0.8) return "#1e3a8a"; // Very high
    if (ratio > 0.6) return "#3b82f6"; // High
    if (ratio > 0.4) return "#60a5fa"; // Medium-high
    if (ratio > 0.2) return "#93c5fd"; // Medium
    return "#dbeafe"; // Low
  };

  const getEnrollmentForState = (stateName: string): string => {
    const state = stateData.find(
      (s) =>
        s.state.toLowerCase().includes(stateName.toLowerCase()) ||
        stateName.toLowerCase().includes(s.state.toLowerCase()),
    );

    if (!state) return "No data";
    return `${(state.enrollments / 1000).toFixed(1)}K`;
  };

  // State path data (simplified for demonstration)
  const states = [
    {
      name: "Jammu & Kashmir",
      path: "M 180 80 L 220 70 L 240 90 L 230 110 L 200 115 L 180 100 Z",
      label: { x: 210, y: 95 },
    },
    {
      name: "Himachal Pradesh",
      path: "M 220 110 L 250 105 L 260 120 L 245 130 L 225 125 Z",
      label: { x: 240, y: 118 },
    },
    {
      name: "Punjab",
      path: "M 200 115 L 230 110 L 235 125 L 215 135 L 200 130 Z",
      label: { x: 217, y: 123 },
    },
    {
      name: "Uttarakhand",
      path: "M 250 125 L 280 120 L 285 140 L 265 145 L 250 140 Z",
      label: { x: 267, y: 132 },
    },
    {
      name: "Haryana",
      path: "M 215 135 L 245 130 L 250 150 L 230 155 L 215 150 Z",
      label: { x: 232, y: 143 },
    },
    {
      name: "Delhi",
      path: "M 230 145 L 237 142 L 240 148 L 235 152 Z",
      label: { x: 235, y: 147 },
    },
    {
      name: "Rajasthan",
      path: "M 180 140 L 230 135 L 240 180 L 200 200 L 170 180 Z",
      label: { x: 205, y: 165 },
    },
    {
      name: "Uttar Pradesh",
      path: "M 245 140 L 330 135 L 340 180 L 250 185 L 245 155 Z",
      label: { x: 290, y: 160 },
    },
    {
      name: "Gujarat",
      path: "M 145 185 L 200 180 L 205 240 L 160 250 L 135 220 Z",
      label: { x: 170, y: 215 },
    },
    {
      name: "Madhya Pradesh",
      path: "M 205 185 L 300 180 L 305 240 L 210 245 Z",
      label: { x: 255, y: 212 },
    },
    {
      name: "Bihar",
      path: "M 330 155 L 380 150 L 385 175 L 335 180 Z",
      label: { x: 357, y: 165 },
    },
    {
      name: "West Bengal",
      path: "M 380 170 L 410 165 L 420 200 L 395 210 L 380 195 Z",
      label: { x: 400, y: 185 },
    },
    {
      name: "Jharkhand",
      path: "M 340 185 L 380 180 L 385 210 L 345 215 Z",
      label: { x: 362, y: 197 },
    },
    {
      name: "Odisha",
      path: "M 345 220 L 390 215 L 395 265 L 350 270 Z",
      label: { x: 370, y: 245 },
    },
    {
      name: "Chhattisgarh",
      path: "M 300 215 L 345 210 L 350 260 L 305 265 Z",
      label: { x: 325, y: 237 },
    },
    {
      name: "Maharashtra",
      path: "M 210 250 L 305 245 L 310 310 L 220 320 L 200 290 Z",
      label: { x: 255, y: 280 },
    },
    {
      name: "Goa",
      path: "M 195 315 L 210 310 L 215 325 L 200 330 Z",
      label: { x: 207, y: 320 },
    },
    {
      name: "Karnataka",
      path: "M 210 325 L 280 315 L 285 380 L 215 390 Z",
      label: { x: 247, y: 352 },
    },
    {
      name: "Andhra Pradesh",
      path: "M 285 320 L 340 315 L 345 370 L 290 375 Z",
      label: { x: 312, y: 345 },
    },
    {
      name: "Telangana",
      path: "M 285 280 L 330 275 L 335 310 L 290 315 Z",
      label: { x: 312, y: 295 },
    },
    {
      name: "Kerala",
      path: "M 215 395 L 250 385 L 255 435 L 220 445 Z",
      label: { x: 235, y: 415 },
    },
    {
      name: "Tamil Nadu",
      path: "M 255 380 L 310 375 L 315 440 L 260 445 Z",
      label: { x: 285, y: 410 },
    },
    {
      name: "Assam",
      path: "M 420 165 L 480 155 L 490 185 L 430 190 Z",
      label: { x: 455, y: 172 },
    },
    {
      name: "Meghalaya",
      path: "M 430 195 L 465 190 L 470 205 L 435 210 Z",
      label: { x: 450, y: 200 },
    },
    {
      name: "Manipur",
      path: "M 490 195 L 510 190 L 515 215 L 495 220 Z",
      label: { x: 502, y: 205 },
    },
    {
      name: "Tripura",
      path: "M 450 210 L 470 205 L 475 225 L 455 230 Z",
      label: { x: 462, y: 217 },
    },
    {
      name: "Mizoram",
      path: "M 475 230 L 495 225 L 500 250 L 480 255 Z",
      label: { x: 487, y: 240 },
    },
    {
      name: "Nagaland",
      path: "M 485 165 L 510 160 L 515 185 L 490 190 Z",
      label: { x: 500, y: 175 },
    },
    {
      name: "Arunachal Pradesh",
      path: "M 450 125 L 530 115 L 540 155 L 460 165 Z",
      label: { x: 490, y: 140 },
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Aadhaar Enrollment Density by State
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#1e3a8a]"></div>
            <span>Very High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#3b82f6]"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#60a5fa]"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#93c5fd]"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#e0e0e0]"></div>
            <span>No Data</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <svg
          viewBox="0 0 650 550"
          className="w-full h-auto"
          style={{ maxHeight: "600px" }}
        >
          {/* Map background */}
          <rect x="0" y="0" width="650" height="550" fill="#f8fafc" />

          {/* State paths */}
          <g>
            {states.map((state, index) => (
              <g key={index}>
                <path
                  d={state.path}
                  fill={getColorForState(state.name)}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
                >
                  <title>{`${state.name}: ${getEnrollmentForState(state.name)} enrollments`}</title>
                </path>
                {/* State labels */}
                <text
                  x={state.label.x}
                  y={state.label.y}
                  fontSize="9"
                  fontWeight="600"
                  fill="#374151"
                  textAnchor="middle"
                  className="pointer-events-none"
                  style={{ textShadow: "0 0 3px white, 0 0 3px white" }}
                >
                  {state.name.split(" ")[0]}
                </text>
              </g>
            ))}
          </g>

          {/* Title */}
          <text
            x="325"
            y="30"
            fontSize="20"
            fontWeight="bold"
            fill="#1f2937"
            textAnchor="middle"
          >
            India - Aadhaar Enrollment Density Map
          </text>
        </svg>
      </div>

      {/* Statistics below map */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Total States</div>
          <div className="text-2xl font-bold text-gray-900">
            {stateData.length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Highest</div>
          <div className="text-lg font-bold text-blue-600">
            {stateData[0]?.state || "N/A"}
          </div>
          <div className="text-sm text-gray-500">
            {(stateData[0]?.enrollments / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Total Enrollments</div>
          <div className="text-2xl font-bold text-gray-900">
            {(
              stateData.reduce((sum, s) => sum + s.enrollments, 0) / 1000000
            ).toFixed(2)}
            M
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Average per State</div>
          <div className="text-2xl font-bold text-gray-900">
            {(
              stateData.reduce((sum, s) => sum + s.enrollments, 0) /
              stateData.length /
              1000
            ).toFixed(1)}
            K
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
