import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Store the JWT token and email in localStorage
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userEmail", response.data.email);
        console.log("Login successful");
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
          {error && <p style={styles.errorText}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center", // horizontally centers content
    alignItems: "center", // vertically centers content
    height: "100vh", // Full viewport height for centering
    margin: "0", // Removes any default margin
    position: "absolute", // Ensure it takes up the full screen
    top: "0", // Top position of the viewport
    left: "0", // Left position of the viewport
    width: "100%", // Full width of the viewport
    backgroundColor: "transparent", // No background color for the full page
  },
  formContainer: {
    backgroundColor: "#fff", // Form background color
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px", // Constrain the width of the form
    textAlign: "center",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "12px",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
};

export default Login;
