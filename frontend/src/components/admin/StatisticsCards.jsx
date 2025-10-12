// src/components/admin/StatisticsCards.jsx
import React from "react";

const StatCard = ({ title, count, color }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-${color}-500`}>
    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
  </div>
);

const StatisticsCards = ({ statistics }) => {
  const stats = [
    { title: "Total Reports", count: statistics.total, color: "blue" },
    { title: "Pending", count: statistics.pending, color: "yellow" },
    { title: "In Progress", count: statistics.inProgress, color: "indigo" },
    { title: "Resolved", count: statistics.resolved, color: "green" },
    { title: "High Priority", count: statistics.highPriority, color: "red" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatisticsCards;