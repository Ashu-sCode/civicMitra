// src/pages/ReportPage.jsx
import React, { useRef, useState, useEffect } from "react";
import CategorySelection from "../components/ReportPage/CategorySelection";
import LocationInput from "../components/ReportPage/LocationInput";
import MediaUploadSection from "../components/ReportPage/MediaUploadSection";
import DescriptionInput from "../components/ReportPage/DescriptionInput";
import toast from "react-hot-toast";

const ReportPage = () => {
  // -----------------------------
  // Refs
  // -----------------------------
  const locationRef = useRef(null);

  // -----------------------------
  // States
  // -----------------------------
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]); // store File objects
  const [mediaPreviews, setMediaPreviews] = useState([]); // for previews
  const [location, setLocation] = useState(null); // {lat, lng}
  const [addressData, setAddressData] = useState({
    address: "",
    city: "",
    district: "",
    state: "",
    stateCode: "",
    country: "India",
    pincode: "",
  });
  const [description, setDescription] = useState("");
  const [consent, setConsent] = useState(false);

  // -----------------------------
  // Effects - Generate Previews
  // -----------------------------
  useEffect(() => {
    if (mediaFiles.length < 1) return;

    const previews = mediaFiles.map((file) => URL.createObjectURL(file));
    setMediaPreviews(previews);

    // cleanup memory when files change
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaFiles]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    if (locationRef.current) {
      locationRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategory || !location || !addressData.address) {
      toast.error("Please select a category and provide location details!");
      return;
    }

    if (!consent) {
      toast.error("Please provide consent to submit the report.");
      return;
    }

    // Extract file names for backend
    const mediaFileNames = mediaFiles.map((file) => file.name);

    const reportData = {
      category: selectedCategory,
      location,
      addressData,
      description,
      mediaFiles: mediaFileNames,
    };

    console.log("✅ Report Submitted:", reportData);

    toast.success(
      `Report submitted successfully for "${selectedCategory}" at "${addressData.address}"`,
      { position: "top-right", duration: 5000 }
    );

    // Reset all states
    setSelectedCategory(null);
    setLocation(null);
    setAddressData({
      address: "",
      city: "",
      district: "",
      state: "",
      stateCode: "",
      country: "India",
      pincode: "",
    });
    setDescription("");
    setMediaFiles([]);
    setMediaPreviews([]);
    setConsent(false);
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
      <div ref={locationRef}>
        <LocationInput
          location={location}
          setLocation={setLocation}
          addressData={addressData}
          setAddressData={setAddressData}
        />
      </div>

      {/* Media Upload */}
      <MediaUploadSection mediaFiles={mediaFiles} setMediaFiles={setMediaFiles} />

      {/* Description Input */}
      <DescriptionInput description={description} setDescription={setDescription} />

      {/* Consent */}
      <div className="max-w-2xl mx-auto mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="consent"
          checked={consent}
          onChange={() => setConsent(!consent)}
          className="w-4 h-4"
        />
        <label htmlFor="consent" className="text-gray-700 dark:text-gray-300 text-sm">
          I consent to submit this report
        </label>
      </div>

      {/* Submit Button */}
      <div className="max-w-2xl mx-auto p-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={!selectedCategory || !location || !addressData.address || !consent}
          className={`w-full font-semibold py-3 px-4 rounded-md transition 
            ${
              !selectedCategory || !location || !addressData.address || !consent
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            }`}
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
            {addressData.city && `${addressData.city}, `}
            {addressData.district && `${addressData.district}, `}
            {addressData.state && `${addressData.state}, `}
            {addressData.country}
            {addressData.pincode && ` - ${addressData.pincode}`}
          </p>

          {/* Media Thumbnails */}
          {mediaPreviews.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {mediaPreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-16 h-16 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                />
              ))}
            </div>
          )}

          {/* Description preview */}
          {description && (
            <p className="text-gray-800 dark:text-gray-200 mt-2 text-sm">
              <strong>Details:</strong> {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
