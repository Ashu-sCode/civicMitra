// src/components/Report/CategorySelection.jsx
import { useState, useEffect, useRef } from "react";
import { categories as categoryGroups } from "../../data/categories";
import {
  AlertCircle,
  Car,
  Trash2,
  Droplet,
  Shield,
  Book,
  Star,
} from "lucide-react";

// --- Common issues for quick access ---
const commonIssues = [
  { name: "Potholes", icon: Car, tooltip: "Road damage or potholes" },
  { name: "Garbage Overflow", icon: Trash2, tooltip: "Uncollected waste or litter" },
  { name: "Water Leakage", icon: Droplet, tooltip: "Broken pipelines or leakage" },
  { name: "Streetlight Not Working", icon: Shield, tooltip: "Streetlight outage" },
  { name: "School/Library Issue", icon: Book, tooltip: "School or library maintenance" },
  { name: "Other", icon: Star, tooltip: "Any other civic issue" },
];

export default function CategorySelection({ onCategorySelect, selectedCategory }) {
  const [selectedSub, setSelectedSub] = useState(selectedCategory || null);
  const [showMore, setShowMore] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const selectionRef = useRef(null);

  // Scroll into view when subcategory selected
  useEffect(() => {
    if (selectedSub && selectionRef.current) {
      selectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedSub]);

  const handleSelectSub = (sub) => {
    setSelectedSub(sub.name);
    onCategorySelect(sub.name);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroup((prev) => (prev === groupName ? null : groupName));
  };

  const renderButton = (sub) => {
    const Icon = sub.icon || AlertCircle;
    const isSelected = selectedSub === sub.name;

    return (
      <button
        key={sub.name}
        onClick={() => handleSelectSub(sub)}
        ref={isSelected ? selectionRef : null}
        title={sub.tooltip || ""}
        className={`flex flex-col justify-center items-center p-4 min-h-[120px] rounded-xl shadow transition-transform transform hover:scale-105 w-full
          ${isSelected
            ? "border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900"
            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 opacity-90"
          }`}
      >
        <Icon className="w-6 h-6 text-indigo-500" />
        <span className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
          {sub.name}
        </span>
      </button>
    );
  };

  return (
    <section className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
        Select an Issue
      </h2>

      {/* --- Common Issues --- */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Common Issues
        </h3>
        <div className="flex gap-3 overflow-x-auto py-2 snap-x snap-mandatory">
          {commonIssues.map((sub) => (
            <div key={sub.name} className="flex-shrink-0 w-32 snap-start">
              {renderButton(sub)}
            </div>
          ))}
        </div>
      </div>

      {/* --- More Issues Toggle --- */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          {showMore ? "Hide More Issues" : "More Issues"}
        </button>
      </div>

      {/* --- More Issues Groups --- */}
      {showMore &&
        categoryGroups.map((group) => (
          <div key={group.group} className="mb-4">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.group)}
              className="w-full flex justify-between items-center p-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold text-gray-800 dark:text-gray-200 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              <span>{group.group}</span>
              <span>{expandedGroup === group.group ? "−" : "+"}</span>
            </button>

            {/* Subcategories Grid */}
            {expandedGroup === group.group && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                {group.subcategories.map((sub) => (
                  <div key={sub.name}>{renderButton(sub)}</div>
                ))}
              </div>
            )}
          </div>
        ))}
    </section>
  );
}
