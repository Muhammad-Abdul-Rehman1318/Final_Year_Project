const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    student_name: { type: String, required: true },
    student_email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.auth_provider !== 'google';
      }
    },
    // Google OAuth fields
    google_id: { type: String, unique: true, sparse: true },
    profile_picture: { type: String },
    auth_provider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email'
    },
    is_verified: { type: Boolean, default: false },
    // Company status
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

studentSchema.index({ google_id: 1 });
studentSchema.index({ student_email: 1 });

module.exports = mongoose.model("Student", studentSchema, "students")