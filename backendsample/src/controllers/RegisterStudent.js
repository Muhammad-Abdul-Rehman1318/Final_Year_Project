const Student = require("../models/RegisterStudentSchema");
const bcrypt = require("bcryptjs");

exports.registerCompany = async (req, res) => {
  try {
    const { student_name, student_email, password } = req.body;

  
    if (!student_name || !student_email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await Student.findOne({ student_name: student_name });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    const existingEmail = await Student.findOne({ student_email: student_email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already Taken" });
    }
    
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const student = await Student.create({
      student_name,
      student_email,
      password: hashedPassword,
      plan: 'free_trial', 
    });

    return res.status(201).json({
      message: "Registration successful!",
      data: student,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
