import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
    const [trendingCourses, setTrendingCourses] = useState([
        "React for Beginners",
        "Mastering Python Programming",
        "Data Analysis with Pandas",
        "Introduction to AI and Machine Learning",
        "Full-Stack Web Development",
    ]);

    useEffect(() => {
        setTimeout(() => {
            setTrendingCourses((prev) => [
                ...prev,
                "Cybersecurity Basics",
                "UI/UX Design Fundamentals",
            ]);
        }, 5000);
    }, []);

    return (
        <div style={styles.container}>
            {/* Navigation Bar */}
            <div style={styles.navbar}>
                <h1 style={styles.navbarText}>Job Skill Gap Analyzer</h1>
                <nav style={styles.navLinks}>
                    <Link to="/features" style={styles.navLink}>Features</Link>
                    <Link to="/contact" style={styles.navLink}>Contact</Link>
                </nav>
            </div>

            {/* News Ticker */}
            <div style={styles.newsTicker}>
                <div style={styles.tickerContent}>
                    {trendingCourses.map((course, index) => (
                        <span key={index} style={styles.tickerItem}>
                            🚀 {course}
                        </span>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                <h1 style={styles.heading}>Welcome to the Job Skill Gap Analyzer</h1>
                <p style={styles.paragraph}>
                    Discover the skills you need to excel in your desired industry. Our platform compares
                    your current skills with job requirements and recommends personalized learning paths.
                </p>
                <div style={styles.buttonContainer}>
                    <Link to="/login">
                        <button style={styles.loginButton}>Login</button>
                    </Link>
                    <Link to="/register">
                        <button style={styles.registerButton}>Register</button>
                    </Link>
                </div>
            </div>

            {/* CSS for ticker animation */}
            <style>
                {`
                    @keyframes scroll {
                        0% { transform: translateX(100%); }
                        100% { transform: translateX(-100%); }
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#f4f6f9",
        height: "100vh",
        overflow: "hidden",
    },
    navbar: {
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: "#004a8d",
        padding: "15px 0",
        zIndex: 1000,
        textAlign: "center",
    },
    navbarText: {
        color: "white",
        margin: "0",
        fontSize: "24px",
        fontWeight: "bold",
    },
    navLinks: {
        marginTop: "10px",
    },
    navLink: {
        color: "white",
        marginRight: "15px",
        textDecoration: "none",
        fontSize: "18px",
    },
    newsTicker: {
        backgroundColor: "#f1f1f1",
        marginTop: "80px", // Adjusted to fit below the navbar
        padding: "20px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        borderBottom: "2px solid #ccc",
    },
    tickerContent: {
        display: "inline-block",
        animation: "scroll 30s linear infinite",
        padding: "0 10px",
    },
    tickerItem: {
        marginRight: "30px",
        fontSize: "16px",
        color: "#333",
    },
    mainContent: {
        textAlign: "center",
        marginTop: "50px",
    },
    heading: {
        fontSize: "36px",
        color: "#333",
        marginBottom: "20px",
    },
    paragraph: {
        fontSize: "18px",
        color: "#555",
        maxWidth: "800px",
        margin: "0 auto 20px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
    },
    loginButton: {
        padding: "12px 25px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    registerButton: {
        padding: "12px 25px",
        fontSize: "16px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Home;
