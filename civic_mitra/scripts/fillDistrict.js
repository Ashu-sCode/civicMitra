// scripts/fillDistrict.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const statesPath = path.resolve(__dirname, "../src/data/india/states.json");
const stateDistrictsPath = path.resolve(__dirname, "../src/data/india/stateDistricts.json");
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

// Fill districts
stateDistrictsData.states.forEach((stateData) => {
  const stateEntry = states.find((s) => s.stateName === stateData.state);
  if (stateEntry) {
    stateEntry.districts = stateData.districts;

    // Write individual district file
    const filePath = path.join(outputDir, `district-${stateEntry.stateCode}.json`);
    fs.writeFileSync(
      filePath,
      JSON.stringify({
        stateCode: stateEntry.stateCode,
        stateName: stateEntry.stateName,
        districts: stateEntry.districts,
      }, null, 2),
      "utf8"
    );

    console.log(`✅ Created: ${filePath}`);
  } else {
    console.warn(`⚠️ State not found for: ${stateData.state}`);
  }
});

console.log("🎉 All district files created successfully!");
