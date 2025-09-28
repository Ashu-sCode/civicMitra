

// src/pages/ReportListPage.jsx
import React, { useEffect, useState } from "react";
import ReportCard from "../components/report/ReportCard";
import toast from "react-hot-toast";

const ReportListPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");

      const data = await res.json();

      const safeData = data.map((r) => ({
        id: r.id,
        category: r.category || "Unknown",
        description: r.description || "",
        mediaFiles:
          typeof r.mediaFiles === "string" ? JSON.parse(r.mediaFiles) : r.mediaFiles || [],
        priority: r.priority || "Low",
        status: r.status || "Pending",
        addressData:
          typeof r.addressData === "string"
            ? JSON.parse(r.addressData)
            : r.addressData || { address: "", city: "", state: "", country: "India" },
        createdAt: r.createdAt || new Date().toISOString(),
      }));

      setReports(safeData);
      setFilteredReports(safeData);
    } catch (err) {
      console.error("Error fetching reports:", err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...reports];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (report) =>
          report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.addressData?.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "All") {
      filtered = filtered.filter((report) => report.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== "All") {
      filtered = filtered.filter((report) => report.priority === filterPriority);
    }

    setFilteredReports(filtered);
  }, [searchQuery, filterStatus, filterPriority, reports]);

  const LoadingSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 h-24" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Civic Issue Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and monitor all submitted civic issues
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by category, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="All">All Priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Showing {filteredReports.length} of {reports.length} reports
            </span>
            {(searchQuery || filterStatus !== "All" || filterPriority !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("All");
                  setFilterPriority("All");
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || filterStatus !== "All" || filterPriority !== "All"
                ? "Try adjusting your filters"
                : "No reports have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportListPage;