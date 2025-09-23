// src/components/Report/LocationInput.jsx
import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AddressForm from "./AddressForm";
import statesData from "../../data/india/states.json";

/* Leaflet icons */
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const markerIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LocationInput({
  location,
  setLocation,
  addressData,
  setAddressData,
}) {
  const mapRef = useRef(null);

  // -----------------------------------
  // Map marker from clicks
  // -----------------------------------
  function LocationMarkerInner() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        reverseGeocode(lat, lng);
      },
    });

    return location ? (
      <Marker position={[location.lat, location.lng]} icon={markerIcon} />
    ) : null;
  }

  function RecenterMap({ lat, lng }) {
    const map = useMapEvents({});
    useEffect(() => {
      if (lat && lng) {
        map.setView([lat, lng], 16, { animate: true });
      }
    }, [lat, lng, map]);
    return null;
  }

  // -----------------------------------
  // Reverse geocode -> fills state/district/city/pincode
  // -----------------------------------
  const reverseGeocode = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      const addr = data.address || {};

      const stateName = addr.state || addr.state_district || "";
      const districtName =
        addr.district || addr.county || addr.region || addr.suburb || "";
      const cityName =
        addr.city || addr.town || addr.village || addr.hamlet || "";
      const postcode = addr.postcode || "";

      // find stateCode
      const stateCode = Object.keys(statesData).find(
        (k) => (statesData[k] || "").toLowerCase() === stateName.toLowerCase()
      );

      setAddressData((prev) => ({
        ...prev,
        address: data.display_name || prev.address,
        state: stateName,
        stateCode: stateCode || "",
        district: districtName,
        city: cityName,
        pincode: postcode,
        lat,
        lng,
      }));
    } catch (err) {
      console.error("Reverse geocode failed:", err);
      setAddressData((prev) => ({
        ...prev,
        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
      }));
    }
  };

  // -----------------------------------
  // Geolocation
  // -----------------------------------
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        if (mapRef.current) mapRef.current.setView([lat, lng], 16);
        reverseGeocode(lat, lng);
      },
      () => alert("Location access denied"),
      { enableHighAccuracy: true }
    );
  };

  // -----------------------------------
  // Handle pincode -> geocode + move map
  // -----------------------------------
  const handlePincodeSelect = async (pincode) => {
    if (!pincode) return;
    try {
      const q = encodeURIComponent(`${pincode}, India`);
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${q}&limit=1`;
      const res = await fetch(url);
      const arr = await res.json();
      if (arr && arr.length > 0) {
        const lat = parseFloat(arr[0].lat);
        const lng = parseFloat(arr[0].lon);
        setLocation({ lat, lng });
        if (mapRef.current) mapRef.current.setView([lat, lng], 14);
        setAddressData((prev) => ({ ...prev, pincode, lat, lng }));
      } else {
        setAddressData((prev) => ({ ...prev, pincode }));
      }
    } catch (err) {
      console.error("Pincode lookup failed:", err);
      setAddressData((prev) => ({ ...prev, pincode }));
    }
  };

  // -----------------------------------
  // Render
  // -----------------------------------
  return (
    <section className="w-full max-w-3xl mx-auto p-4 mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Enter Location
      </h2>

      <button
        onClick={detectLocation}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition w-full sm:w-auto"
      >
        📍 Use My Current Location
      </button>

      <input
        type="text"
        placeholder="Enter landmark or address"
        value={addressData.address || ""}
        onChange={(e) =>
          setAddressData((prev) => ({ ...prev, address: e.target.value }))
        }
        className="w-full p-3 mb-4 rounded-md border border-gray-300 dark:border-gray-600 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                   bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition"
      />

      {/* Address Form */}
      <AddressForm
        addressData={addressData}
        setAddressData={setAddressData}
        onPincodeSelect={handlePincodeSelect}
        location={location}
      />
      <div className="relative h-72 sm:h-96 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
        {/* Map */}
        <MapContainer
          center={[location?.lat || 20, location?.lng || 77]}
          zoom={location ? 16 : 5}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarkerInner />
          {/* 👇 add this */}
          {location?.lat && location?.lng && (
            <RecenterMap lat={location.lat} lng={location.lng} />
          )}
        </MapContainer>

        {/* Floating controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={detectLocation}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Use Current Location"
          >
            📍
          </button>
          <button
            onClick={() => {
              if (mapRef.current && location) {
                mapRef.current.setView([location.lat, location.lng], 16);
              }
            }}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Center on Marker"
          >
            🎯
          </button>
        </div>

        {/* Address bar overlay */}
        {addressData?.address && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 text-sm p-2 sm:p-3 border-t border-gray-200 dark:border-gray-700">
            <p className="truncate text-gray-700 dark:text-gray-300">
              📌 {addressData.address}
            </p>
          </div>
        )}
      </div>

      {location && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Selected: Lat {location.lat.toFixed(5)}, Lng {location.lng.toFixed(5)}
        </p>
      )}
    </section>
  );
}
