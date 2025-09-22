// src/components/Report/AddressForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddressForm({ addressData, setAddressData }) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Fetch cities based on pincode
  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    setAddressData({ ...addressData, pincode });
    setShowCityDropdown(false);

    if (pincode.length === 6) {
      fetchFromPincode(pincode);
    }
  };

  const fetchFromPincode = async (pincode) => {
    try {
      const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (res.data[0].Status === "Success") {
        const postOffices = res.data[0].PostOffice;
        if (postOffices && postOffices.length > 0) {
          setAddressData((prev) => ({
            ...prev,
            state: postOffices[0].State,
            district: postOffices[0].District,
            cityOptions: postOffices.map((po) => po.Name),
            city: postOffices[0].Name,
          }));
          setShowCityDropdown(true);
        }
      }
    } catch (err) {
      console.error("Pincode API failed", err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {/* State */}
      <input
        type="text"
        placeholder="State"
        value={addressData.state}
        onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
        className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />

      {/* District */}
      <input
        type="text"
        placeholder="District"
        value={addressData.district}
        onChange={(e) => setAddressData({ ...addressData, district: e.target.value })}
        className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />

      {/* City / Village dropdown */}
      {showCityDropdown && addressData.cityOptions?.length > 0 ? (
        <select
          value={addressData.city}
          onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
          className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          {addressData.cityOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder="City / Village"
          value={addressData.city}
          onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
          className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      )}

      {/* Pin Code */}
      <input
        type="text"
        placeholder="Pin Code"
        value={addressData.pincode}
        onChange={handlePincodeChange}
        maxLength={6}
        className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>
  );
}
