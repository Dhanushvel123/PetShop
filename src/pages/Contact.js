import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaTag,
  FaCommentDots,
  FaMapMarkerAlt,
  FaPhone,
  FaPaperPlane,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSubmit = (e) => {
    e.preventDefault();

    // EmailJS config
    emailjs
      .send(
        "service_rhr4lpd",
        "template_rj7joqu",
        form,
        "JPpf_8ApyZCOK8Afn"
      )
      .then(
        (result) => {
          toast.success("Message sent successfully!");
          setForm({ name: "", email: "", subject: "", message: "" });
        },
        (error) => {
          toast.error("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <div className={`container py-5 ${darkMode ? "dark-mode" : ""}`}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="text-end mb-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={toggleDarkMode}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <motion.div
        className="row shadow rounded p-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left: Form */}
        <div className="col-md-6 mb-4 mb-md-0">
          <h6 className="text-success fw-bold">CONTACT US</h6>
          <h2 className="fw-bold mb-4">PLEASE FEEL FREE TO CONTACT US</h2>
          <form onSubmit={handleSubmit}>
            {[
              { icon: <FaUser />, name: "name", type: "text", label: "Your Name" },
              { icon: <FaEnvelope />, name: "email", type: "email", label: "Your Email" },
              { icon: <FaTag />, name: "subject", type: "text", label: "Subject" },
            ].map(({ icon, name, type, label }) => (
              <div key={name} className="form-group mb-3">
                <label className="form-label d-flex align-items-center">
                  <span className="me-2 text-success">{icon}</span> {label}
                </label>
                <input
                  type={type}
                  name={name}
                  className="form-control"
                  value={form[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div className="form-group mb-4">
              <label className="form-label d-flex align-items-center">
                <FaCommentDots className="me-2 text-success" /> Message
              </label>
              <textarea
                name="message"
                rows="5"
                className="form-control"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn w-100 fw-bold"
              style={{ backgroundColor: "#7AC142", color: "#fff" }}
            >
              <FaPaperPlane className="me-2" />
              SEND MESSAGE
            </motion.button>
          </form>
        </div>

        {/* Right: Info + Map */}
        <motion.div
          className="col-md-6 d-flex flex-column justify-content-between mt-4 mt-md-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <div className="d-flex mb-3">
              <FaMapMarkerAlt className="text-success me-3 fs-4" />
              <div>
                <strong>OUR OFFICE</strong>
                <p className="mb-0">123 Street, New York, USA</p>
              </div>
            </div>

            <div className="d-flex mb-3">
              <FaEnvelope className="text-success me-3 fs-4" />
              <div>
                <strong>EMAIL US</strong>
                <p className="mb-0">info@example.com</p>
              </div>
            </div>

            <div className="d-flex mb-3">
              <FaPhone className="text-success me-3 fs-4" />
              <div>
                <strong>CALL US</strong>
                <p className="mb-0">+012 345 6789</p>
              </div>
            </div>
          </div>

          <div className="map-responsive rounded overflow-hidden">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=New York&output=embed"
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Contact;
