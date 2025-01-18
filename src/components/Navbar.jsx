import React from "react";
import "./Navbar.css";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <h3>Job Skill Gap Analyzer</h3>
            </div>
            <div className="links">
                <a href="/">Home</a>
                <a href="/features">Features</a>
                <a href="/contact">Contact</a>
            </div>
        </div>
    );
};

export default Navbar;