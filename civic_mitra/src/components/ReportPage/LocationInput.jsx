// src/components/Report/LocationInput.jsx
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Marker icons
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// Dummy data (replace with API if available)
const statesList = [
  { name: "Uttar Pradesh", districts: ["Lucknow", "Kanpur", "Varanasi"] },
  { name: "Maharashtra", districts: ["Mumbai", "Pune", "Nagpur"] },
  { name: "Delhi", districts: ["New Delhi", "North Delhi", "South Delhi"] },
];

// ----------------------------
// Marker Component
// ----------------------------
function LocationMarker({ setLocation, setAddressData }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const latlng = e.latlng;
      setPosition(latlng);
      setLocation({ lat: latlng.lat, lng: latlng.lng });
      await reverseGeocode(latlng.lat, latlng.lng, setAddressData);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// ----------------------------
// Reverse Geocode
// ----------------------------
async function reverseGeocode(lat, lng, setAddressData) {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const addr = res.data.address || {};
    setAddressData({
      address: res.data.display_name || "",
      city: addr.city || addr.town || addr.village || "",
      district: addr.county || "",
      state: addr.state || "",
      country: addr.country || "",
      pincode: addr.postcode || "",
    });
  } catch (err) {
    console.error("Reverse geocode failed", err);
  }
}

// ----------------------------
// Main Component
// ----------------------------
export default function LocationInput({ location, setLocation, addressData, setAddressData }) {
  const mapRef = useRef(null);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]); // For future expansion, currently manual

  // When state changes, populate districts
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const stateObj = statesList.find((s) => s.name === selectedState);
    setDistricts(stateObj ? stateObj.districts : []);
    setAddressData({ ...addressData, state: selectedState, district: "", city: "" });
  };

  // When district changes, clear city
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setAddressData({ ...addressData, district, city: "" });
    // Optionally fetch cities via API here
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        if (mapRef.current) mapRef.current.setView([latitude, longitude], 16);
        await reverseGeocode(latitude, longitude, setAddressData);
      },
      () => alert("Location access denied. Enter manually."),
      { enableHighAccuracy: true }
    );
  };

  return (
    <section className="w-full max-w-3xl mx-auto p-4 mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Enter Location</h2>

      {/* Live Location */}
      <button
        onClick={detectLocation}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition w-full sm:w-auto"
      >
        📍 Use My Current Location
      </button>

      {/* Manual address */}
      <input
        type="text"
        placeholder="Enter landmark or address"
        value={addressData.address}
        onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
        className="w-full p-3 mb-4 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition"
      />

      {/* Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* State */}
        <select
          value={addressData.state}
          onChange={handleStateChange}
          className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="">Select State</option>
          {statesList.map((state) => (
            <option key={state.name} value={state.name}>{state.name}</option>
          ))}
        </select>

        {/* District */}
        <select
          value={addressData.district}
          onChange={handleDistrictChange}
          className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* City */}
        <input
          type="text"
          placeholder="City / Village"
          value={addressData.city}
          onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
          className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />

        {/* Pin code */}
        <input
          type="text"
          placeholder="Pin Code"
          value={addressData.pincode}
          onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
          className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      {/* Map */}
      <div className="h-64 sm:h-80 rounded-lg overflow-hidden shadow-md z-0">
        <MapContainer
          center={[location?.lat || 20, location?.lng || 77]}
          zoom={location ? 16 : 5}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker setLocation={setLocation} setAddressData={setAddressData} />
        </MapContainer>
      </div>

      {location && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Selected: Lat {location.lat.toFixed(5)}, Lng {location.lng.toFixed(5)}
        </p>
      )}
    </section>
  );
}
