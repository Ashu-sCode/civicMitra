// src/components/map/InteractiveMap.jsx
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapMarkers from "./MapMarkers";
import MapBoundsUpdater from "./MapBoundsUpdater";
import { getTileLayerUrl } from "../../utils/mapUtils";

const InteractiveMap = ({ reports, mapStyle, onReportClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 relative z-0 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <MapContainer
        center={[23.3441, 85.3096]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url={getTileLayerUrl(mapStyle)}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapBoundsUpdater reports={reports} />
        <MapMarkers reports={reports} onReportClick={onReportClick} />
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;