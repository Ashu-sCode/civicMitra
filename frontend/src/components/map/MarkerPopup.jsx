// src/components/map/MarkerPopup.jsx
import React from "react";
import { Popup } from "react-leaflet";

const MarkerPopup = ({ report, onReportClick }) => {
  return (
    <Popup className="custom-popup" maxWidth={320}>
      <div className="p-3">
        <div className="flex items-start justify-between mb-3 pb-2 border-b border-gray-200">
          <div>
            <div className="text-xs text-gray-500 mb-1">Report ID</div>
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
            <strong className="text-gray-700">Description:</strong>{" "}
            {report.description}
          </p>
        )}

        <button 
          onClick={() => onReportClick(report)}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-4 rounded transition-colors"
        >
          View Details
        </button>
      </div>
    </Popup>
  );
};

export default MarkerPopup;