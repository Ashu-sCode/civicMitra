import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";

const LandingStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports/stats");
        if (res.data.success) setStats(res.data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Optional: auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900 text-center">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Loading real-time stats...
        </p>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900 text-center">
        <p className="text-red-500">Failed to load statistics.</p>
      </section>
    );
  }

  const statItems = [
    { value: stats.totalReports, label: "Total Reports" },
    { value: stats.resolvedReports, label: "Resolved Issues" },
    { value: stats.pendingReports, label: "Pending Issues" },
    { value: stats.citiesCovered, label: "Cities Covered" },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Real-Time Civic Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 mb-2">
                <CountUp end={stat.value} duration={2} separator="," />
                {stat.label.includes("Reports") && "+"}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-8">
          Updated every 30 seconds
        </p>
      </div>
    </section>
  );
};

export default LandingStats;
