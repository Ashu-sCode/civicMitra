import React, { useRef, useState, useContext } from "react";
import { categories } from '../data/categories'; // adjust path if needed

import CategorySelection from "../components/ReportPage/CategorySelection";



const ReportPage = () => {

  const locationRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [location, setLocation] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory || !location) {
      alert("Please select a category and enter location!");
      return;
    }
    console.log("Report Submitted:", { category: selectedCategory, location });
    alert(`Report submitted successfully for ${selectedCategory.category}`);
    // Reset form if needed
    setSelectedCategory(null);
    setLocation("");
  };

  return (
    <div className={`min-h-screen  transition-colors duration-300`}>
      
   
      {/* Category Selection */}
      <CategorySelection
        categories={categories}
        onCategorySelect={handleCategorySelect}
        nextSectionRef={locationRef}
      />

      {/* Location Section */}
      <div
        ref={locationRef}
        className="mt-12 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg transition"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Enter Location
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter exact location or landmark"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Submit Report
          </button>
        </form>

        {/* Optional Summary */}
        {selectedCategory && location && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 font-semibold">
              You are reporting: {selectedCategory.category} at "{location}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
