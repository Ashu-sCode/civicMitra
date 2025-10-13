import React, { useState } from "react";

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

  // 🏷️ Icons per category
  const getCategoryIcon = (cat) => {
    const icons = {
      "Roads & Transport Issues": "🚧",
      "Sanitation & Solid Waste": "🚮",
      "Water Supply & Sewerage": "💧",
      "Streetlights & Electricity": "💡",
      "Environment & Public Health": "🌿",
      "Public Safety & Law": "🚔",
      "Civic Infrastructure": "🏗️",
      "Education & Libraries": "📚",
      "Disaster & Emergency": "🚨",
    };
    return icons[cat] || "📋";
  };

  // 🎨 Status + Priority colors
  const getStatusBadge = (st) => {
    const map = {
      Pending: "bg-yellow-50 text-yellow-700 border border-yellow-300",
      "In Progress": "bg-blue-50 text-blue-700 border border-blue-300",
      Resolved: "bg-green-50 text-green-700 border border-green-300",
      Rejected: "bg-red-50 text-red-700 border border-red-300",
    };
    return map[st] || map.Pending;
  };

  const getPriorityBadge = (p) => {
    const map = {
      High: "bg-red-100 text-red-700 border border-red-300",
      Medium: "bg-amber-100 text-amber-700 border border-amber-300",
      Low: "bg-green-100 text-green-700 border border-green-300",
    };
    return map[p] || map.Low;
  };

  const formatDate = (date) => {
    if (!date) return "Unknown Date";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
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
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getCategoryIcon(category)}</div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {category}
              </h3>
              <p className="text-xs text-gray-600">
                Tracking ID: <span className="font-mono">{trackingId}</span>
              </p>
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Address */}
          {addressData.address && (
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <svg
                className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                {addressData.address}
                {addressData.city && `, ${addressData.city}`}
                {addressData.state && `, ${addressData.state}`}
              </p>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-800 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Media Evidence */}
          {mediaFiles.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Attached Evidence ({mediaFiles.length})
              </p>
              <div className="grid grid-cols-4 gap-2">
                {mediaFiles.slice(0, 4).map((file, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
                    onClick={() => handleImageClick(file)}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${file}`}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    {idx === 3 && mediaFiles.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          +{mediaFiles.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityBadge(
                priority
              )}`}
            >
              {priority} Priority
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {formatDate(createdAt)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-md transition-colors"
              onClick={() =>
                window.open(`/track-report/${trackingId}`, "_blank")
              }
            >
              View Report
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-4 rounded-md transition-colors"
              onClick={() =>
                window.open(`/track-report/${trackingId}`, "_blank")
              }
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
              ✕
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
