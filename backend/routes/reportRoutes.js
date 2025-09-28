// routes/reports.js
import express from "express";
import multer from "multer";
import pool from "../db.js";

const router = express.Router();

// -----------------------------
// Multer config for file uploads
// -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

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

    // Parse safely
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

    const files = req.files ? req.files.map((f) => f.filename) : [];

    // Validate priority
    const validPriorities = ["Low", "Normal", "High", "Critical"];
    const safePriority = validPriorities.includes(priority)
      ? priority
      : "Medium";

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

    res.json({
      success: true,
      message: "Report submitted",
      reportId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error submitting report:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// -----------------------------
// GET /api/reports → Fetch all reports
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM reports ORDER BY createdAt DESC"
    );

    // Transform mediaFiles and addressData from JSON string to object
    const reports = rows.map((r) => ({
      ...r,
      mediaFiles: r.mediaFiles ? JSON.parse(r.mediaFiles) : [],
      addressData: r.address
        ? JSON.parse(
            JSON.stringify({
              address: r.address,
              city: r.city,
              district: r.district,
              state: r.state,
              stateCode: r.stateCode,
              country: r.country,
              pincode: r.pincode,
            })
          )
        : {}, // optional fallback
    }));

    res.json(reports);
  } catch (error) {
    console.error("❌ Error fetching reports:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
