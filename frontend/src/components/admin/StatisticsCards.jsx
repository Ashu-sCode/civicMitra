// src/components/admin/StatisticsCards.jsx (Enhanced to handle map stats)
import React from "react";

const StatCard = ({ title, count, color, icon }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{count}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">{title}</div>
      </div>
      {icon && <div className="text-gray-400">{icon}</div>}
    </div>
  </div>
);

const StatisticsCards = ({ statistics, variant = "default" }) => {
  const defaultStats = [
    { title: "Total Reports", count: statistics.total, color: "blue" },
    { title: "Pending", count: statistics.pending, color: "yellow" },
    { title: "In Progress", count: statistics.inProgress, color: "indigo" },
    { title: "Resolved", count: statistics.resolved, color: "green" },
    { title: "High Priority", count: statistics.highPriority, color: "red" },
  ];

  const mapStats = [
    { title: "Total Markers", count: statistics.total, color: "blue" },
    { title: "High Priority", count: statistics.highPriority, color: "red" },
    { title: "Medium Priority", count: statistics.mediumPriority || 0, color: "yellow" },
    { title: "Low Priority", count: (statistics.total - (statistics.highPriority + (statistics.mediumPriority || 0))), color: "green" },
    { title: "Pending", count: statistics.pending, color: "yellow" },
    { title: "Resolved", count: statistics.resolved, color: "green" },
  ];

  const stats = variant === "map" ? mapStats : defaultStats;
  const gridCols = variant === "map" ? "grid-cols-2 md:grid-cols-6" : "grid-cols-2 md:grid-cols-5";

  return (
    <div className={`grid ${gridCols} gap-4 mb-8`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatisticsCards;