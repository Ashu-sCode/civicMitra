import React, { useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Import your components
import CategorySelection from "../components/ReportPage/CategorySelection";
import LocationSelection from "../components/ReportPage/LocationSelection";
import MediaUploadSection from "../components/ReportPage/MediaUploadSection";
import DescriptionInput from "../components/ReportPage/DescriptionInput";


const ReportPage = () => {
  // State for report
  const [reportData, setReportData] = useState({
    category: null,
    location: null,
    media: [],
    description: "",
    contact: "",
  });

  // Refs for auto-scroll
  const locationRef = useRef(null);
  const mediaRef = useRef(null);
  const descriptionRef = useRef(null);
  const reviewRef = useRef(null);

  const handleCategorySelect = (category) => {
    setReportData((prev) => ({ ...prev, category }));
    // Scroll to location section
    locationRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleLocationSelect = (location) => {
    setReportData((prev) => ({ ...prev, location }));
    // Scroll to media upload section
    mediaRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleMediaUpload = (media) => {
    setReportData((prev) => ({ ...prev, media }));
    // Scroll to description section
    descriptionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDescriptionInput = (description) => {
    setReportData((prev) => ({ ...prev, description }));
    // Scroll to review section
    reviewRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = () => {
    // TODO: Send reportData to backend API
    console.log("Submitting report:", reportData);
  };

  return (
    <div className="report-page w-full max-w-5xl mx-auto p-4 space-y-8 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Submit Civic Issue Report
      </h1>

      {/* 1️⃣ Category Selection */}
      <section>
        <CategorySelection
          categories={/* pass your categories data */}
          onCategorySelect={handleCategorySelect}
          nextSectionRef={locationRef}
        />
      </section>

      {/* 2️⃣ Location Selection */}
      <section ref={locationRef}>
        <LocationSelection
          onLocationSelect={handleLocationSelect}
          initialLocation={reportData.location}
        />
      </section>

      {/* 3️⃣ Media Upload */}
      <section ref={mediaRef}>
        <MediaUpload onUpload={handleMediaUpload} initialMedia={reportData.media} />
      </section>

      {/* 4️⃣ Description */}
      <section ref={descriptionRef}>
        <DescriptionInput
          onChange={handleDescriptionInput}
          initialValue={reportData.description}
        />
      </section>

      {/* 5️⃣ Review & Submit */}
      <section ref={reviewRef}>
        <ReviewSubmit
          reportData={reportData}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
};

export default ReportPage;
