import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import AdminHeader from  "../../components/admin/AdminHeader";
import StatisticsCards from "../../components/admin/StatisticsCards";
import ReportFilters from "../../components/admin/ReportFilters";
import ReportsList from "../../components/admin/ReportsList";
import AssignmentModal from "../../components/admin/AssignmentModal";
import ReportDetailsModal from "../../components/admin/ReportDetailsModal";

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

  const fetchReports = async (trackingId = "") => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/reports", {
        params: trackingId ? { trackingId } : {},
      });

      if (res.data.success && Array.isArray(res.data.reports)) {
        const safeData = res.data.reports.map((r) => ({
          trackingId: r.trackingId,
          category: r.category || "Unknown",
          description: r.description || "",
          mediaFiles: r.mediaFiles || [],
          priority: r.priority || "Low",
          status: r.status || "Pending",
          addressData: r.addressData || { address: "", city: "", state: "", country: "India" },
          createdAt: r.createdAt || new Date().toISOString(),
        }));
        setReports(safeData);
      } else {
        toast.error("Failed to fetch reports");
        setReports([]);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      toast.error("Failed to load reports");
      setReports([]);
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

  const handleStatusChange = async (reportId, newStatus) => {
    try {
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

  const getStatistics = () => {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === "Pending").length,
      inProgress: reports.filter((r) => r.status === "In Progress").length,
      resolved: reports.filter((r) => r.status === "Resolved").length,
      highPriority: reports.filter((r) => r.priority === "High").length,
    };
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("All");
    setFilterPriority("All");
    setFilterCategory("All");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <AdminHeader adminUser={adminUser} onExport={exportReports} />
        
        <StatisticsCards statistics={getStatistics()} />
        
        <ReportFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filteredCount={filteredReports.length}
          totalCount={reports.length}
          onClearFilters={clearFilters}
        />

        <ReportsList
          reports={filteredReports}
          loading={loading}
          onStatusChange={handleStatusChange}
          onAssign={(report) => {
            setSelectedReport(report);
            setShowAssignModal(true);
          }}
          onEscalate={handleEscalate}
          onViewDetails={(report) => {
            setSelectedReport(report);
            setShowDetailsModal(true);
          }}
        />

        {showAssignModal && (
          <AssignmentModal
            report={selectedReport}
            onAssign={handleAssignReport}
            onClose={() => setShowAssignModal(false)}
          />
        )}

        {showDetailsModal && (
          <ReportDetailsModal
            report={selectedReport}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminReportList;