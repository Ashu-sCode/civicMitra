// src/components/Report/AddressForm.jsx
import React, { useState, useEffect, useRef } from "react";
import statesData from "../../data/india/states.json";

const districtJSONCache = {};
const districtPincodeJSONCache = {};

const importDistrictJSON = async (stateCode) => {
  if (!districtJSONCache[stateCode]) {
    try {
      const data = await import(
        `../../data/india/districts/district-${stateCode}.json`
      );
      districtJSONCache[stateCode] = data.default?.districts || {};
    } catch (err) {
      console.error("Error loading district JSON:", err);
      districtJSONCache[stateCode] = {};
    }
  }
  return districtJSONCache[stateCode];
};

const importDistrictPincodeJSON = async (stateCode) => {
  if (!districtPincodeJSONCache[stateCode]) {
    try {
      const data = await import(
        `../../data/india/districts/district-pincode-${stateCode}.json`
      );
      districtPincodeJSONCache[stateCode] = data.default || {};
    } catch (err) {
      console.error("Error loading district-pincode JSON:", err);
      districtPincodeJSONCache[stateCode] = {};
    }
  }
  return districtPincodeJSONCache[stateCode];
};

export default function AddressForm({
  addressData,
  setAddressData,
  onPincodeSelect,
  location,
}) {
  const [districts, setDistricts] = useState([]);
  const [districtCities, setDistrictCities] = useState({});
  const [districtPincodes, setDistrictPincodes] = useState({});
  const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // ------------------------
  // Load districts + pincodes
  // ------------------------
  useEffect(() => {
    if (!addressData.stateCode) {
      setDistricts([]);
      setDistrictCities({});
      setDistrictPincodes({});
      setPincodeSuggestions([]);
      return;
    }

    let cancelled = false;
    const load = async () => {
      const dObj = await importDistrictJSON(addressData.stateCode);
      const dpObj = await importDistrictPincodeJSON(addressData.stateCode);
      if (cancelled) return;

      setDistricts(Object.keys(dObj || {}));
      setDistrictCities(dObj || {});
      setDistrictPincodes(dpObj || {});
      setAddressData((prev) => ({ ...prev, district: "", city: "", pincode: "" }));
      setPincodeSuggestions([]);
    };

    load();
    return () => (cancelled = true);
  }, [addressData.stateCode, setAddressData]);

  // ------------------------
  // Build pincode suggestions
  // ------------------------
  useEffect(() => {
    if (!addressData.district || !districtPincodes) {
      setPincodeSuggestions([]);
      return;
    }
    const normalizedDistrictKey = Object.keys(districtPincodes).find(
      (k) => k.toLowerCase().trim() === addressData.district.toLowerCase().trim()
    );

    if (!normalizedDistrictKey) {
      setPincodeSuggestions([]);
      return;
    }

    const allPincodesArrays = Object.values(districtPincodes[normalizedDistrictKey] || {});
    const flat = allPincodesArrays.flat();
    const uniq = Array.from(new Set(flat)).sort();
    setPincodeSuggestions(uniq);
  }, [addressData.district, districtPincodes]);

  // ------------------------
  // Autofill district/city from entered pincode
  // ------------------------
  useEffect(() => {
    const p = (addressData.pincode || "").trim();
    if (p.length !== 6) return;

    for (const dist of Object.keys(districtPincodes)) {
      for (const postOffice of Object.keys(districtPincodes[dist] || {})) {
        const pins = districtPincodes[dist][postOffice] || [];
        if (pins.includes(p)) {
          setAddressData((prev) => ({
            ...prev,
            district: prev.district || dist,
            city: prev.city || postOffice,
            pincode: p,
          }));
          return;
        }
      }
    }
  }, [addressData.pincode, districtPincodes, setAddressData]);

  // ------------------------
  // API fallback for pincode
  // ------------------------
  const fetchPincodeFromAPI = async (query) => {
    try {
      const res = await fetch(
        `https://api.postalpincode.in/postoffice/${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        return data[0].PostOffice.map((p) => p.Pincode);
      }
    } catch (err) {
      console.error("Postal API error:", err);
    }
    return [];
  };

  const handleCityChange = async (val) => {
    setAddressData((prev) => ({ ...prev, city: val }));
    if (!pincodeSuggestions.length && val.length > 2) {
      const pins = await fetchPincodeFromAPI(val);
      if (pins.length) setPincodeSuggestions(pins);
    }
  };

  const handleSelectSuggestion = (p) => {
    setAddressData((prev) => ({ ...prev, pincode: p }));
    setShowSuggestions(false);
    if (typeof onPincodeSelect === "function") onPincodeSelect(p);
  };

  const handlePincodeInput = (val) => {
    setAddressData((prev) => ({ ...prev, pincode: val }));
    setShowSuggestions(true);
  };

  // Click outside → close suggestions
  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Merge reverse-geocode location
  useEffect(() => {
    if (!location) return;
    setAddressData((prev) => ({
      ...prev,
      state: location.state || prev.state,
      stateCode: location.stateCode || prev.stateCode,
      district: location.district || prev.district,
      city: location.city || prev.city,
      pincode: location.pincode || prev.pincode,
      lat: location.lat || prev.lat,
      lng: location.lng || prev.lng,
      address: location.address || prev.address,
    }));
  }, [location, setAddressData]);

  const filteredSuggestions = (addressData.pincode || "").trim()
    ? pincodeSuggestions.filter((pin) =>
        pin.startsWith((addressData.pincode || "").trim())
      )
    : pincodeSuggestions;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 relative">
      {/* STATE */}
      <select
        value={addressData.stateCode || ""}
        onChange={(e) =>
          setAddressData({
            ...addressData,
            stateCode: e.target.value,
            state: statesData[e.target.value] || "",
            district: "",
            city: "",
            pincode: "",
          })
        }
        className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        <option value="">Select State</option>
        {Object.entries(statesData).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      {/* DISTRICT */}
      <select
        value={addressData.district || ""}
        onChange={(e) =>
          setAddressData((prev) => ({
            ...prev,
            district: e.target.value,
            city: "",
            pincode: "",
          }))
        }
        disabled={!districts.length}
        className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        <option value="">Select District</option>
        {districts.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* CITY/VILLAGE */}
      {addressData.district &&
      (districtCities[addressData.district] || []).length > 0 ? (
        <select
          value={addressData.city || ""}
          onChange={(e) => handleCityChange(e.target.value)}
          className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="">Select City / Village</option>
          {(districtCities[addressData.district] || []).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder="Enter City / Village"
          value={addressData.city || ""}
          onChange={(e) => handleCityChange(e.target.value)}
          className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      )}

      {/* PINCODE */}
      <div className="relative" ref={suggestionsRef}>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          placeholder="Pin Code"
          value={addressData.pincode || ""}
          onChange={(e) => handlePincodeInput(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          onFocus={() => setShowSuggestions(true)}
          className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute z-50 left-0 right-0 mt-1 max-h-40 overflow-auto rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg">
            {filteredSuggestions.map((pin) => (
              <li
                key={pin}
                onClick={() => handleSelectSuggestion(pin)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                {pin}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
