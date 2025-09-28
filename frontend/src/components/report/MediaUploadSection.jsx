// src/components/Report/MediaUploadSection.jsx
import React, { useState, useRef } from "react";

export default function MediaUploadSection({ mediaFiles, setMediaFiles }) {
  const fileInputRef = useRef();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
      <label className="block mb-2 text-gray-800 dark:text-gray-200 font-semibold">
        Attach Media 
      </label>

      <div className="flex flex-wrap gap-4">
        {mediaFiles.map((file, index) => {
          const url = typeof file === "string" ? file : URL.createObjectURL(file);
          return (
            <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
              <img
                src={url}
                alt={`media-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          );
        })}

        {/* Add new media */}
        <button
          type="button"
          onClick={openFileDialog}
          className="w-24 h-24 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-md flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition"
        >
          <span className="text-xl font-bold">+</span>
          <span className="text-xs text-center">Add</span>
        </button>
      </div>

      {/* Hidden file input for images / camera */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
