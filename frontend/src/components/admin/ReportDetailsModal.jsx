// src/components/admin/ReportDetailsModal.jsx
import React from "react";

const ReportDetailsModal = ({ report, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full p-6 my-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Report Details
          </h3>
          <button
            onClick={onClose}
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
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">#{report.id}</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Category</span>
            <p className="text-lg text-gray-900 dark:text-gray-100">{report.category}</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Full Description</span>
            <p className="text-gray-700 dark:text-gray-300">{report.description}</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Complete Address</span>
            <p className="text-gray-700 dark:text-gray-300">
              {[
                report.addressData?.address,
                report.addressData?.city,
                report.addressData?.district,
                report.addressData?.state,
                report.addressData?.country,
                report.addressData?.pincode,
              ].filter(Boolean).join(", ")}
            </p>
          </div>
          {report.lat && report.lng && (
            <div>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">GPS Coordinates</span>
              <p className="text-gray-700 dark:text-gray-300">
                Lat: {report.lat}, Lng: {report.lng}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;