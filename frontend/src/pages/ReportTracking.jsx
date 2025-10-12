import { useState } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Download,
  ExternalLink,
} from "lucide-react";

const TrackingPage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statusStages = ["Pending", "Acknowledged", "Assigned", "In Progress", "Resolved"];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/${trackingId.trim()}`
      );
      if (res.data.success) {
        setReport(res.data.report);
        setTimeout(() => {
          document.getElementById("results-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } else {
        setError("No report found for this tracking ID.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Something went wrong while fetching report."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status) =>
    statusStages.findIndex((s) => s.toLowerCase() === status.toLowerCase()) ?? 0;
  const currentStage = report ? getStageIndex(report.status) : 0;

  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto px-4 pb-16 animate-pulse">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-slate-200/50 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="h-6 bg-white/30 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-1/4"></div>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-gray-600 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
            <div className="space-y-3">
              <div className="h-32 bg-slate-200 dark:bg-gray-600 rounded-xl"></div>
              <div className="h-32 bg-slate-200 dark:bg-gray-600 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="text-center pt-16 pb-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-3">
          Track Your Civic Report
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Enter your tracking ID to view progress and details of your report.
        </p>
      </div>

      {/* Input Section */}
      <form
        onSubmit={handleSearch}
        className="max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-gray-800 shadow-md rounded-2xl px-6 py-4 border dark:border-gray-700"
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 text-slate-400 dark:text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g., CIV20251012-00052)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-200 bg-white dark:bg-gray-700"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-all"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mt-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" />
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Skeleton while loading */}
      {loading && <LoadingSkeleton />}

      {/* Report Results */}
      {report && (
        <div id="results-section" className="max-w-4xl mx-auto px-4 pb-16 mt-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-slate-200/50 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Report Details</h2>
                  <p className="text-blue-100">{`Tracking ID: ${report.trackingId}`}</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                    <Clock className="w-4 h-4 mr-1" />
                    {report.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="px-8 py-6 bg-slate-50 dark:bg-gray-700 border-b border-slate-200 dark:border-gray-600">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Progress Status
              </h3>
              <div className="flex items-center justify-between relative">
                {statusStages.map((stage, index) => {
                  const isCompleted = index <= currentStage;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1 relative"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-blue-600 text-white"
                            : "bg-slate-300 dark:bg-gray-600 text-slate-600 dark:text-gray-200"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
                      </div>
                      <span
                        className={`mt-2 text-sm ${
                          isCompleted
                            ? "text-slate-800 dark:text-slate-200 font-medium"
                            : "text-slate-500 dark:text-gray-300"
                        }`}
                      >
                        {stage}
                      </span>
                      {index < statusStages.length - 1 && (
                        <div
                          className={`absolute top-5 left-[calc(50%+20px)] w-full h-1 ${
                            index < currentStage ? "bg-blue-500" : "bg-slate-300 dark:bg-gray-600"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            <div className="p-8 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Category
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{report.category}</p>

                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Description
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{report.description}</p>

                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Location</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {report.addressData.address}, {report.addressData.city},{" "}
                  {report.addressData.state} - {report.addressData.pincode}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Submitted On
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>

                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Status
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium capitalize">
                  {report.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
