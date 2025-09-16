import React, { useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Upload,
  Check,
  Wifi,
  WifiOff,
  Phone,
  User,
  MessageSquare,
  Folder,
  ChevronDown,
} from "lucide-react";

const ReportPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    category: "",
    description: "",
    location: "",
    photo: null,
  });
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Check for dark mode preference
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(darkModePreference);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  const categories = [
    { value: "", label: "Select Category" },
    { value: "road", label: "🛣️ Road & Traffic" },
    { value: "water", label: "💧 Water Supply" },
    { value: "electricity", label: "💡 Electricity" },
    { value: "sanitation", label: "🧹 Sanitation" },
    { value: "streetlight", label: "🕯️ Street Lighting" },
    { value: "drainage", label: "🌊 Drainage" },
    { value: "other", label: "📋 Other" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, photo: file }));

      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    setLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          handleInputChange("location", `GPS: ${lat}, ${lng}`);
          setLocationLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          handleInputChange("location", "Location unavailable");
          setLocationLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      handleInputChange("location", "GPS not supported");
      setLocationLoading(false);
    }
  };

  // Simulate IndexedDB storage (offline-first approach)
  const saveToIndexedDB = async (data) => {
    // In real implementation, this would store in IndexedDB
    const reportId = "CIVIC" + Date.now();
    const reportData = {
      ...data,
      id: reportId,
      timestamp: new Date().toISOString(),
      status: "saved_offline",
      synced: isOnline,
    };

    console.log("Saved to IndexedDB:", reportData);
    return reportId;
  };

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.mobileNumber ||
      !formData.category ||
      !formData.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setFormData({
            fullName: "",
            mobileNumber: "",
            category: "",
            description: "",
            location: "",
            photo: null,
          });
          setPhotoPreview(null);
          setIsSubmitted(false);
        }, 3000);
      } else {
        alert("Error saving report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error submitting report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


       
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-gray-100"
      }`}
    >
      {/* Status Bar */}
      <div
        className={`sticky top-0 z-10 border-b transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white/90 border-gray-200"
        } backdrop-blur-sm`}
      >
   ) => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {isDarkMode ? "🌞" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 md:max-w-2xl lg:py-8">
    

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Complainant Details */}
          <div
            className={`rounded-2xl p-6 shadow-lg transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-lg ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      handleInputChange("mobileNumber", e.target.value)
                    }
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Issue Details */}
          <div
            className={`rounded-2xl p-6 shadow-lg transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
              Issue Details
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category *
                </label>
                <div className="relative">
                  <Folder
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-lg appearance-none ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows="4"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-lg resize-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Describe the issue in detail..."
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div
            className={`rounded-2xl p-6 shadow-lg transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <MapPin className="w-5 h-5 mr-2 text-red-500" />
              Location
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter location manually or use GPS"
              />

              <button
                type="button"
                onClick={getLocation}
                disabled={locationLoading}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-xl border-2 border-dashed transition-colors text-lg font-medium ${
                  locationLoading
                    ? isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-400"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                    : isDarkMode
                    ? "bg-gray-700 border-gray-600 text-blue-400 hover:bg-gray-600"
                    : "bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100"
                }`}
              >
                <MapPin className="w-5 h-5 mr-2" />
                {locationLoading ? "Getting Location..." : "📍 Auto-Detect GPS"}
              </button>
            </div>
          </div>

          {/* Photo Upload */}
          <div
            className={`rounded-2xl p-6 shadow-lg transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Camera className="w-5 h-5 mr-2 text-purple-500" />
              Photo Upload (Optional)
            </h2>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />

              <label
                htmlFor="photo-upload"
                className={`block w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors text-center ${
                  isDarkMode
                    ? "border-gray-600 hover:border-gray-500 hover:bg-gray-700"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <Upload
                  className={`w-8 h-8 mx-auto mb-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-lg font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  📸 Tap to upload photo
                </span>
                <p
                  className={`text-sm mt-1 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  JPG, PNG up to 10MB
                </p>
              </label>

              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setFormData((prev) => ({ ...prev, photo: null }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-2xl text-white text-xl font-bold shadow-lg transition-all transform ${
              isSubmitting
                ? "bg-gray-400 scale-95"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                🚀 Submit Report
              </div>
            )}
          </button>

          {/* Offline Notice */}
          {!isOnline && (
            <div
              className={`text-center p-4 rounded-xl border ${
                isDarkMode
                  ? "bg-orange-900/20 border-orange-700 text-orange-300"
                  : "bg-orange-50 border-orange-200 text-orange-800"
              }`}
            >
              <WifiOff className="w-5 h-5 mx-auto mb-2 text-orange-600" />
              <p className="font-medium">Working Offline</p>
              <p className="text-sm mt-1">
                Your report will be saved locally and synced when you're back
                online.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
