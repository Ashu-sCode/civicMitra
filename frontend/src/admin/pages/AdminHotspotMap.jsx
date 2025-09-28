// src/pages/AdminHotspotMap.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import toast from "react-hot-toast";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icons based on priority
const createCustomIcon = (priority, status) => {
  const colors = {
    High: "#dc2626",
    Medium: "#f59e0b",
    Low: "#10b981",
  };

  const statusOpacity = {
    Resolved: 0.5,
    Pending: 1,
    "In Progress": 0.8,
  };

  //   <style jsx>{`
  //     .leaflet-popup-content-wrapper {
  //       border-radius: 12px;
  //       box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  //     }
  //     .leaflet-popup-tip {
  //       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  //     }
  //     .custom-marker {
  //       background: transparent;
  //       border: none;
  //     }
  //     .custom-marker > div > div > div {
  //       transition: transform 0.3s ease;
  //     }
  //     .custom-marker:hover > div > div > div {
  //       transform: scale(1.1);
  //     }
  //     @keyframes bounce {
  //       0%,
  //       100% {
  //         transform: translateY(0);
  //       }
  //       50% {
  //         transform: translateY(-5px);
  //       }
  //     }
  //     .animate-bounce {
  //       animation: bounce 2s infinite;
  //     }
  //   `}</style>;

  const color = colors[priority] || colors.Low;
  const opacity = statusOpacity[status] || 1;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        opacity: ${opacity};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ${priority === "High" ? "!" : priority === "Medium" ? "•" : ""}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Map bounds updater component
const MapBoundsUpdater = ({ reports }) => {
  const map = useMap();

  useEffect(() => {
    if (reports.length > 0) {
      const validReports = reports.filter((r) => r.lat && r.lng);
      if (validReports.length > 0) {
        const bounds = L.latLngBounds(validReports.map((r) => [r.lat, r.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [reports, map]);

  return null;
};

const AdminHotspotMap = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [mapStyle, setMapStyle] = useState("default");

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");

      const data = await res.json();

      // Parse addressData if it's a string
      const parsedData = data.map((r) => {
        let addressData = {};
        try {
          addressData =
            typeof r.addressData === "string"
              ? JSON.parse(r.addressData)
              : r.addressData || {};
        } catch {
          addressData = {};
        }

        return {
          ...r,
          addressData,
          status: r.status || "Pending",
          priority: r.priority || "Low",
        };
      });

      setReports(parsedData);
    } catch (err) {
      console.error("Error fetching reports:", err);
      toast.error("Failed to load reports for map");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (!report.lat || !report.lng) return false;
      if (filterPriority !== "All" && report.priority !== filterPriority)
        return false;
      if (filterStatus !== "All" && report.status !== filterStatus)
        return false;
      if (filterCategory !== "All" && report.category !== filterCategory)
        return false;
      return true;
    });
  }, [reports, filterPriority, filterStatus, filterCategory]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: filteredReports.length,
      high: filteredReports.filter((r) => r.priority === "High").length,
      medium: filteredReports.filter((r) => r.priority === "Medium").length,
      low: filteredReports.filter((r) => r.priority === "Low").length,
      resolved: filteredReports.filter((r) => r.status === "Resolved").length,
      pending: filteredReports.filter((r) => r.status === "Pending").length,
    };
  }, [filteredReports]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(reports.map((r) => r.category).filter(Boolean))];
  }, [reports]);

  const getTileLayerUrl = () => {
    const styles = {
      default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      satellite:
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    };
    return styles[mapStyle] || styles.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Loading map data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Issue Hotspot Map
          </h1>
          <p className="text-blue-100">
            Geographic visualization of all reported civic issues
          </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Map Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Map Style
              </label>
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default</option>
                <option value="dark">Dark</option>
                <option value="satellite">Satellite</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(filterPriority !== "All" ||
            filterStatus !== "All" ||
            filterCategory !== "All") && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setFilterPriority("All");
                  setFilterStatus("All");
                  setFilterCategory("All");
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-blue-500">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {stats.total}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Markers
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-red-500">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {stats.high}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              High Priority
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-yellow-500">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {stats.medium}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Medium
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-green-500">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {stats.low}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Low Priority
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-yellow-400">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {stats.pending}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Pending
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-green-400">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {stats.resolved}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Resolved
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white dark:bg-gray-800 relative z-0 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <MapContainer
            center={[23.3441, 85.3096]}
            zoom={7}
            scrollWheelZoom={true}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer
              url={getTileLayerUrl()}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {filteredReports.map((report) => {
              const getMarkerIcon = (priority, status) => {
                const colors = {
                  High: "#dc2626",
                  Medium: "#ea580c",
                  Low: "#16a34a",
                };

                const bgColor = colors[priority] || "#6b7280";
                const opacity = status === "Resolved" ? "0.6" : "1";

                return L.divIcon({
                  className: "custom-marker",
                  html: `
            <div class="marker-pin" style="color: ${bgColor}; opacity: ${opacity}">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
                  iconSize: [30, 40],
                  iconAnchor: [15, 40],
                });
              };

              return (
                <Marker
                  key={report.id}
                  position={[report.lat, report.lng]}
                  icon={getMarkerIcon(report.priority, report.status)}
                >
                  <Popup className="custom-popup" maxWidth={320}>
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-3 pb-2 border-b border-gray-200">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Report ID
                          </div>
                          <div className="font-mono text-sm font-semibold text-gray-700">
                            #{report.id}
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-medium ${
                            report.priority === "High"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : report.priority === "Medium"
                              ? "bg-orange-50 text-orange-700 border border-orange-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                          }`}
                        >
                          {report.priority} Priority
                        </span>
                      </div>

                      <h4 className="font-semibold text-base text-gray-900 mb-2">
                        {report.category}
                      </h4>

                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Status: </span>
                        <span
                          className={`text-xs font-medium ${
                            report.status === "Resolved"
                              ? "text-green-700"
                              : report.status === "In Progress"
                              ? "text-blue-700"
                              : "text-yellow-700"
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>

                      {report.addressData?.address && (
                        <div className="bg-gray-50 rounded p-2 mb-3">
                          <p className="text-xs text-gray-600">
                            <strong className="text-gray-700">Location:</strong>
                            <br />
                            <span className="text-gray-700">
                              {[
                                report.addressData?.address,
                                report.addressData?.city,
                                report.addressData?.state,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </p>
                        </div>
                      )}

                      {report.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          <strong className="text-gray-700">
                            Description:
                          </strong>{" "}
                          {report.description}
                        </p>
                      )}

                      <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-4 rounded transition-colors">
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Map Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority Markers
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
                    !
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    High Priority
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
                    •
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Medium Priority
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-md"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Low Priority
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status Indication
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md"
                    style={{ opacity: 1 }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Pending (Full opacity)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow-md"
                    style={{ opacity: 0.8 }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    In Progress (80% opacity)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-md"
                    style={{ opacity: 0.5 }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Resolved (50% opacity)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHotspotMap;
