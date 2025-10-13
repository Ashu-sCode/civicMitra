import React, { useEffect, useState } from "react";
import ReportCard from "../components/report/ReportCard";
import toast from "react-hot-toast";
import axios from "axios";

const ReportListPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 6;

  const fetchReports = async (search = "") => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/reports", {
        params: search ? { search } : {},
      });

      const data = res.data?.reports || [];
      if (Array.isArray(data)) {
        const cleaned = data.map((r) => ({
          trackingId: r.trackingId || "N/A",
          category: r.category || "Uncategorized",
          description: r.description || "",
          priority: r.priority || "Low",
          status: r.status || "Pending",
          addressData: r.addressData || {
            address: "",
            city: "",
            state: "",
            country: "India",
          },
          mediaFiles: r.mediaFiles || [],
          createdAt: r.createdAt || new Date().toISOString(),
        }));
        setReports(cleaned);
      } else {
        console.warn("Unexpected data structure:", res.data);
        setReports([]);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      toast.error("Failed to load reports from server");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filtering
  const filteredReports = reports.filter((report) => {
    const statusMatch = filterStatus === "All" || report.status === filterStatus;
    const priorityMatch =
      filterPriority === "All" || report.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = async () => {
    await fetchReports(searchQuery.trim());
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterStatus("All");
    setFilterPriority("All");
    setCurrentPage(1);
    fetchReports();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Civic Report Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and track issues reported by citizens across your region.
          </p>
          <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 flex">
              <input
                type="text"
                placeholder="🔍 Search by Tracking ID, category, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg transition"
              >
                Search
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {(searchQuery || filterStatus !== "All" || filterPriority !== "All") && (
            <div className="mt-4 text-right">
              <button
                onClick={handleClearFilters}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
              >
                <div className="bg-gray-300 dark:bg-gray-700 h-24" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedReports.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedReports.map((report) => (
                <ReportCard key={report.trackingId} report={report} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportListPage;
