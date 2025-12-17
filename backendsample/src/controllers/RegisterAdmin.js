const Admin = require("../models/AdminSchema");
const bcrypt = require("bcryptjs");

exports.registerAdmin = async (req, res) => {
  try {
    const { admin_name, admin_email, password } = req.body;

    if (!admin_name || !admin_email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await Admin.findOne({ admin_email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already taken" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      admin_name,
      admin_email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Admin registration successful!",
      data: admin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};