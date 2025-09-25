import express from "express";
import multer from "multer";
import pool from "../db.js";

const router = express.Router();

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /api/reports → Submit report
router.post("/", upload.array("mediaFiles"), async (req, res) => {
  try {
    const { category, description, location, addressData } = req.body;

    const parsedLocation = JSON.parse(location);
    const parsedAddress = JSON.parse(addressData);
    const files = req.files.map((f) => f.filename);

    const [result] = await pool.query(
      `INSERT INTO reports 
       (category, description, lat, lng, address, city, district, state, stateCode, country, pincode, mediaFiles) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        JSON.stringify(files), // save as JSON string
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

// GET /api/reports → Fetch all reports
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reports ORDER BY createdAt DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
