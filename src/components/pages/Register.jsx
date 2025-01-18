import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    try {
      const response = await axios.post("http://localhost:5000/api/register", { email, password });
      if (response.data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed!");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Register</h2>
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
          <button type="submit" style={styles.button}>Register</button>
        </form>
        {error && <p style={styles.errorText}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    backgroundColor: "transparent",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
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
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
};

export default Register;
