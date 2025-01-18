import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const CvAnalysis = () => {
  const [csvData, setCsvData] = useState([]); // State to store CSV data
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [searchResults, setSearchResults] = useState([]); // State for search results

  // Load and parse CSV file on component mount
  useEffect(() => {
    const fetchCsv = async () => {
      try {
        // Replace '/path/to/csv/file.csv' with the actual path to your CSV file
        const response = await fetch('projectmca/JobSkill/public/Coursera.csv');
        
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        // Get the raw CSV content as text
        const text = await response.text();
        
        // Log the raw content of the CSV
        console.log('Raw CSV content:', text);
        
        // Process the CSV (for example, parse it)
        // Assuming you want to parse it into an array or some structure:
        const rows = text.split('\n').map(row => row.split(','));
        
        console.log('Parsed CSV data:', rows);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
    
  }, []);

  // Handle search functionality
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("Please enter a skill to search!");
      return;
    }

    // Filter courses based on the search term in the "Skills" column
    const results = csvData.filter((row) =>
      row.Skills?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (results.length === 0) {
      alert("No courses found for the entered skill!");
    }

    setSearchResults(results);
  };

  return (
    <div style={{ margin: "20px" }}>
      {/** Search Box */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter skill to search courses"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search Courses
        </button>
      </div>

      {/** Display Search Results */}
      {searchResults.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          <h3>Courses for "{searchTerm}":</h3>
          <ul>
            {searchResults.map((course, index) => (
              <li key={index} style={{ marginBottom: "20px" }}>
                <p>
                  <strong>Course Name:</strong> {course.CourseName || "N/A"}
                </p>
                <p>
                  <strong>University:</strong> {course.University || "N/A"}
                </p>
                <p>
                  <strong>Difficulty:</strong> {course.Difficulty || "N/A"}
                </p>
                <p>
                  <strong>Rating:</strong> {course["Course Rating"] || "N/A"}
                </p>
                {course["Course URL"] ? (
                  <p>
                    <strong>Course URL:</strong>{" "}
                    <a
                      href={course["Course URL"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007bff" }}
                    >
                      {course["Course URL"]}
                    </a>
                  </p>
                ) : (
                  <p>
                    <strong>Course URL:</strong> Not available
                  </p>
                )}
                <p>
                  <strong>Description:</strong>{" "}
                  {course["Course Description"] || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        searchTerm && <p>No courses found for "{searchTerm}".</p>
      )}
    </div>
  );
};

export default CvAnalysis;
