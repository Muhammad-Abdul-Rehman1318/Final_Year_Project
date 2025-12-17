const University = require('../models/UniversitySchema');

/**
 * Admin endpoint to create a new University document.
 * Expects JSON body with required fields: title, city, province, degree, discipline.
 * Optional fields will be inserted as-is.
 */
const createUniversity = async (req, res) => {
  try {
    const data = req.body || {};
    console.log("📥 Incoming university payload:", JSON.stringify(data, null, 2));

    // Basic validation – province & degree are optional in UI
    const required = ['title', 'city', 'discipline'];
    const missing = required.filter((f) => !data[f]);
    if (missing.length) {
      console.log("❌ Missing required fields:", missing);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    // Fill optional fields that are required by schema
    if (!data.province || data.province === "") {
      data.province = "Unknown";
    }
    if (!data.degree || data.degree === "") {
      data.degree = "N/A";
    }

    // Ensure unique incremental key
    if (typeof data.key === 'undefined') {
      const lastDoc = await University.findOne().sort({ key: -1 }).select('key').lean();
      data.key = lastDoc && typeof lastDoc.key === 'number' ? lastDoc.key + 1 : 0;
      console.log("ℹ️ Assigned key:", data.key);
    }

    // Ensure an id string (frontend may already send)
    if (!data.id) {
      data.id = `pk${Date.now()}`; // simple fallback id
      console.log("ℹ️ Generated id:", data.id);
    }

    const newUni = await University.create(data);
    console.log("✅ Saved university in MongoDB with _id:", newUni._id?.toString());
    return res.status(201).json({ success: true, university: newUni });
  } catch (error) {
    console.error('Error creating university:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating university',
      error: error.message,
    });
  }
};

module.exports = { createUniversity };
