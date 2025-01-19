import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const JobGapAnalysis = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [userSkills, setUserSkills] = useState("");
  const [result, setResult] = useState(null);

  // Fetch job roles on component mount
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/job-roles");
        setJobRoles(response.data.roles); // Update according to your response structure
      } catch (error) {
        console.error("Error fetching job roles:", error);
      }
    };

    fetchJobRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/job-gap", {
        role: selectedRole,
        userSkills: userSkills.split(",").map((skill) => skill.trim()),
      });

      setResult(response.data); // Assuming your backend returns required skills and user skills
    } catch (error) {
      console.error("Error fetching job gap analysis:", error);
    }
  };

  // Prepare data for Pie Chart visualization
  const preparePieChartData = () => {
    if (!result) return [];
    const matchedSkills = result.requiredSkills.filter((skill) =>
      result.userSkills.includes(skill)
    );
    const missingSkills = result.requiredSkills.filter(
      (skill) => !result.userSkills.includes(skill)
    );

    return [
      { name: "Matched Skills", value: matchedSkills.length },
      { name: "Missing Skills", value: missingSkills.length },
    ];
  };

  const pieChartData = preparePieChartData();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Job Gap Analysis</h1>

      {/* Form for job gap analysis */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Job role selection */}
        <div style={styles.formGroup}>
          <label htmlFor="role" style={styles.label}>Select Job Role:</label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">--Select Role--</option>
            {jobRoles.map((job, index) => (
              <option key={index} value={job.role}>
                {job.role}
              </option>
            ))}
          </select>
        </div>

        {/* User skills input */}
        <div style={styles.formGroup}>
          <label htmlFor="skills" style={styles.label}>Enter Your Skills (comma-separated):</label>
          <input
            id="skills"
            type="text"
            value={userSkills}
            onChange={(e) => setUserSkills(e.target.value)}
            placeholder="e.g., HTML, CSS, JavaScript"
            required
            style={styles.input}
          />
        </div>

        {/* Submit button */}
        <button type="submit" style={styles.submitButton}>Analyze</button>
      </form>

      {/* Analysis Result */}
      {result && (
        <div style={styles.resultContainer}>
          <h2 style={styles.resultTitle}>Analysis Result</h2>
          <p><strong>Selected Role:</strong> {result.role}</p>
          <p><strong>Required Skills:</strong> {result.requiredSkills.join(", ")}</p>
          <p><strong>Your Skills:</strong> {result.userSkills.join(", ")}</p>
          <p>
            <strong>Missing Skills:</strong>{" "}
            {result.missingSkills.length > 0
              ? result.missingSkills.join(", ")
              : "None"}
          </p>
          <p>
            <strong>Compatibility:</strong>{" "}
            {result.isCompatible ? (
              <span style={{ color: "green" }}>You are fully qualified!</span>
            ) : (
              <span style={{ color: "red" }}>You need improvement.</span>
            )}
          </p>

          {/* Pie Chart Visualization */}
          <div style={styles.chartContainer}>
            <h3>Skill Compatibility Pie Chart</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#4caf50" : "#f44336"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
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
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "16px",
    color: "#555",
  },
  select: {
    width: "300px",
    padding: "10px",
    marginLeft: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  input: {
    width: "300px",
    padding: "10px",
    marginLeft: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
    margin: "20px auto",
    transition: "background-color 0.3s ease",
  },
  resultContainer: {
    marginTop: "20px",
    color: "black",
  },
  resultTitle: {
    fontSize: "24px",
    color: "black",
    marginBottom: "20px",
  },
  chartContainer: {
    marginTop: "20px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
};

export default JobGapAnalysis;
