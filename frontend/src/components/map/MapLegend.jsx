// src/components/map/MapLegend.jsx
import React from "react";

const MapLegend = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Map Legend
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Priority Markers
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
                !
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                High Priority
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
                •
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Medium Priority
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-md"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Low Priority
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Status Indication
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md"
                style={{ opacity: 1 }}
              ></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Pending (Full opacity)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow-md"
                style={{ opacity: 0.8 }}
              ></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                In Progress (80% opacity)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-md"
                style={{ opacity: 0.5 }}
              ></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Resolved (50% opacity)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;