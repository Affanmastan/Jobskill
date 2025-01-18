import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve skills from the location state
  const { skills } = location.state || { skills: [] };
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobProfiles = async () => {
    setLoading(true);
    setError("");
    setJobs([]);

    try {
      // Call to LinkedIn Jobs API or your backend API to get job profiles
      const response = await axios.post("http://localhost:5000/api/fetch-jobs", { skills });

      console.log(response.data); // Log the response to inspect its structure

      // Assuming response.data is an array of job objects
      setJobs(response.data); 
    } catch (err) {
      setError(err.message || "An error occurred while fetching job profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (skills.length > 0) {
      console.log("Skills received:", skills); // Debugging skills passed from the dashboard
      fetchJobProfiles();  // Fetch job profiles when skills are available
    } else {
      setError("No skills found. Please go back and try again.");
    }
  }, [skills]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Personalized Jobs For You</h1>

      {/* Display the passed skills */}
      <h2 style={styles.skillsTitle}>Your Skills: {skills.join(", ")}</h2>

      {/* Button to find job profiles */}
      <button onClick={fetchJobProfiles} style={styles.button}>
        Find Desired Job Profiles
      </button>

      {loading && <p style={styles.loadingText}>Loading job profiles...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.jobList}>
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div key={index} style={styles.jobCard}>
              <h3 style={styles.jobTitle}>{job.jobTitle}</h3>
              <p style={styles.companyName}>Company: {job.company || "Company Name Not Available"}</p>
              <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" style={styles.jobLink}>
                View Job
              </a>
            </div>
          ))
        ) : (
          <p style={styles.noJobsText}>No jobs found.</p>
        )}
      </div>

      <button onClick={() => navigate("/dashboard")} style={styles.backButton}>
        Back to Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  title: {
    fontSize: "36px",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  skillsTitle: {
    fontSize: "20px",
    color: "#555",
    marginBottom: "20px",
    textAlign: "center",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
    margin: "0 auto 20px",
    transition: "background-color 0.3s ease",
  },
  loadingText: {
    fontSize: "16px",
    color: "#333",
    textAlign: "center",
  },
  errorText: {
    fontSize: "16px",
    color: "#f44336",
    textAlign: "center",
    marginBottom: "20px",
  },
  jobList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "30px",
    marginTop: "20px",
  },
  jobCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    cursor: "pointer",
    height: "auto",
    textAlign: "center",
  },
  jobCardHovered: {
    transform: "scale(1.05)",
  },
  jobTitle: {
    fontSize: "22px",
    color: "#333",
    marginBottom: "10px",
  },
  companyName: {
    fontSize: "16px",
    color: "#777",
    marginBottom: "15px",
  },
  jobLink: {
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  noJobsText: {
    textAlign: "center",
    color: "#888",
    fontSize: "18px",
  },
  backButton: {
    padding: "12px 20px",
    backgroundColor: "#2196f3",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
    margin: "20px auto",
    transition: "background-color 0.3s ease",
  },
};

export default Recommendations;
