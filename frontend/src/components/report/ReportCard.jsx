// src/components/ReportList/ReportCard.jsx
import React, { useState } from "react";

const ReportCard = ({ report }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    trackingId,
    category = "Unknown",
    description = "",
    mediaFiles = [],
    priority = "Low",
    status = "Pending",
    addressData = {},
    createdAt,
  } = report;

  const getCategoryIcon = (cat) => {
    const icons = {
      "Roads & Transport Issues": "🛣️",
      "Sanitation & Solid Waste": "🗑️",
      "Water Supply & Sewerage": "💧",
      "Streetlights & Electricity": "💡",
      "Environment & Public Health": "🌱",
      "Parks & Public Spaces": "🌳",
      "Public Safety & Law": "🚔",
      "Civic Infrastructure": "🏗️",
      "Education & Libraries": "📚",
      "Disaster & Emergency": "🚨",
    };
    return icons[cat] || "📝";
  };

  const getStatusColor = (st) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[st] || colors.Pending;
  };

  const getPriorityColor = (p) => {
    const colors = {
      High: "bg-red-500 text-white dark:bg-red-600",
      Medium: "bg-yellow-500 text-gray-900 dark:bg-yellow-600 dark:text-gray-100",
      Low: "bg-green-500 text-white dark:bg-green-600",
    };
    return colors[p] || colors.Low;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleImageClick = (file) => {
    setSelectedImage(file);
    setImageModalOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getCategoryIcon(category)}</div>
              <div>
                <h3 className="text-lg font-bold text-white line-clamp-1">
                  {category}
                </h3>
                <p className="text-blue-100 text-xs font-medium">
                  Report #{trackingId || "Unknown"}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Location */}
          {addressData.address && (
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                  {addressData.address}
                  {addressData.city && `, ${addressData.city}`}
                  {addressData.state && `, ${addressData.state}`}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed line-clamp-3">
                {description}
              </p>
            </div>
          )}

          {/* Priority & Date */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            {priority && (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(priority)}`}>
                {priority} Priority
              </span>
            )}
            {createdAt && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {formatDate(createdAt)}
              </span>
            )}
          </div>

          {/* Media Files Gallery */}
          {mediaFiles.length > 0 && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Evidence ({mediaFiles.length})
              </p>
              <div className="grid grid-cols-4 gap-2">
                {mediaFiles.slice(0, 4).map((file, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(file)}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${file}`}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                    {idx === 3 && mediaFiles.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          +{mediaFiles.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3">
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={() => window.open(`/track-report/${trackingId}`, "_blank")}
            >
              View Details
            </button>
            <button
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={() => window.open(`/track-report/${trackingId}`, "_blank")}
            >
              Track
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {imageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
              onClick={() => setImageModalOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={`http://localhost:5000/uploads/${selectedImage}`}
              alt="Full size"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReportCard;
