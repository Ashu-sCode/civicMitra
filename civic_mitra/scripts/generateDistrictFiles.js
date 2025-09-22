import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const statesPath = path.resolve(__dirname, "../src/data/india/states.json");
const states = JSON.parse(fs.readFileSync(statesPath, "utf8"));

const outputDir = path.resolve(__dirname, "../src/data/india/districts");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

Object.entries(states).forEach(([code, name]) => {
  const filePath = path.join(outputDir, `districts-${code}.json`);

  if (fs.existsSync(filePath)) {
    console.log(`✅ ${filePath} already exists, skipping...`);
    return;
  }

  const data = {
    stateCode: code,
    stateName: name,
    districts: []
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`📂 Created ${filePath}`);
});
