// src/components/admin/EmptyState.jsx
import React from "react";

const EmptyState = () => (
  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
    <div className="text-6xl mb-4">📋</div>
    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
      No reports found
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      Try adjusting your filters or search criteria
    </p>
  </div>
);

export default EmptyState;