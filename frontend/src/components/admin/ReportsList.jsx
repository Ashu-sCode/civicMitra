// src/components/admin/ReportsList.jsx
import React from "react";
import ReportCard from "./ReportCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

const ReportsList = ({
  reports,
  loading,
  onStatusChange,
  onAssign,
  onEscalate,
  onViewDetails,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          onStatusChange={onStatusChange}
          onAssign={onAssign}
          onEscalate={onEscalate}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default ReportsList;