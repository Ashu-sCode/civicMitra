// scripts/cleanDistrictFolder.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to districts folder
const districtsDir = path.resolve(__dirname, "../src/data/india/districts");

// Read all files in folder
const files = fs.readdirSync(districtsDir);

files.forEach((file) => {
  if (!file.startsWith("district-")) {
    const filePath = path.join(districtsDir, file);
    fs.unlinkSync(filePath);
    console.log(`🗑 Deleted: ${file}`);
  }
});

console.log("✅ Cleanup complete!");
