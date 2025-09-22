// scripts/fillDistrictWithCities.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const statesPath = path.resolve(__dirname, "../src/data/india/states.json");
const stateDistrictsPath = path.resolve(__dirname, "../src/data/india/stateDistricts.json");
const citiesPath = path.resolve(__dirname, "../src/data/india/cities.json"); // your cities dataset
const outputDir = path.resolve(__dirname, "../src/data/india/districts");

// Create output directory if not exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read states.json
const statesObj = JSON.parse(fs.readFileSync(statesPath, "utf8"));
const states = Object.entries(statesObj).map(([code, name]) => ({
  stateCode: code,
  stateName: name,
  districts: [],
}));

// Read stateDistricts.json
const stateDistrictsData = JSON.parse(fs.readFileSync(stateDistrictsPath, "utf8"));

// Read cities.json
const citiesData = JSON.parse(fs.readFileSync(citiesPath, "utf8"));

// Function to map cities to districts
const mapCitiesToDistricts = (stateName, districts) => {
  const citiesInState = citiesData.filter(c => c.admin_name === stateName);
  const districtCityMap = {};

  districts.forEach(district => {
    districtCityMap[district] = citiesInState
      .filter(c => c.city.toLowerCase() === district.toLowerCase())
      .map(c => c.city);
  });

  // Put unmatched cities into "Misc" district
  const matchedCities = Object.values(districtCityMap).flat();
  const miscCities = citiesInState
    .filter(c => !matchedCities.includes(c.city))
    .map(c => c.city);

  if (miscCities.length) districtCityMap["Misc"] = miscCities;

  return districtCityMap;
};

// Fill districts with cities
stateDistrictsData.states.forEach((stateData) => {
  const stateEntry = states.find((s) => s.stateName === stateData.state);
  if (stateEntry) {
    stateEntry.districts = stateData.districts;

    // Map cities to districts
    const districtCityMap = mapCitiesToDistricts(stateEntry.stateName, stateEntry.districts);

    // Write individual district file
    const filePath = path.join(outputDir, `district-${stateEntry.stateCode}.json`);
    fs.writeFileSync(
      filePath,
      JSON.stringify({
        stateCode: stateEntry.stateCode,
        stateName: stateEntry.stateName,
        districts: districtCityMap, // now districts have cities
      }, null, 2),
      "utf8"
    );

    console.log(`✅ Created: ${filePath}`);
  } else {
    console.warn(`⚠️ State not found for: ${stateData.state}`);
  }
});

console.log("🎉 All district files with cities created successfully!");
