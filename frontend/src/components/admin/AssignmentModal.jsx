// src/components/admin/AssignmentModal.jsx
import React from "react";

const AssignmentModal = ({ report, onAssign, onClose }) => {
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

  const handleSubmit = () => {
    const dept = document.getElementById("department").value;
    const officer = document.getElementById("officer").value;
    onAssign(report.id, dept, officer);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Assign Report #{report.id}
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
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
            >
              Assign
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;