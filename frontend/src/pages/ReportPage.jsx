// src/pages/ReportPage.jsx
import React, { useRef, useState, useEffect } from "react";
import CategorySelection from "../components/report/CategorySelection";
import LocationInput from "../components/report/LocationInput";
import MediaUploadSection from "../components/report/MediaUploadSection";
import DescriptionInput from "../components/report/DescriptionInput";
import toast from "react-hot-toast";

const ReportPage = () => {
  const locationRef = useRef(null);

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
  const [trackingId, setTrackingId] = useState(null);

  // -----------------------------
  // Media Previews
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
      mediaFiles.forEach((file) => formData.append("mediaFiles", file));

      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.trackingId) {
        setTrackingId(data.trackingId);
        toast.success(`Report submitted! Tracking ID: ${data.trackingId}`, { duration: 8000 });

        // Reset form
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

  const handleCopyTrackingId = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      toast.success("Tracking ID copied!");
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
        Report a Civic Issue
      </h1>

      <CategorySelection
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      <div ref={locationRef}>
        <LocationInput
          location={location}
          setLocation={setLocation}
          addressData={addressData}
          setAddressData={setAddressData}
        />
      </div>

      <MediaUploadSection
        mediaFiles={mediaFiles}
        setMediaFiles={setMediaFiles}
      />

      <DescriptionInput
        description={description}
        setDescription={setDescription}
      />

      {/* Consent */}
      <div className="max-w-2xl mx-auto mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="consent"
          checked={consent}
          onChange={() => setConsent(!consent)}
          className="w-4 h-4 accent-blue-500"
        />
        <label htmlFor="consent" className="text-gray-700 dark:text-gray-300 text-sm">
          I consent to submit this report
        </label>
      </div>

      {/* Submit Button */}
      <div className="max-w-2xl mx-auto p-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={!selectedCategory || !location || !addressData.address || !consent || loading}
          className={`w-full font-semibold py-3 px-4 rounded-md transition ${
            !selectedCategory || !location || !addressData.address || !consent
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>

      {/* ✅ Glassy Tracking ID Modal */}
      {trackingId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

          <div className="relative bg-white/30 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-white/20 dark:border-gray-700/50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Report Submitted Successfully 🎉
            </h2>
            <p className="text-gray-800 dark:text-gray-300 mb-6">
              Your Tracking ID:
              <br />
              <span className="font-mono text-blue-600 dark:text-blue-400 text-lg">
                {trackingId}
              </span>
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleCopyTrackingId}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
              >
                Copy ID
              </button>
              <button
                onClick={() => setTrackingId(null)}
                className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
