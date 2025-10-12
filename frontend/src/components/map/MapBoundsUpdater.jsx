// src/components/map/MapBoundsUpdater.jsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MapBoundsUpdater = ({ reports }) => {
  const map = useMap();

  useEffect(() => {
    if (reports.length > 0) {
      const validReports = reports.filter((r) => r.lat && r.lng);
      if (validReports.length > 0) {
        const bounds = L.latLngBounds(validReports.map((r) => [r.lat, r.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [reports, map]);

  return null;
};

export default MapBoundsUpdater;