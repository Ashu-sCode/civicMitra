import React, { useState } from "react";
import { MapPin, Clock, FileText, Eye, ExternalLink, X } from "lucide-react";

const ReportCard = ({ report }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    trackingId,
    category = "General Issue",
    description = "",
    mediaFiles = [],
    priority = "Low",
    status = "Pending",
    addressData = {},
    createdAt,
  } = report;

  // Government-style category icons
  const getCategoryIcon = (cat) => {
    const icons = {
      "Roads & Transport Issues": "🛣️",
      "Sanitation & Solid Waste": "🗑️",
      "Water Supply & Sewerage": "💧",
      "Streetlights & Electricity": "💡",
      "Environment & Public Health": "🌱",
      "Public Safety & Law": "🚔",
      "Civic Infrastructure": "🏗️",
      "Education & Libraries": "📚",
      "Disaster & Emergency": "🚨",
      "Road Infrastructure": "🛣️",
      "Water Supply": "💧",
      "Sanitation": "🗑️",
      "Electricity": "💡"
    };
    return icons[cat] || "📋";
  };

  // Government-style status badges with dark mode
  const getStatusBadge = (st) => {
    const map = {
      Pending: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
      Acknowledged: "bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      "In Progress": "bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800",
      Resolved: "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
      Rejected: "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    };
    return map[st] || map.Pending;
  };

  const getPriorityBadge = (p) => {
    const map = {
      High: "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
      Medium: "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
      Low: "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    };
    return map[p] || map.Low;
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleImageClick = (file) => {
    setSelectedImage(file);
    setImageModalOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Official Header */}
        <div className="bg-slate-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getCategoryIcon(category)}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {category}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tracking ID: <span className="font-mono font-medium">{trackingId}</span>
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(status)}`}>
              {status}
            </span>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-6 space-y-4">
          {/* Location Information */}
          {addressData.address && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Location</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {addressData.address}
                  {addressData.city && `, ${addressData.city}`}
                  {addressData.state && `, ${addressData.state}`}
                  {addressData.pincode && ` - ${addressData.pincode}`}
                </p>
              </div>
            </div>
          )}

          {/* Issue Description */}
          {description && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Issue Description</h4>
              <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          )}

          {/* Evidence Documentation */}
          {mediaFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Evidence Documentation ({mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''})
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {mediaFiles.slice(0, 4).map((file, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 cursor-pointer group hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    onClick={() => handleImageClick(file)}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${file}`}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span class="text-gray-400 dark:text-gray-500 text-xs">Image unavailable</span>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                    {idx === 3 && mediaFiles.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          +{mediaFiles.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Report Metadata */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(priority)}`}>
                {priority} Priority
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Submitted: {formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Official Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2"
              onClick={() => window.open(`/track-report/${trackingId}`, "_blank")}
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2"
              onClick={() => window.open(`/track-report/${trackingId}`, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              Track
            </button>
          </div>
        </div>

        {/* Government Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Government of Jharkhand</span>
            <span>Civic Mitra Portal</span>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {imageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 dark:bg-black dark:bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full">
            <div className="absolute top-4 right-4 z-10">
              <button
                className="text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageModalOpen(false);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Evidence Documentation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Report ID: {trackingId}</p>
              </div>
              <div className="p-4">
                <img
                  src={`http://localhost:5000/uploads/${selectedImage}`}
                  alt="Evidence documentation"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportCard;