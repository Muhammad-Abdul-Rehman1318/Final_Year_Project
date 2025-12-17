require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { OpenAI } = require('openai');

// Import university controllers
const {
  getAllUniversities,
  getUniversityById,
  getUniversityStats,
  getUniversitiesByCity,
  getUniversitiesByProvince,
  getUniversitiesByDiscipline
} = require("./controllers/universityController");

// Import university search controllers
const {
  searchUniversitiesByName,
  getUniversitiesByRanking,
  getTopUniversities
} = require("./controllers/universitySearchController");

// Import optimized top universities controller
const { getTopUniversities: getTopUniversitiesOptimized } = require("./controllers/getTopUniversities");

// Import optimized disciplines controller
const { getDisciplines } = require("./controllers/getDisciplines");

// Import company authentication controllers
const { googleRegisterCompany } = require("./controllers/googleRegisterCompany");
const { googleLoginCompany } = require("./controllers/googleLoginCompany");
const { registerCompany } = require("./controllers/RegisterStudent");
const { loginStudent } = require("./controllers/LoginStudent");

// Import middleware
const { requireFields } = require("./middleware/RegisterStudentFields");
const authMiddleware = require("./middleware/authMiddleware");
const adminAuthMiddleware = require("./middleware/adminAuthMiddleware");

// Import password reset functions
const {
  forgotPassword,
  resetPassword,
  verifyResetToken
} = require("./controllers/forgotPasswordController");

// Import contact page controllers
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} = require("./controllers/contactController");

// Import admin controllers
const { loginAdmin } = require("./controllers/LoginAdmin");
const { registerAdmin } = require("./controllers/RegisterAdmin");
const { getAdminDashboardData } = require("./controllers/getAdminDashboardData");
const { updateCompanyStatus } = require("./controllers/updateCompanyStatus");
const { getStudentAdmin } = require("./controllers/getStudentAdmin");
const { createUniversity } = require("./controllers/createUniversity");
const { updateUniversity } = require("./controllers/updateUniversity");
const { deleteUniversity } = require("./controllers/deleteUniversity");

// Import team member controllers
const {
  getTeamMembers,
  getTeamMemberById,
} = require("./controllers/getTeamMembers");
const { createTeamMember } = require("./controllers/createTeamMember");
const { resendInvitation } = require("./controllers/resendInvitation");
const { cancelInvitation } = require("./controllers/cancelInvitation");

// Import company profile controllers
const {
  updateCompanyName,
  updateCompanyEmail,
  changeCompanyPassword,
  getCompanyProfile
} = require("./controllers/companyProfileController");

// Import candidate verification controller
const { verifyCandidateLogin } = require("./controllers/verifyCandidateLogin");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Contact page routes
app.post("/contact", createContact);

// Company (Student) authentication routes

app.post("/login", loginStudent);

app.post(
  "/register",
  requireFields(["student_name", "student_email", "password"]),
  registerCompany
);

app.post("/google-register", googleRegisterCompany);
app.post("/google-login", googleLoginCompany);

// Password reset routes
app.post("/forgot-password", forgotPassword);
app.post("/reset-password", resetPassword);
app.get("/verify-reset-token/:token", verifyResetToken);

// Admin authentication routes
app.post("/admin/login", loginAdmin);
app.post(
  "/admin/register",
  requireFields(["admin_name", "admin_email", "password"]),
  registerAdmin
);

// Candidate verification route
app.post("/candidate/verify", verifyCandidateLogin);

// University routes - specific routes first
app.get("/api/universities/search", searchUniversitiesByName);
app.get("/api/universities/ranking", getUniversitiesByRanking);
app.get("/api/universities/top", getTopUniversitiesOptimized);
app.get("/api/universities/city/:city", getUniversitiesByCity);
app.get("/api/universities/province/:province", getUniversitiesByProvince);
app.get("/api/universities/discipline/:discipline", getUniversitiesByDiscipline);
app.get("/api/universities", getAllUniversities);
app.get("/api/universities/stats", getUniversityStats);
app.get("/api/universities/:id", getUniversityById);

// Disciplines endpoint
app.get("/api/disciplines", getDisciplines);

// Admin routes - authentication removed
app.use("/admin", (req, res, next) => {
  console.log(` Admin route accessed: ${req.path}`);
  next();
});

// Admin contact routes
app.get("/admin/contacts", getAllContacts);
app.get("/admin/contacts/:id", getContactById);
app.put("/admin/contacts/:id/status", updateContactStatus);
app.delete("/admin/contacts/:id", deleteContact);

// Admin dashboard route
app.get("/admin/dashboard", (req, res, next) => {
  console.log("Dashboard route accessed");
  getAdminDashboardData(req, res);
});

// Admin company management routes
app.get("/admin/companies", (req, res, next) => {
  console.log("Universities data route accessed");
  console.log("Request headers:", req.headers);
  console.log("Auth header:", req.headers.authorization);
  getStudentAdmin(req, res);
});

app.post("/admin/companies", (req, res, next) => {
  console.log("Create university route accessed");
  createUniversity(req, res);
});

app.put("/admin/companies/:id", (req, res, next) => {
  console.log("Update university route accessed for ID:", req.params.id);
  updateUniversity(req, res);
});

app.delete("/admin/companies/:id", (req, res, next) => {
  console.log(" Delete university route accessed for ID:", req.params.id);
  deleteUniversity(req, res);
});

app.put("/admin/companies/:companyId/status", (req, res, next) => {
  console.log(
    `🔄 Company status update route accessed for ID: ${req.params.companyId}`
  );
  updateCompanyStatus(req, res);
});

// Company profile management routes (no JWT auth)
app.get("/company/profile", getCompanyProfile);
app.put("/company/profile/update-name", updateCompanyName);
app.put("/company/profile/update-email", updateCompanyEmail);
app.put("/company/password/change", changeCompanyPassword);

// Team member routes
app.get("/company/team", getTeamMembers);
app.get("/company/team/member/:id", getTeamMemberById);
app.post("/company/team/invite", createTeamMember);
app.put("/company/team/resend/:id", resendInvitation);
app.delete("/company/team/cancel/:id", cancelInvitation);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

mongoose
  .connect('mongodb+srv://muhammadowais87:12344321@cluster0.weif8lt.mongodb.net/test?appName=Cluster0')
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
    process.exit(1);
  });