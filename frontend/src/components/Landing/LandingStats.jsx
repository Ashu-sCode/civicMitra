import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, TrendingUp, Clock, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

// Animated number component
const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 50);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Progress bar component
const ProgressBar = ({ percentage, color = "blue" }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const colorClasses = {
    blue: "bg-blue-600 dark:bg-blue-400",
    green: "bg-green-600 dark:bg-green-400",
    yellow: "bg-yellow-500 dark:bg-yellow-400",
    red: "bg-red-500 dark:bg-red-400",
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
      <div
        className={`h-2 rounded-full transition-all duration-1000 ease-out ${colorClasses[color]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

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
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-8">
            <div className="text-center">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                  <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
              <p className="text-slate-500 dark:text-gray-400 mt-4">
                Loading real-time statistics...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-700 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 font-medium">Failed to load statistics</p>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-2">
              Please check your connection and try again
            </p>
          </div>
        </div>
      </section>
    );
  }

  const resolutionRate = Math.round((stats.resolvedReports / stats.totalReports) * 100);
  const pendingRate = Math.round((stats.pendingReports / stats.totalReports) * 100);

  const statItems = [
    { value: stats.totalReports, label: "Total Reports Submitted", subtitle: "Cumulative citizen submissions", icon: BarChart3, color: "blue", percentage: 100, trend: "+12% this month" },
    { value: stats.resolvedReports, label: "Issues Resolved", subtitle: `${resolutionRate}% resolution rate`, icon: CheckCircle2, color: "green", percentage: resolutionRate, trend: "+8% this month" },
    { value: stats.pendingReports, label: "Pending Issues", subtitle: `${pendingRate}% of total reports`, icon: Clock, color: "yellow", percentage: pendingRate, trend: "Avg. 5 days response" },
    { value: stats.citiesCovered, label: "Cities Covered", subtitle: "Across Jharkhand state", icon: MapPin, color: "blue", percentage: 80, trend: "Expanding coverage" },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4 transition-colors duration-300">
            <TrendingUp className="w-4 h-4" />
            Live Statistics Dashboard
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">
            Civic Engagement Metrics
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Real-time insights into citizen participation and government responsiveness across Jharkhand
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statItems.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    {
                      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300',
                      green: 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300',
                      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-300',
                      red: 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'
                    }[stat.color]
                  } transition-colors duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-gray-400 font-medium transition-colors duration-300">
                      {stat.trend}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                    <AnimatedNumber value={stat.value} />
                    {stat.label.includes("Reports") && "+"}
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-gray-300 transition-colors duration-300">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400 transition-colors duration-300">
                    {stat.subtitle}
                  </div>
                  <ProgressBar percentage={stat.percentage} color={stat.color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-lg shadow-lg p-8 text-white mb-8 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">System Performance</h3>
              <p className="text-blue-100 dark:text-blue-200 text-sm">
                Monitoring civic engagement across all districts
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">
                {resolutionRate}%
              </div>
              <div className="text-blue-100 dark:text-blue-200 text-sm">Average Resolution Rate</div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-blue-100 dark:text-blue-200 text-sm">
                Continuous monitoring & response
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-slate-200 dark:border-gray-700 transition-colors duration-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-600 dark:text-gray-400 font-medium">
              Last updated: {new Date().toLocaleTimeString()} | Auto-refresh every 30 seconds
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-gray-500 mt-4 transition-colors duration-300">
            Data sourced from Government of Jharkhand Civic Portal | 
            <span className="font-medium"> Civic Mitra v2.0</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingStats;
