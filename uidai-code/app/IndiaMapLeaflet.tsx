"use client";

import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoJsonObject } from "geojson";

interface StateData {
  state: string;
  enrollments: number;
  code: string;
  districts?: number;
  pincodes?: number;
}

interface IndiaMapProps {
  stateData: StateData[];
}

type ColorScheme = "blue" | "green" | "red" | "purple";
type MapStyle = "street" | "satellite" | "terrain";

// Component to fit map bounds
function FitBounds({ geoJsonData }: { geoJsonData: GeoJsonObject | null }) {
  const map = useMap();

  useEffect(() => {
    if (geoJsonData) {
      const geoJsonLayer = L.geoJSON(geoJsonData);
      const bounds = geoJsonLayer.getBounds();
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geoJsonData, map]);

  return null;
}

const IndiaMapLeaflet: React.FC<IndiaMapProps> = ({ stateData }) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("blue");
  const [mapStyle, setMapStyle] = useState<MapStyle>("street");
  const [showLabels, setShowLabels] = useState(true);
  const [intensityThreshold, setIntensityThreshold] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    // Load GeoJSON data
    fetch("/india-states.geojson")
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
        setLoading(false);
      });
  }, []);

  // Color schemes
  const colorSchemes: Record<ColorScheme, string[]> = {
    blue: ["#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6", "#1e3a8a"],
    green: ["#d1fae5", "#6ee7b7", "#34d399", "#10b981", "#065f46"],
    red: ["#fee2e2", "#fca5a5", "#f87171", "#ef4444", "#991b1b"],
    purple: ["#e9d5ff", "#c084fc", "#a855f7", "#9333ea", "#581c87"],
  };

  // Map tile URLs
  const mapTiles: Record<MapStyle, { url: string; attribution: string }> = {
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    },
  };

  // Filter data based on threshold and search
  const filteredData = useMemo(() => {
    const maxEnrollments = Math.max(...stateData.map((s) => s.enrollments));
    const minThreshold = (intensityThreshold / 100) * maxEnrollments;

    return stateData.filter((state) => {
      const meetsThreshold = state.enrollments >= minThreshold;
      const matchesSearch =
        searchQuery === "" ||
        state.state.toLowerCase().includes(searchQuery.toLowerCase());
      return meetsThreshold && matchesSearch;
    });
  }, [stateData, intensityThreshold, searchQuery]);

  // Get color for a state based on enrollment density
  const getColor = (stateName: string): string => {
    const state = filteredData.find(
      (s) =>
        s.state.toLowerCase().includes(stateName.toLowerCase()) ||
        stateName.toLowerCase().includes(s.state.toLowerCase()),
    );

    if (!state) return "#e0e0e0";

    const maxEnrollments = Math.max(...filteredData.map((s) => s.enrollments));
    const ratio = state.enrollments / maxEnrollments;

    const colors = colorSchemes[colorScheme];

    // 5-tier color scale
    if (ratio > 0.8) return colors[4]; // Very high
    if (ratio > 0.6) return colors[3]; // High
    if (ratio > 0.4) return colors[2]; // Medium-high
    if (ratio > 0.2) return colors[1]; // Medium
    return colors[0]; // Low
  };

  // Get enrollment count for tooltip
  const getEnrollmentInfo = (stateName: string) => {
    const state = stateData.find(
      (s) =>
        s.state.toLowerCase().includes(stateName.toLowerCase()) ||
        stateName.toLowerCase().includes(s.state.toLowerCase()),
    );

    if (!state)
      return { formatted: "No data", count: 0, districts: 0, pincodes: 0 };
    return {
      formatted: `${(state.enrollments / 1000).toFixed(1)}K`,
      count: state.enrollments,
      districts: state.districts || 0,
      pincodes: state.pincodes || 0,
    };
  };

  // Style function for GeoJSON features
  const style = (feature: L.Feature | undefined) => {
    const stateName = feature?.properties?.name;
    return {
      fillColor: getColor(stateName),
      weight: 2,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };

  // Highlight feature on hover
  const highlightFeature = (e: L.LeafletMouseEvent) => {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      color: "#666",
      fillOpacity: 0.9,
    });
    layer.bringToFront();
  };

  // Reset highlight
  const resetHighlight = (e: L.LeafletMouseEvent) => {
    const layer = e.target;
    layer.setStyle(style(layer.feature));
  };

  // Handle each feature
  const onEachFeature = (feature: L.Feature, layer: L.Layer) => {
    const stateName = feature.properties.name;
    const stateCode = feature.properties.code;
    const capital = feature.properties.capital;
    const enrollmentInfo = getEnrollmentInfo(stateName);

    const tooltipContent = `
      <div style="min-width: 220px; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); color: white; padding: 10px; margin: -8px -8px 8px -8px; border-radius: 6px 6px 0 0;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">${stateName}</div>
          <div style="font-size: 11px; opacity: 0.9;">${stateCode} • Capital: ${capital}</div>
        </div>
        <div style="padding: 4px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #6b7280; font-size: 12px;">📊 Enrollments:</span>
            <span style="font-weight: bold; color: #1f2937; font-size: 13px;">${enrollmentInfo.count.toLocaleString()}</span>
          </div>
          ${
            enrollmentInfo.districts > 0
              ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #6b7280; font-size: 12px;">🏘️ Districts:</span>
            <span style="font-weight: 600; color: #1f2937; font-size: 13px;">${enrollmentInfo.districts}</span>
          </div>`
              : ""
          }
          ${
            enrollmentInfo.pincodes > 0
              ? `
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280; font-size: 12px;">📮 Pincodes:</span>
            <span style="font-weight: 600; color: #1f2937; font-size: 13px;">${enrollmentInfo.pincodes}</span>
          </div>`
              : ""
          }
        </div>
      </div>
    `;

    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: "top",
      className: "custom-tooltip-enhanced",
      offset: [0, -10],
    });

    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        highlightFeature(e);
        setSelectedState(stateName);
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        resetHighlight(e);
        setSelectedState(null);
      },
      click: () => {
        setSearchQuery(stateName);
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header with Title */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-3xl font-bold mb-2">
          India Aadhaar Enrollment Choropleth Map
        </h3>
        <p className="text-indigo-100">
          Interactive geographical visualization with real state boundaries and
          enrollment density
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Search State
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type state name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Color Scheme Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎨 Color Scheme
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="blue">Blue (Default)</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="purple">Purple</option>
            </select>
          </div>

          {/* Map Style Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🗺️ Base Map
            </label>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value as MapStyle)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="street">Street Map</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>

          {/* Intensity Threshold */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Min Intensity: {intensityThreshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={intensityThreshold}
              onChange={(e) => setIntensityThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>All</span>
              <span>High only</span>
            </div>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Show State Labels
            </span>
          </label>

          {selectedState && (
            <div className="ml-auto bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2">
              <span className="text-sm text-indigo-700">
                <strong>Selected:</strong> {selectedState}
              </span>
            </div>
          )}
        </div>

        {/* Filter Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <strong className="text-indigo-600">{filteredData.length}</strong>{" "}
            of <strong>{stateData.length}</strong> states
            {intensityThreshold > 0 && (
              <span>
                {" "}
                • Minimum intensity: <strong>{intensityThreshold}%</strong>
              </span>
            )}
            {searchQuery && (
              <span>
                {" "}
                • Search: <strong>&quot;{searchQuery}&quot;</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Enrollment Density Legend
            </p>
            <div className="flex items-center gap-3">
              {colorSchemes[colorScheme].map((color, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div
                    className="w-8 h-6 rounded border border-gray-300 shadow-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {idx === 0 && "Low"}
                    {idx === 1 && "Med-Low"}
                    {idx === 2 && "Medium"}
                    {idx === 3 && "High"}
                    {idx === 4 && "Very High"}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-1 ml-2">
                <div className="w-8 h-6 rounded border border-gray-300 shadow-sm bg-gray-300"></div>
                <span className="text-xs text-gray-600">No Data</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <div>
              💡 <strong>Tip:</strong> Hover over states for details
            </div>
            <div>🖱️ Click a state to filter by name</div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-300">
        <MapContainer
          center={[22.5, 79.0]}
          zoom={5}
          style={{ height: "650px", width: "100%" }}
          zoomControl={true}
          scrollWheelZoom={true}
          key={`${mapStyle}-${colorScheme}`}
        >
          <TileLayer
            attribution={mapTiles[mapStyle].attribution}
            url={mapTiles[mapStyle].url}
          />
          {geoJsonData && (
            <>
              <GeoJSON
                key={`${colorScheme}-${intensityThreshold}-${searchQuery}`}
                data={geoJsonData}
                style={style}
                onEachFeature={onEachFeature}
              />
              <FitBounds geoJsonData={geoJsonData} />
            </>
          )}
        </MapContainer>
      </div>

      {/* Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 shadow-md border border-indigo-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🗺️</span>
            <div className="text-sm font-medium text-indigo-700">
              Total States
            </div>
          </div>
          <div className="text-3xl font-bold text-indigo-900">
            {stateData.length}
          </div>
          <div className="text-xs text-indigo-600 mt-1">
            Showing {filteredData.length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md border border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏆</span>
            <div className="text-sm font-medium text-blue-700">
              Highest State
            </div>
          </div>
          <div className="text-xl font-bold text-blue-900 truncate">
            {stateData[0]?.state || "N/A"}
          </div>
          <div className="text-sm text-blue-600 mt-1">
            {(stateData[0]?.enrollments / 1000).toFixed(1)}K enrollments
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-5 shadow-md border border-cyan-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📊</span>
            <div className="text-sm font-medium text-cyan-700">
              Total Enrollments
            </div>
          </div>
          <div className="text-3xl font-bold text-cyan-900">
            {(
              filteredData.reduce((sum, s) => sum + s.enrollments, 0) / 1000000
            ).toFixed(2)}
            M
          </div>
          <div className="text-xs text-cyan-600 mt-1">Filtered data</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 shadow-md border border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📈</span>
            <div className="text-sm font-medium text-purple-700">
              Average per State
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {(
              filteredData.reduce((sum, s) => sum + s.enrollments, 0) /
              filteredData.length /
              1000
            ).toFixed(1)}
            K
          </div>
          <div className="text-xs text-purple-600 mt-1">Mean enrollment</div>
        </div>
      </div>

      {/* Interactive Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
              💡
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-blue-900 mb-3">
              How to Use This Choropleth Map
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">🖱️</span>
                <div>
                  <strong className="text-blue-900 text-sm">Hover:</strong>
                  <p className="text-sm text-blue-800">
                    Move mouse over states to see detailed tooltips with
                    enrollment stats
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">🔍</span>
                <div>
                  <strong className="text-blue-900 text-sm">Zoom:</strong>
                  <p className="text-sm text-blue-800">
                    Scroll wheel or use +/- controls to zoom in/out on specific
                    regions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">👆</span>
                <div>
                  <strong className="text-blue-900 text-sm">Pan:</strong>
                  <p className="text-sm text-blue-800">
                    Click and drag to move around the map and explore different
                    areas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">🎯</span>
                <div>
                  <strong className="text-blue-900 text-sm">Click:</strong>
                  <p className="text-sm text-blue-800">
                    Click on any state to auto-fill search and focus on that
                    state
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">🎨</span>
                <div>
                  <strong className="text-blue-900 text-sm">
                    Color Schemes:
                  </strong>
                  <p className="text-sm text-blue-800">
                    Switch between blue, green, red, or purple gradients
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">📊</span>
                <div>
                  <strong className="text-blue-900 text-sm">Filter:</strong>
                  <p className="text-sm text-blue-800">
                    Use intensity threshold slider to show only high-enrollment
                    states
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaMapLeaflet;
