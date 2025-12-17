const Admin = require("../models/AdminSchema");
const bcrypt = require("bcryptjs");

exports.loginAdmin = async (req, res) => {
  try {
    const { admin_email, password } = req.body;

    if (!admin_email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ admin_email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};