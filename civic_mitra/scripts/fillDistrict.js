// scripts/fillDistrict.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const statesPath = path.resolve(__dirname, "../src/data/india/states.json");
const stateDistrictsPath = path.resolve(__dirname, "../src/data/india/stateDistricts.json");
const outputDir = path.resolve(__dirname, "../src/data/india/districts");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Read states.json
const statesObj = JSON.parse(fs.readFileSync(statesPath, "utf8"));
const states = Object.entries(statesObj).map(([code, name]) => ({
  stateCode: code,
  stateName: name,
  districts: [],
}));

// Read stateDistricts.json
const stateDistrictsData = JSON.parse(fs.readFileSync(stateDistrictsPath, "utf8"));

// Mapping for tricky names
const stateNameMap = {
  "Puducherry (UT)": "Puducherry",
  "Delhi (NCT)": "Delhi",
  "Orissa": "Odisha",
  "Mahārāshtra": "Maharashtra",
};

// Normalize function
const normalizeName = (name) =>
  name.toLowerCase().replace(/\s*\(.*\)\s*/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

// Fill districts
stateDistrictsData.states.forEach((stateData) => {
  const mappedName = stateNameMap[stateData.state] || stateData.state;

  const stateEntry = states.find(
    (s) => normalizeName(s.stateName) === normalizeName(mappedName)
  );

  if (stateEntry) {
    stateEntry.districts = stateData.districts;

    // Write district file
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

    console.log(`✅ Created and filled: ${filePath}`);
  } else {
    console.warn(`⚠️ State not found for: ${stateData.state}`);
  }
});

console.log("🎉 All district files created and filled successfully!");
