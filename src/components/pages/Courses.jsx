import React, { useState } from 'react';

const Courses = () => {
  // Static list of courses with descriptions, difficulty levels, durations, and platform URLs
  const courses = [
    // Existing courses...
    { name: 'Introduction to React', description: 'Learn the basics of React, including components, state, and props.', difficulty: 'Beginner', duration: '4 weeks', url: 'https://www.coursera.org/learn/react' },
    { name: 'Advanced JavaScript', description: 'Deep dive into advanced JavaScript concepts such as closures, prototypes, and async programming.', difficulty: 'Advanced', duration: '6 weeks', url: 'https://www.udemy.com/course/advanced-javascript' },
    { name: 'Web Development Basics', description: 'Get started with HTML, CSS, and JavaScript to build your first web pages.', difficulty: 'Beginner', duration: '3 weeks', url: 'https://www.coursera.org/specializations/web-development' },
    { name: 'Node.js for Beginners', description: 'Learn the fundamentals of Node.js and how to build server-side applications.', difficulty: 'Intermediate', duration: '5 weeks', url: 'https://www.udemy.com/course/nodejs-for-beginners' },
    { name: 'CSS Mastery', description: 'Master CSS for creating responsive and visually appealing web designs.', difficulty: 'Intermediate', duration: '4 weeks', url: 'https://www.coursera.org/learn/css' },
    { name: 'Full-Stack Development', description: 'Learn to build complete web applications with both front-end and back-end technologies.', difficulty: 'Advanced', duration: '8 weeks', url: 'https://www.udemy.com/course/full-stack-web-development' },
    { name: 'Python for Data Science', description: 'Explore Python libraries like NumPy, Pandas, and Matplotlib for data analysis.', difficulty: 'Intermediate', duration: '6 weeks', url: 'https://www.coursera.org/learn/python-data-science' },
    { name: 'Machine Learning 101', description: 'An introduction to machine learning concepts and algorithms.', difficulty: 'Advanced', duration: '7 weeks', url: 'https://www.udemy.com/course/machine-learning' },
    { name: 'UI/UX Design Principles', description: 'Learn the fundamentals of user interface and user experience design.', difficulty: 'Beginner', duration: '3 weeks', url: 'https://www.coursera.org/specializations/ui-ux-design' },
    { name: 'DevOps Essentials', description: 'Understand the basics of DevOps, including CI/CD and containerization.', difficulty: 'Intermediate', duration: '5 weeks', url: 'https://www.udemy.com/course/devops-essentials' },
    
    // New courses in different domains
    { name: 'Digital Marketing Strategies', description: 'Learn the key concepts of digital marketing including SEO, content marketing, and social media.', difficulty: 'Intermediate', duration: '5 weeks', url: 'https://www.coursera.org/learn/digital-marketing' },
    { name: 'Introduction to Cybersecurity', description: 'Get an overview of cybersecurity principles, threats, and protection strategies.', difficulty: 'Beginner', duration: '4 weeks', url: 'https://www.udemy.com/course/intro-to-cybersecurity' },
    { name: 'Financial Markets', description: 'Learn about the dynamics of financial markets and investment strategies.', difficulty: 'Intermediate', duration: '6 weeks', url: 'https://www.coursera.org/learn/financial-markets' },
    { name: 'Project Management Basics', description: 'Understand the basics of project management, including planning, execution, and monitoring.', difficulty: 'Beginner', duration: '4 weeks', url: 'https://www.udemy.com/course/project-management' },
    { name: 'Public Speaking and Presentation', description: 'Develop public speaking skills and learn how to deliver effective presentations.', difficulty: 'Beginner', duration: '3 weeks', url: 'https://www.coursera.org/learn/public-speaking' },
    { name: 'Creative Writing', description: 'Explore creative writing techniques and develop your storytelling skills.', difficulty: 'Beginner', duration: '4 weeks', url: 'https://www.udemy.com/course/creative-writing' },
    { name: 'Introduction to Psychology', description: 'Learn the fundamentals of psychology, including cognitive, social, and developmental psychology.', difficulty: 'Beginner', duration: '6 weeks', url: 'https://www.coursera.org/learn/psychology' },
    { name: 'Graphic Design Basics', description: 'Get started with graphic design and learn about color theory, typography, and layout.', difficulty: 'Beginner', duration: '4 weeks', url: 'https://www.udemy.com/course/graphic-design' },
    { name: 'Ethical Hacking', description: 'Understand the concepts of ethical hacking and cybersecurity testing.', difficulty: 'Advanced', duration: '7 weeks', url: 'https://www.coursera.org/learn/ethical-hacking' },
    { name: 'Artificial Intelligence Fundamentals', description: 'Explore the basics of AI and its applications in various fields.', difficulty: 'Intermediate', duration: '5 weeks', url: 'https://www.udemy.com/course/ai-fundamentals' },
    { name: 'Introduction to Robotics', description: 'Learn about robotics technology and how to build and program robots.', difficulty: 'Intermediate', duration: '6 weeks', url: 'https://www.coursera.org/learn/robotics' }
];


  // State for the search query
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Course Catalog</h1>

      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchInput}
      />

      {searchQuery && filteredCourses.length > 0 && (
        <p style={styles.resultCount}>Found {filteredCourses.length} course(s)</p>
      )}

      {searchQuery && filteredCourses.length === 0 && (
        <p style={styles.noResults}>No courses found</p>
      )}

      <div style={styles.courseList}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <div key={index} style={styles.courseCard}>
              <h3 style={styles.courseTitle}>{course.name}</h3>
              <p style={styles.courseDescription}>{course.description}</p>
              <p><strong>Difficulty:</strong> {course.difficulty}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <a href={course.url} target="_blank" rel="noopener noreferrer" style={styles.courseLink}>View Course</a>
            </div>
          ))
        ) : (
          !searchQuery && (
            <div style={styles.courseList}>
              {courses.map((course, index) => (
                <div key={index} style={styles.courseCard}>
                  <h3>{course.name}</h3>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '36px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchInput: {
    padding: '12px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto 20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  resultCount: {
    fontSize: '16px',
    color: '#4caf50',
    marginBottom: '20px',
    textAlign: 'center',
  },
  noResults: {
    fontSize: '16px',
    color: '#f44336',
    marginBottom: '20px',
    textAlign: 'center',
  },
  courseList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '30px',
    marginTop: '20px',
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out',
  },
  courseCardHovered: {
    transform: 'scale(1.05)',
  },
  courseTitle: {
    fontSize: '22px',
    color: '#333',
    marginBottom: '10px',
  },
  courseDescription: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '15px',
  },
  courseLink: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
};

export default Courses;