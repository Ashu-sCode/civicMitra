// src/components/admin/LoadingSkeleton.jsx
import React from "react";

const LoadingSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3" />
    <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
);

export default LoadingSkeleton;