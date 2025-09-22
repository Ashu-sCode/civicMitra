// scripts/extractPincodes.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// CommonJS-style imports for stream-json modules
import StreamJsonPkg from "stream-json";
const { parser } = StreamJsonPkg;

import StreamArrayPkg from "stream-json/streamers/StreamArray.js";
const { streamArray } = StreamArrayPkg;

import PickPkg from "stream-json/filters/Pick.js";
const { pick } = PickPkg;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const geojsonPath = path.resolve(__dirname, "../src/data/india/All_India_pincode_Boundary-19312.geojson");
const outputPath = path.resolve(__dirname, "../src/data/india/pincodes.json");

// Create write stream for output
const outputStream = fs.createWriteStream(outputPath);
outputStream.write("[\n"); // start of array

let first = true;

// Stream JSON
const jsonStream = fs.createReadStream(geojsonPath)
  .pipe(parser())
  .pipe(pick({ filter: "features" }))  // Pick only the top-level features array
  .pipe(streamArray());

jsonStream.on("data", ({ value }) => {
  const props = value.properties;

  // Build simplified object
  const obj = {
    pincode: props.Pincode,
    office_name: props.Office_Name.trim(),
    state: (props.Circle || "").trim(),
    district: (props.Division || "").trim(),
    city: (props.Office_Name || "").trim()
  };

  // Write to output as JSON lines
  const line = JSON.stringify(obj);
  if (!first) outputStream.write(",\n");
  outputStream.write(line);
  first = false;
});

jsonStream.on("end", () => {
  outputStream.write("\n]");
  outputStream.close();
  console.log(`🎉 Pincodes extracted to: ${outputPath}`);
});

jsonStream.on("error", (err) => {
  console.error("❌ Error parsing GeoJSON:", err);
});
