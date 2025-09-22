// src/components/Report/CategorySelection.jsx
import { useState } from "react";
import { categories as categoryGroups } from "../../data/categories";

export default function CategorySelection({ onCategorySelect }) {
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <section className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        {selectedGroup ? "Choose a Subcategory" : "Select an Issue Category"}
      </h2>

      {/* Step 1: Show groups */}
      {!selectedGroup && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categoryGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <button
                key={idx}
                onClick={() => setSelectedGroup(group)}
                className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
              >
                <Icon className="w-6 h-6 text-blue-500" />
                <span className="mt-2 text-sm font-medium text-center">
                  {group.group}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: Show subcategories */}
      {selectedGroup && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {selectedGroup.subcategories.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onCategorySelect(sub.name)}
                  className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
                >
                  <Icon className="w-6 h-6 text-indigo-500" />
                  <span className="mt-2 text-sm font-medium text-center">
                    {sub.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Back button */}
          <div className="text-center mt-6">
            <button
              onClick={() => setSelectedGroup(null)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              ← Back to Categories
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
