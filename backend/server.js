import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Folder to store reports
const reportsDir = path.join(process.cwd(), "reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

// API: Save Report
app.post("/api/report", (req, res) => {
  try {
    const report = { id: Date.now(), ...req.body };

    const filePath = path.join(reportsDir, `report-${report.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

    res.status(201).json({ success: true, message: "Report saved", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save report" });
  }
});

// API: Fetch all Reports
app.get("/api/reports", (req, res) => {
  try {
    const files = fs.readdirSync(reportsDir);
    const reports = files.map((file) => {
      const content = fs.readFileSync(path.join(reportsDir, file), "utf-8");
      return JSON.parse(content);
    });

    res.json({ success: true, reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch reports" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
