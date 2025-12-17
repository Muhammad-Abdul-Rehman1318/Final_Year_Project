const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    admin_name: { type: String, required: true },
    admin_email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_super_admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema, "admins");