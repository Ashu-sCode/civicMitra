// src/pages/AdminReportList.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminReportList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const adminUser = {
    name: "Admin Demo",
    role: "Department Admin",
    department: "Public Works Department",
  };

  // Mock data for assignments
  const departments = [
    "Public Works Department",
    "Water Supply Department",
    "Sanitation Department",
    "Electrical Department",
    "Health Department",
  ];

  const fieldOfficers = [
    "Rajesh Kumar",
    "Priya Sharma",
    "Amit Patel",
    "Suresh Reddy",
    "Meera Nair",
  ];

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");

      const data = await res.json();

      const parsedReports = data.map((r) => {
        let addressData = {};
        try {
          addressData = typeof r.addressData === "string" ? JSON.parse(r.addressData) : r.addressData;
        } catch {
          addressData = {};
        }

        let mediaFiles = [];
        try {
          mediaFiles = typeof r.mediaFiles === "string" ? JSON.parse(r.mediaFiles) : r.mediaFiles;
        } catch {
          mediaFiles = [];
        }

        return {
          ...r,
          addressData,
          mediaFiles,
          status: r.status || "Pending",
          assignedTo: r.assignedTo || null,
          department: r.department || null,
        };
      });

      setReports(parsedReports);
      setFilteredReports(parsedReports);
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

  // Filter logic
  useEffect(() => {
    let filtered = [...reports];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (report) =>
          report.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.addressData?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.id?.toString().includes(searchQuery)
      );
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((report) => report.status === filterStatus);
    }

    if (filterPriority !== "All") {
      filtered = filtered.filter((report) => report.priority === filterPriority);
    }

    if (filterCategory !== "All") {
      filtered = filtered.filter((report) => report.category === filterCategory);
    }

    setFilteredReports(filtered);
  }, [searchQuery, filterStatus, filterPriority, filterCategory, reports]);

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Acknowledged: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Assigned: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "In Progress": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      Resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || colors.Pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
      Medium: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
      Low: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    };
    return colors[priority] || colors.Low;
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      // Mock API call - replace with actual endpoint
      // const res = await fetch(`http://localhost:5000/api/reports/${reportId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      toast.success(`Report status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleAssignReport = async (reportId, department, officer) => {
    try {
      // Mock API call
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, department, assignedTo: officer, status: "Assigned" }
            : r
        )
      );
      toast.success(`Report assigned to ${officer}`);
      setShowAssignModal(false);
    } catch (err) {
      toast.error("Failed to assign report");
    }
  };

  const handleEscalate = (report) => {
    toast.success(`Report #${report.id} escalated to higher authority`);
  };

  const exportReports = () => {
    const csv = [
      ["ID", "Category", "Status", "Priority", "Location", "Description"],
      ...filteredReports.map((r) => [
        r.id,
        r.category,
        r.status,
        r.priority,
        r.addressData?.address || "",
        r.description || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_${new Date().toISOString()}.csv`;
    a.click();
    toast.success("Reports exported successfully");
  };

  const getUniqueCategories = () => {
    return [...new Set(reports.map((r) => r.category).filter(Boolean))];
  };

  const getStatistics = () => {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === "Pending").length,
      inProgress: reports.filter((r) => r.status === "In Progress").length,
      resolved: reports.filter((r) => r.status === "Resolved").length,
      highPriority: reports.filter((r) => r.priority === "High").length,
    };
  };

  const stats = getStatistics();

  const LoadingSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3" />
      <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-blue-100">
                <span className="font-semibold">{adminUser.name}</span> • {adminUser.role}
              </p>
              <p className="text-blue-200 text-sm">{adminUser.department}</p>
            </div>
            <button
              onClick={exportReports}
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Reports</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.inProgress}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.resolved}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.highPriority}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by ID, category, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredReports.length} of {reports.length} reports
            </span>
            {(searchQuery || filterStatus !== "All" || filterPriority !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("All");
                  setFilterPriority("All");
                  setFilterCategory("All");
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {report.category || "No Category"}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        {report.priority && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(report.priority)}`}>
                            {report.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Report ID: #{report.id}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {report.addressData?.address && (
                    <div className="flex items-start gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {[
                          report.addressData?.address,
                          report.addressData?.city,
                          report.addressData?.state,
                          report.addressData?.pincode,
                        ].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  {report.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {report.description}
                    </p>
                  )}

                  {/* Assignment Info */}
                  {report.assignedTo && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Assigned to:</strong> {report.assignedTo}
                        {report.department && ` (${report.department})`}
                      </p>
                    </div>
                  )}

                  {/* Media Files */}
                  {report.mediaFiles?.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {report.mediaFiles.slice(0, 4).map((file, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:5000/uploads/${file}`}
                          alt={`Evidence ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      ))}
                      {report.mediaFiles.length > 4 && (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                          +{report.mediaFiles.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowAssignModal(true);
                      }}
                      className="px-4 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Assign
                    </button>

                    <button
                      onClick={() => handleEscalate(report)}
                      className="px-4 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Escalate
                    </button>

                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowDetailsModal(true);
                      }}
                      className="px-4 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Assign Report #{selectedReport.id}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <select
                  id="department"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Field Officer
                </label>
                <select
                  id="officer"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {fieldOfficers.map((officer) => (
                    <option key={officer} value={officer}>{officer}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    const dept = document.getElementById("department").value;
                    const officer = document.getElementById("officer").value;
                    handleAssignReport(selectedReport.id, dept, officer);
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
                >
                  Assign
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full p-6 my-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Report Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Report ID</span>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">#{selectedReport.id}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Category</span>
                <p className="text-lg text-gray-900 dark:text-gray-100">{selectedReport.category}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Full Description</span>
                <p className="text-gray-700 dark:text-gray-300">{selectedReport.description}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Complete Address</span>
                <p className="text-gray-700 dark:text-gray-300">
                  {[
                    selectedReport.addressData?.address,
                    selectedReport.addressData?.city,
                    selectedReport.addressData?.district,
                    selectedReport.addressData?.state,
                    selectedReport.addressData?.country,
                    selectedReport.addressData?.pincode,
                  ].filter(Boolean).join(", ")}
                </p>
              </div>
              {selectedReport.lat && selectedReport.lng && (
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">GPS Coordinates</span>
                  <p className="text-gray-700 dark:text-gray-300">
                    Lat: {selectedReport.lat}, Lng: {selectedReport.lng}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportList;