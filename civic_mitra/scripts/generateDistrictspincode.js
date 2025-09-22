// scripts/generateDistrictPincodes.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const districtsDir = path.resolve(__dirname, "../src/data/india/districts");
const pincodesFile = path.resolve(__dirname, "../src/data/india/pincodes.json");

// Load all pincodes
const pincodesData = JSON.parse(fs.readFileSync(pincodesFile, "utf-8"));

// List all district files
const files = fs.readdirSync(districtsDir).filter(f => f.endsWith(".json"));

files.forEach((file) => {
  const filePath = path.join(districtsDir, file);
  const districtData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (!districtData.districts || typeof districtData.districts !== "object") {
    console.warn(`⚠️ Skipping ${file} - no "districts" object found`);
    return; // skip this file
  }

  const newData = {};

  // Iterate over districts in this file
  Object.entries(districtData.districts).forEach(([districtName, cities]) => {
    // Ensure cities is an array
    if (!Array.isArray(cities)) cities = [];

    const cityPincodes = {};

    // Iterate over all pincodes and map to district/city
    pincodesData.forEach(p => {
      // Match by district or city
      if (
        (p.district && p.district.toLowerCase() === districtName.toLowerCase()) ||
        (p.city && cities.some(c => c.toLowerCase() === p.city.toLowerCase()))
      ) {
        cityPincodes[p.city] = cityPincodes[p.city] || [];
        cityPincodes[p.city].push(p.pincode);
      }
    });

    newData[districtName] = cityPincodes;
  });

  const outputPath = path.join(districtsDir, `district-pincode-${file.split("-")[1]}`);
  fs.writeFileSync(outputPath, JSON.stringify(newData, null, 2), "utf-8");
  console.log(`✅ Generated ${outputPath}`);
});

console.log("🎉 All district pincodes generated!");
