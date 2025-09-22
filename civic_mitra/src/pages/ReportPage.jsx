// src/pages/ReportPage.jsx
import React, { useRef, useState } from "react";
import CategorySelection from "../components/ReportPage/CategorySelection";
import LocationInput from "../components/ReportPage/LocationInput";
import { categories as categoryGroups } from "../data/categories";

const ReportPage = () => {
  // -----------------------------
  // States
  // -----------------------------
  const locationRef = useRef(null);

  // Selected category name
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Map location
  const [location, setLocation] = useState(null); // {lat, lng}

  // Address details
  const [addressData, setAddressData] = useState({
    address: "",
    city: "",
    district: "",
    state: "",
    country: "",
  });

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);

    // Scroll to location input smoothly
    if (locationRef.current) {
      locationRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategory || !location || !addressData.address) {
      alert("Please select a category and provide location details!");
      return;
    }

    console.log("Report Submitted:", {
      category: selectedCategory,
      location,
      addressData,
    });

    alert(
      `Report submitted successfully for "${selectedCategory}" at "${addressData.address}"`
    );

    // Reset everything
    setSelectedCategory(null);
    setLocation(null);
    setAddressData({
      address: "",
      city: "",
      district: "",
      state: "",
      country: "",
    });
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
        Civic Issue Reporting
      </h1>

      {/* Category Selection */}
      <CategorySelection
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* Location Input */}
      <LocationInput
        location={location}
        setLocation={setLocation}
        addressData={addressData}
        setAddressData={setAddressData}
        nextRef={locationRef}
      />

      {/* Submit Button */}
      <div className="max-w-2xl mx-auto p-4 mt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition"
        >
          Submit Report
        </button>
      </div>

      {/* Optional Summary */}
      {selectedCategory && location && addressData.address && (
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 font-semibold">
            You are reporting: <span className="italic">{selectedCategory}</span> at "
            <span className="italic">{addressData.address}</span>"
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
            {addressData.city}, {addressData.district}, {addressData.state},{" "}
            {addressData.country}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
