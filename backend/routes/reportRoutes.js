// routes/reports.js
import express from "express";
import multer from "multer";
import pool from "../db.js";

const router = express.Router();

// -----------------------------
// Multer config
// -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// -----------------------------
// Helper: Generate tracking ID from report row
// -----------------------------
const generateTrackingId = (report) => {
  const dateStr = new Date(report.createdAt)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ""); // YYYYMMDD
  return `CIV${dateStr}-${String(report.id).padStart(5, "0")}`;
};

// -----------------------------
// POST /api/reports → Submit report
// -----------------------------
router.post("/", upload.array("mediaFiles"), async (req, res) => {
  try {
    const { category, description, location, addressData, priority } = req.body;

    if (!category || !location || !addressData) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Safely parse JSON strings
    let parsedLocation, parsedAddress;
    try {
      parsedLocation = JSON.parse(location);
      parsedAddress = JSON.parse(addressData);
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError.message);
      return res
        .status(400)
        .json({ success: false, error: "Invalid JSON in location or addressData" });
    }

    // Handle uploaded files
    const files = req.files ? req.files.map((f) => f.filename) : [];

    // Validate priority
    const validPriorities = ["Low", "Normal", "High", "Critical"];
    const safePriority = validPriorities.includes(priority) ? priority : "Normal";

    // Insert report into database
    const [result] = await pool.query(
      `INSERT INTO reports 
       (category, description, lat, lng, address, city, district, state, stateCode, country, pincode, mediaFiles, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category,
        description,
        parsedLocation.lat,
        parsedLocation.lng,
        parsedAddress.address,
        parsedAddress.city,
        parsedAddress.district,
        parsedAddress.state,
        parsedAddress.stateCode,
        parsedAddress.country,
        parsedAddress.pincode,
        JSON.stringify(files),
        safePriority,
      ]
    );

    // Generate tracking ID dynamically (do NOT store in DB)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const trackingId = `CIV${dateStr}-${String(result.insertId).padStart(5, "0")}`;

    // Send response with tracking ID
    res.json({
      success: true,
      message: "Report submitted successfully",
      reportId: result.insertId,
      trackingId,
    });
  } catch (error) {
    console.error("❌ Error submitting report:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// -----------------------------
// -----------------------------
// GET /api/reports → Fetch all reports
// Optional query: ?trackingId=CIV20251011-00001
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const { trackingId } = req.query;

    const [rows] = await pool.query(
      "SELECT * FROM reports ORDER BY createdAt DESC"
    );

    // Transform rows
    let reports = rows.map((r) => ({
      ...r,
      mediaFiles: r.mediaFiles ? JSON.parse(r.mediaFiles) : [],
      addressData: {
        address: r.address,
        city: r.city,
        district: r.district,
        state: r.state,
        stateCode: r.stateCode,
        country: r.country,
        pincode: r.pincode,
      },
      trackingId: generateTrackingId(r),
    }));

    // Filter if trackingId query param is provided
    if (trackingId) {
      reports = reports.filter((r) => r.trackingId === trackingId);
    }

    res.json({ success: true, reports });
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// -----------------------------
// GET /api/reports/stats → Summary counts
// -----------------------------
router.get("/stats", async (req, res) => {
  try {
    // Use MySQL aggregate queries
    const [totalResult] = await pool.query(`SELECT COUNT(*) AS totalReports FROM reports`);
    const [resolvedResult] = await pool.query(`SELECT COUNT(*) AS resolvedReports FROM reports WHERE status='resolved'`);
    const [pendingResult] = await pool.query(`SELECT COUNT(*) AS pendingReports FROM reports WHERE status='pending'`);
    const [citiesResult] = await pool.query(`SELECT COUNT(DISTINCT city) AS citiesCovered FROM reports WHERE city IS NOT NULL AND city!=''`);

    const stats = {
      totalReports: totalResult[0].totalReports || 0,
      resolvedReports: resolvedResult[0].resolvedReports || 0,
      pendingReports: pendingResult[0].pendingReports || 0,
      citiesCovered: citiesResult[0].citiesCovered || 0,
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error("❌ Error fetching report stats:", error);
    res.status(500).json({ success: false, error: "Server error while fetching stats" });
  }
});


// -----------------------------
// GET /api/reports/:trackingId → Fetch single report
// -----------------------------
router.get("/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;

    // Validate tracking ID format: CIVYYYYMMDD-xxxxx
    const match = trackingId.match(/^CIV(\d{8})-(\d{5})$/);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid tracking ID format" });
    }

    const reportId = parseInt(match[2], 10); // last 5 digits → reportId

    const [rows] = await pool.query("SELECT * FROM reports WHERE id = ?", [
      reportId,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Report not found" });
    }

    const report = rows[0];

    const transformedReport = {
      ...report,
      mediaFiles: report.mediaFiles ? JSON.parse(report.mediaFiles) : [],
      addressData: {
        address: report.address,
        city: report.city,
        district: report.district,
        state: report.state,
        stateCode: report.stateCode,
        country: report.country,
        pincode: report.pincode,
      },
      trackingId: generateTrackingId(report),
    };

    res.json({ success: true, report: transformedReport });
  } catch (error) {
    console.error("❌ Error fetching report by tracking ID:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});



export default router;
