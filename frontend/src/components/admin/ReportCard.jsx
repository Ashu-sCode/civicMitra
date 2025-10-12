// src/components/admin/ReportCard.jsx
import React from "react";

const ReportCard = ({ report, onStatusChange, onAssign, onEscalate, onViewDetails }) => {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
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
            onChange={(e) => onStatusChange(report.id, e.target.value)}
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
            onClick={() => onAssign(report)}
            className="px-4 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          >
            Assign
          </button>

          <button
            onClick={() => onEscalate(report)}
            className="px-4 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
          >
            Escalate
          </button>

          <button
            onClick={() => onViewDetails(report)}
            className="px-4 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;