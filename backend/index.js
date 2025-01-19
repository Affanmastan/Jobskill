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

// CV Schema
// Schema & Model
const cvSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: [String],
  experience: String,
  education: String,
});

const Cv = mongoose.model("Cv", cvSchema);


// Register Route
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

// Setup Multer for CV Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/plain") {
      cb(null, true);
    } else {
      cb(new Error("Only .txt files are allowed."));
    }
  },
});

// CV Upload and Parsing Route
app.post("/api/upload-cv", upload.single("cv"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded." });
  }

  try {
    const filePath = req.file.path;
    const text = fs.readFileSync(filePath, "utf8");

    // Parse CV text
    const cvData = parseTxtCv(text);
    cvData.rawText = text;

    // Store in MongoDB
    const newCv = new Cv(cvData);
    await newCv.save();

    // Delete the file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: "CV uploaded and parsed successfully!",
      cvData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error parsing the CV." });
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


// Update the endpoint to return only CVs of the logged-in user
app.get("/api/cv", async (req, res) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided, access denied." });
  }

  try {
    const decoded = jwt.verify(token, "9a3f7b9c0c4d8e5f2a1b6d8c3f7e9a3c");
    const email = decoded.email;

    const cvs = await Cv.find({ email: email });

    console.log("Fetched CVs:", cvs); // Add this log to check data from backend

    res.json(cvs);
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(500).send("Error fetching CV data.");
  }
});


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

let allCourses = [];

// Load the CSV data into memory on server startup
fs.createReadStream("data/coursera.csv") // Update the path to match your folder structure
  .pipe(csvParser())
  .on("data", (row) => {
    allCourses.push(row);
  })
  .on("end", () => {
    console.log("CSV data loaded into memory!");
   //console.log(allCourses);
    // console.log("Course skills:", allCourses.Skills);
  });

  


  
 

  //cou
  const fetchCoursesWithPuppeteer = async (skills) => {
    const query = encodeURIComponent(skills.join(" "));
    const searchUrl = `https://www.udemy.com/courses/search/?q=${query}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36');
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

        const courses = await page.evaluate(() => {
            const courseElements = document.querySelectorAll('.course-card--container--3w8Zm');
            return Array.from(courseElements).map(el => {
                const title = el.querySelector('div.udlite-focus-visible-target.udlite-heading-md')?.innerText.trim();
                const relativeUrl = el.querySelector('a.udlite-custom-focus-visible')?.getAttribute('href');
                const url = relativeUrl ? `https://www.udemy.com${relativeUrl}` : null;
                return { title, url };
            });
        });

        await browser.close();
        return courses;
    } catch (error) {
        console.error("Error scraping courses:", error.message || error);
        await browser.close();
        return [];
    }
};

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

// Serve Uploaded Files (Optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Start Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));






// Helper Function: Parse CV Text
function parseTxtCv(text) {
  const name = text.match(/Name[:\s]*(.*)/i)?.[1] || "Unknown";
  const email = text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || "Unknown";
  const phone = text.match(/(\+\d{1,3}[- ]?)?\d{10}/)?.[0] || "Unknown";

  const skillsSection = text.match(/Skills[:\s]*(.*)/i)?.[1] || "";
  const skills = skillsSection.split(",").map((skill) => skill.trim());

  console.log("Parsed skills:", skills); // Debug log to check parsed skills

  const experience = text.match(/Experience[:\s]*(.*)/i)?.[1] || "Unknown";
  const education = text.match(/Education[:\s]*(.*)/i)?.[1] || "Unknown";

  return {
    name,
    email,
    phone,
    skills,
    experience,
    education,
  };
}
