const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const linkedin = require('linkedin-jobs-api');


const fs = require("fs");

const csvParser = require("csv-parser");


const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://affanmastan07:rNE6ppl5m4W3uHmj@cluster0.52z1s.mongodb.net/"
  )
  .then(() => console.log("MongoDB Atlas connected!"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);





// Register Route
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }

    // Generate a JWT token
    const token = jwt.sign({ email }, "9a3f7b9c0c4d8e5f2a1b6d8c3f7e9a3c", {
      expiresIn: "1h",
    });
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});







// Middleware for JWT Authentication
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Extract token

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, "9a3f7b9c0c4d8e5f2a1b6d8c3f7e9a3c");
    req.user = verified; // Attach user to request
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(400).json({ message: "Invalid Token" });
  }
};




// User Details Schema
const userDetailsSchema = new mongoose.Schema({
  email: String,
  name: String,
  phone: String,
  skills: [String],
  qualification: String,
  jobProfile: String,
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

// Save User Details Route
app.post("/api/save-user-data", authenticate, async (req, res) => {
  const { name, phone, skills, qualification, jobProfile } = req.body;
  const email = req.user.email; // Extract email from the token

  try {
    const newUserDetails = new UserDetails({
      email,
      name,
      phone,
      skills: skills.split(",").map((skill) => skill.trim()), // Convert skills string to array
      qualification,
      jobProfile,
    });

    await newUserDetails.save();
    res.status(201).json({
      success: true,
      message: "User details saved successfully!",
      userDetails: newUserDetails,
    });
  } catch (err) {
    console.error("Error saving user details:", err);
    res.status(500).json({
      success: false,
      message: "Error saving user details.",
    });
  }
});




  
 


app.post('/api/fetch-jobs', (req, res) => {
  const { skills } = req.body; // Skills passed from frontend
  const queryOptions = {
    keyword: skills.join(' '), // Join skills into one string for the keyword
    location: 'India', // You can customize this based on your needs
    dateSincePosted: 'past Week',
    jobType: 'full time',
    remoteFilter: 'remote',
    salary: '100000',
    experienceLevel: 'entry level',
    limit: 10,
    page: '0',
  };

  linkedin.query(queryOptions)
    .then(response => {
      res.json(response); // Return job data to the frontend
    })
    .catch(error => {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'An error occurred while fetching job profiles' });
    });
});

//analysis
// Define the Schema and Model for Job Roles based on your existing collection structure
const jobRoleSchema = new mongoose.Schema({
  role: String,
  requiredSkills: [String], // Array of strings for required skills
}, { timestamps: true }); // Optional: add timestamps for creation and update times

const JobRole = mongoose.model("JobRole", jobRoleSchema);

// Job Roles API to get all job roles
app.get("/api/job-roles", async (req, res) => {
  try {
    // Fetch all job roles from the collection
    const roles = await JobRole.find();

    res.status(200).json({
      success: true,
      message: "Job roles fetched successfully!",
      roles,
    });
  } catch (error) {
    console.error("Error fetching job roles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job roles.",
    });
  }
});

//gap
app.post("/api/job-gap", async (req, res) => {
  const { role, userSkills } = req.body;

  try {
    // Fetch the job role from the database
    const job = await JobRole.findOne({ role: role });

    if (!job) {
      return res.status(404).json({ error: "Job role not found" });
    }

    // Required skills for the selected job role
    const requiredSkills = job.requiredSkills;

    // Determine missing skills
    const missingSkills = requiredSkills.filter((skill) => !userSkills.includes(skill));
    const isCompatible = missingSkills.length === 0;

    return res.json({
      role: job.role,
      requiredSkills,
      userSkills,
      missingSkills,
      isCompatible,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing job gap analysis" });
  }
});

  // Scrape courses based on the skills received in the POST request
  app.post('/api/recommend-courses', async (req, res) => {
    const { skills } = req.body;
    const courses = await fetchCoursesWithPuppeteer(skills);
    
    if (courses.length > 0) {
      res.json({ success: true, courses });
    } else {
      res.json({ success: false, message: "No courses found based on your skills." });
    }
  });



// Start Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));







