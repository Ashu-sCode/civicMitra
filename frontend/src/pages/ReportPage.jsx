// src/pages/ReportPage.jsx
import React, { useRef, useState, useEffect } from "react";
import CategorySelection from "../components/report/CategorySelection";
import LocationInput from "../components/report/LocationInput";
import MediaUploadSection from "../components/report/MediaUploadSection";
import DescriptionInput from "../components/report/DescriptionInput";
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
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [location, setLocation] = useState(null);
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
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("Normal"); // priority kept separate

  // -----------------------------
  // Effects - Generate Previews
  // -----------------------------
  useEffect(() => {
    if (!mediaFiles.length) {
      setMediaPreviews([]);
      return;
    }

    const previews = mediaFiles.map((file) => URL.createObjectURL(file));
    setMediaPreviews(previews);

    return () => previews.forEach((url) => URL.revokeObjectURL(url));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !location || !addressData.address) {
      toast.error("Please select a category and provide location details!");
      return;
    }

    if (!consent) {
      toast.error("Please provide consent to submit the report.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("category", selectedCategory);
      formData.append("description", description);
      formData.append("location", JSON.stringify(location));
      formData.append("addressData", JSON.stringify(addressData));
      formData.append("priority", priority); // separate priority
      mediaFiles.forEach((file) => formData.append("mediaFiles", file));

      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Report submitted successfully! Priority: ${priority}`, { duration: 5000 });
        console.log("✅ Report Saved:", data);

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
        setPriority("Normal");
      } else {
        toast.error(data.error || "Failed to submit report");
      }
    } catch (error) {
      console.error("❌ Submit Error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
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
      <CategorySelection onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />

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

      {/* Priority Selector */}
      <div className="max-w-2xl mx-auto mt-4">
        <label className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-1 block">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

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
          disabled={loading || !selectedCategory || !location || !addressData.address || !consent}
          className={`w-full font-semibold py-3 px-4 rounded-md transition ${
            !selectedCategory || !location || !addressData.address || !consent
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Submitting..." : "Submit Report"}
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

          {/* Priority preview */}
          <p className="text-gray-800 dark:text-gray-200 mt-1 text-sm">
            <strong>Priority:</strong> {priority}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
