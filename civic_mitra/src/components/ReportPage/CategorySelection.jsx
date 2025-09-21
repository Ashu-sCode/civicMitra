import React, { useState, useContext, useEffect } from 'react';

// ThemeContext (assuming this exists in your app)
// const ThemeContext = React.createContext();

const CategorySelection = ({ 
  categories, 
  onCategorySelect, 
  nextSectionRef 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Assuming ThemeContext provides { theme, toggleTheme } where theme is 'light' or 'dark'
  // const { theme } = useContext(ThemeContext);

  // Icon mapping for each category
  const getCategoryIcon = (category) => {
    const iconMap = {
      "Roads & Transport Issues": "🛣️",
      "Sanitation & Solid Waste": "🗑️",
      "Water Supply & Sewerage": "💧",
      "Streetlights & Electricity": "💡",
      "Environment & Public Health": "🌱",
      "Parks & Public Spaces": "🌳",
      "Public Safety & Law": "🚔",
      "Civic Infrastructure": "🏗️",
      "Education & Libraries": "📚",
      "Disaster & Emergency": "🚨",
      "Urban Planning & Zoning": "🏙️",
      "Animal Welfare & Control": "🐕",
      "Roads & Traffic Safety": "🚦",
      "Citizen Services & Grievances": "📋",
      "Drinking Water & Quality": "🚰",
      "Street Cleaning": "🧹",
      "Heritage & Monuments": "🏛️",
      "Markets & Trade": "🏪",
      "Transport & Public Vehicles": "🚌",
      "Lighting & Street Safety": "🔦"
    };
    return iconMap[category] || "📝";
  };

  // Handle category selection
  const handleCategorySelect = (category, index) => {
    setSelectedCategory(category);
    setFocusedIndex(index);
    
    // Call the parent callback
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    
    // Smooth scroll to next section
    if (nextSectionRef?.current) {
      setTimeout(() => {
        nextSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 300); // Small delay for better UX
    }
  };

  // Keyboard navigation
  const handleKeyDown = (event, category, index) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleCategorySelect(category, index);
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (index + 1) % categories.length;
        setFocusedIndex(nextIndex);
        document.getElementById(`category-${nextIndex}`)?.focus();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = index === 0 ? categories.length - 1 : index - 1;
        setFocusedIndex(prevIndex);
        document.getElementById(`category-${prevIndex}`)?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        const downIndex = Math.min(index + 4, categories.length - 1); // Assuming 4 columns
        setFocusedIndex(downIndex);
        document.getElementById(`category-${downIndex}`)?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const upIndex = Math.max(index - 4, 0); // Assuming 4 columns
        setFocusedIndex(upIndex);
        document.getElementById(`category-${upIndex}`)?.focus();
        break;
    }
  };

  return (
    <div className="w-full px-4 py-6">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Select Issue Category
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
          Choose the category that best describes your civic issue. This helps us route your report to the right department.
        </p>
      </div>

      {/* Categories Grid */}
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto"
        role="radiogroup"
        aria-label="Select issue category"
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory?.category === category.category;
          const isFocused = focusedIndex === index;
          
          return (
            <div
              key={category.category}
              id={`category-${index}`}
              className={`
                card cursor-pointer rounded-lg p-3 md:p-4 shadow-md transition-all duration-200 transform 
                hover:scale-105 hover:shadow-lg dark:shadow-lg
                min-h-[120px] md:min-h-[140px]
                flex flex-col items-center text-center
                bg-white dark:bg-gray-800
                border-2 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                active:scale-95
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-blue-200 dark:shadow-blue-800' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }
                ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''}
              `}
              onClick={() => handleCategorySelect(category, index)}
              onKeyDown={(e) => handleKeyDown(e, category, index)}
              tabIndex={0}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${category.category}: ${category.description}`}
              aria-describedby={`desc-${index}`}
            >
              {/* Category Icon */}
              <div className="text-2xl md:text-3xl mb-2 md:mb-3">
                {getCategoryIcon(category.category)}
              </div>
              
              {/* Category Title */}
              <h3 className={`
                card-title text-sm md:text-base font-semibold mb-1 md:mb-2 leading-tight
                text-gray-900 dark:text-gray-100
                ${isSelected ? 'text-blue-700 dark:text-blue-300' : ''}
              `}>
                {category.category}
              </h3>
              
              {/* Category Description */}
              <p 
                id={`desc-${index}`}
                className={`
                  card-desc text-xs md:text-sm leading-tight line-clamp-3
                  text-gray-700 dark:text-gray-300
                  ${isSelected ? 'text-blue-600 dark:text-blue-400' : ''}
                `}
              >
                {category.description}
              </p>
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="mt-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Category Summary */}
      {selectedCategory && (
        <div className="mt-8 p-4 md:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{getCategoryIcon(selectedCategory.category)}</div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Selected: {selectedCategory.category}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm md:text-base mb-3">
                {selectedCategory.description}
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="text-sm">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Urban Department:</span>
                  <br />
                  <span className="text-blue-700 dark:text-blue-300">{selectedCategory.urbanDept}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Rural Department:</span>
                  <br />
                  <span className="text-blue-700 dark:text-blue-300">{selectedCategory.ruralDept}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Use arrow keys to navigate • Press Enter or Space to select • {categories.length} categories available
        </p>
      </div>
    </div>
  );
};

// Default categories data
CategorySelection.defaultProps = {
  categories: [
    { "category": "Roads & Transport Issues", "description": "Potholes, broken roads, speed breakers, traffic signals, illegal parking", "urbanDept": "Public Works Dept / Municipal Engineering / Transport Dept", "ruralDept": "Rural Development Dept / Panchayat Roads / Block Dev Office" },
    { "category": "Sanitation & Solid Waste", "description": "Overflowing bins, uncollected waste, illegal dumping, stray animals", "urbanDept": "Municipal Sanitation Dept / Swachh Bharat Mission Urban", "ruralDept": "Panchayati Raj Dept / Swachh Bharat Mission Gramin" },
    { "category": "Water Supply & Sewerage", "description": "Broken pipelines, blocked drains, waterlogging, sewage overflow", "urbanDept": "Jal Board / Municipal Sewerage Dept", "ruralDept": "Panchayat Water & Sanitation Dept" },
    { "category": "Streetlights & Electricity", "description": "Broken streetlights, electrical hazards, low illumination", "urbanDept": "Municipal Electrical Dept / DISCOM", "ruralDept": "Rural Electricity / DISCOM" },
    { "category": "Environment & Public Health", "description": "Open burning, pollution, mosquito breeding, stray animals", "urbanDept": "Municipal Health Dept / Pollution Control Board", "ruralDept": "Rural Health Dept / Animal Husbandry Dept" },
    { "category": "Parks & Public Spaces", "description": "Damaged benches, broken swings, unmaintained parks, encroachments", "urbanDept": "Municipal Horticulture Dept / Urban Development", "ruralDept": "Panchayat Parks / Community Development Dept" },
    { "category": "Public Safety & Law", "description": "Eve-teasing spots, broken CCTV, harassment, unauthorized construction", "urbanDept": "Local Police / Municipal Enforcement Wing", "ruralDept": "Police / Gram Panchayat Enforcement" },
    { "category": "Civic Infrastructure", "description": "Broken public toilets, bus stops, signage", "urbanDept": "Municipal Infrastructure / Transport Dept", "ruralDept": "Panchayat Infrastructure / Transport Dept" },
    { "category": "Education & Libraries", "description": "School repairs, library maintenance, water & sanitation in schools", "urbanDept": "Municipal Education Dept / School Authority", "ruralDept": "Block Education Officer / Panchayat Schools" },
    { "category": "Disaster & Emergency", "description": "Floods, fire hazards, landslides, accidents", "urbanDept": "Fire Dept / Emergency Services / Municipal Disaster Management", "ruralDept": "Block Emergency Services / Panchayat Disaster Management" },
    { "category": "Urban Planning & Zoning", "description": "Unauthorized construction, land use violations", "urbanDept": "Town Planning / Building Dept", "ruralDept": "Panchayat / Revenue Dept / Rural Development" },
    { "category": "Animal Welfare & Control", "description": "Stray animals, dog bites, dead animals, livestock management", "urbanDept": "Municipal Animal Control / Health", "ruralDept": "Animal Husbandry / Panchayat Health Officer" },
    { "category": "Roads & Traffic Safety", "description": "Missing signage, speed bumps, unsafe intersections", "urbanDept": "Transport Dept / Traffic Police", "ruralDept": "Panchayat / Block Transport Officer" },
    { "category": "Citizen Services & Grievances", "description": "Delayed services, complaints about civic workers", "urbanDept": "Municipal Grievance Cell / Citizen Services", "ruralDept": "Panchayat / Block Development Office" },
    { "category": "Drinking Water & Quality", "description": "Contaminated water, low pressure, handpump repairs", "urbanDept": "Water Supply Board / Public Health", "ruralDept": "Panchayat Water Dept / Rural Health" },
    { "category": "Street Cleaning", "description": "Dust, blocked gutters, fallen branches", "urbanDept": "Sanitation / Cleaning Dept", "ruralDept": "Panchayat Sanitation / Volunteers" },
    { "category": "Heritage & Monuments", "description": "Vandalism, poor maintenance", "urbanDept": "Municipal Heritage / Tourism Dept", "ruralDept": "Panchayat / State Archaeology / Tourism" },
    { "category": "Markets & Trade", "description": "Illegal stalls, poor hygiene, drainage issues", "urbanDept": "Municipal Market / Licensing", "ruralDept": "Panchayat / Block Market Officer" },
    { "category": "Transport & Public Vehicles", "description": "Broken bus stops, unsafe vehicles, abandoned vehicles", "urbanDept": "Transport Dept / Municipal Transport", "ruralDept": "Block Transport / Panchayat" },
    { "category": "Lighting & Street Safety", "description": "Streetlight outages, poorly lit alleys", "urbanDept": "Electrical Dept / Municipal Public Works", "ruralDept": "Rural Electricity / Panchayat" }
  ]
};

export default CategorySelection;