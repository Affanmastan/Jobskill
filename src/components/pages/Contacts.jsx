import React from "react";

const Contact = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Contact Us</h1>
            <p>
                We'd love to hear from you! Whether you have a question, feedback, or need support, feel free to reach out to us.
            </p>
            <div style={{ margin: "20px" }}>
                <p style={{ fontSize: "18px" }}>
                    📧 **Email**: <a href="mailto:support@jobskillgap.com">support@jobskillgap.com</a>
                </p>
                <p style={{ fontSize: "18px" }}>
                    📞 **Phone**: +1-234-567-8900
                </p>
                <p style={{ fontSize: "18px" }}>
                    🏢 **Address**: 123, JobSkill Gap Lane, Tech City, Maharashtra
                </p>
            </div>
        </div>
    );
};

export default Contact;
