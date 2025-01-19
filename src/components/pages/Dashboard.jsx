import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    skills: "",
    qualification: "",
    jobProfile: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // For disabling the button during submission
  const [formVisible, setFormVisible] = useState(false); // To toggle form visibility
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login");
    } else {
      setEmail(userEmail || "Unknown User");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    setIsSubmitting(true);

    try {
      const saveResponse = await axios.post(
        "http://localhost:5000/api/save-user-data",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (saveResponse.data.success) {
        setStatusMessage("User Data Submitted Successfully!");

        setTimeout(() => {
          navigate("/recommendations", { state: { skills: formData.skills.split(",") } });
        }, 5000);
      } else {
        setStatusMessage("Failed to save user data. Please try again.");
      }
    } catch (error) {
      setStatusMessage("Submission Failed. Please try again.");
      console.error("Error:", error.response || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowForm = () => {
    setFormVisible(true);
  };

  const handleSearchCourses = () => {
    navigate("/search-courses");
  };

  const handleJobGap = () => {
    navigate("/jobgap"); // Navigate to the "Job Gap" page
  };

  return (
    <div style={styles.container}>
      <div style={styles.welcomeBox}>
        <h1 style={styles.welcomeText}>Welcome to Your Dashboard</h1>
      </div>

      <div style={styles.emailBox}>
        <p style={styles.emailText}>Logged In as: {email}</p>
      </div>

      <div style={styles.dashboardBox}>
        <div style={styles.buttonContainer}>
          <div style={styles.cardButton} onClick={handleShowForm}>
            <p style={styles.cardText}>Search Job</p>
          </div>
          <div style={styles.cardButton} onClick={handleSearchCourses}>
            <p style={styles.cardText}>Search Courses</p>
          </div>
          <div style={styles.cardButton} onClick={handleJobGap}>
            <p style={styles.cardText}>Job Gap</p>
          </div>
        </div>

        {formVisible && (
          <div style={styles.formContainer}>
            <hr style={styles.divider} />
            <h2 style={styles.subHeading}>Enter Your Details</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                style={styles.input}
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                style={styles.input}
              />
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Skills (comma-separated)"
                required
                style={styles.input}
              />
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Qualification"
                required
                style={styles.input}
              />
              <input
                type="text"
                name="jobProfile"
                value={formData.jobProfile}
                onChange={handleChange}
                placeholder="Desired Job Profile"
                required
                style={styles.input}
              />
              <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        )}

        {statusMessage && (
          <p
            style={
              statusMessage.startsWith("Submission")
                ? styles.errorText
                : styles.successText
            }
          >
            {statusMessage}
          </p>
        )}
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    backgroundColor: "#f9f9f9",
    margin: "0",
    fontFamily: "'Arial', sans-serif",
    overflow: "hidden",
  },
  welcomeBox: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    padding: "15px",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
  },
  emailBox: {
    marginBottom: "20px",
    textAlign: "center",
  },
  emailText: {
    fontSize: "18px",
    color: "#555",
  },
  dashboardBox: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "650px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoutButton: {
    padding: "12px 20px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    transition: "background-color 0.3s ease",
  },
  buttonContainer: {
    marginBottom: "30px",
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },
  cardButton: {
    width: "200px",
    height: "120px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardButtonHover: {
    transform: "scale(1.05)",
    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
  },
  cardText: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  divider: {
    width: "100%",
    margin: "20px 0",
  },
  subHeading: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "20px",
  },
  formContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    marginBottom: "15px",
  },
  submitButton: {
    padding: "14px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  successText: {
    color: "green",
    fontSize: "16px",
    marginTop: "10px",
  },
  errorText: {
    color: "red",
    fontSize: "16px",
    marginTop: "10px",
  },
};

export default Dashboard;
