// src/components/map/MapMarkers.jsx
import React from "react";
import { Marker } from "react-leaflet";
import MarkerPopup from "./MarkerPopup";
import { createCustomMarkerIcon } from "../../utils/mapUtils";

const MapMarkers = ({ reports, onReportClick }) => {
  return (
    <>
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.lat, report.lng]}
          icon={createCustomMarkerIcon(report.priority, report.status)}
        >
          <MarkerPopup report={report} onReportClick={onReportClick} />
        </Marker>
      ))}
    </>
  );
};

export default MapMarkers;