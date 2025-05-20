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

  const [touched, setTouched] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Re-validate on change
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, form[name]);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) error = "Name is required.";
      else if (!/^[A-Za-z\s]+$/.test(value)) error = "Only letters allowed.";
      else if (value.trim().length < 3) error = "Name must be at least 3 characters.";
    }

    if (name === "email") {
      if (!value.trim()) error = "Email is required.";
      else if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(value))
        error = "Only Gmail addresses allowed.";
    }

    if (name === "subject" && !value.trim()) {
      error = "Subject is required.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      validateField(key, form[key]);
      newErrors[key] = errors[key]; // Collect errors
    });

    setErrors(newErrors); // Use newErrors to update the state
    return Object.values(newErrors).every((e) => e === "");
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isFormValid = validateForm();
    if (!isFormValid) {
      toast.error("Please fix the form errors.");
      return;
    }

    emailjs
      .send("service_rhr4lpd", "template_18lijgl", form, "JPpf_8ApyZCOK8Afn")
      .then(
        () => {
          toast.success("Message sent successfully!");
          setForm({ name: "", email: "", subject: "", message: "" });
          setErrors({});
          setTouched({});
        },
        () => {
          toast.error("Failed to send message. Please try again.");
        }
      );
  };

  const fields = [
    {
      icon: <FaUser />,
      name: "name",
      type: "text",
      label: "Your Name",
    },
    {
      icon: <FaEnvelope />,
      name: "email",
      type: "email",
      label: "Your Email",
    },
    {
      icon: <FaTag />,
      name: "subject",
      type: "text",
      label: "Subject",
    },
  ];

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
        <div className="contact col-md-6 mb-4 mb-md-0">
          <h6 className="text-success fw-bold">CONTACT US</h6>
          <h2 className="fw-bold mb-4">PLEASE FEEL FREE TO CONTACT US</h2>
          <form onSubmit={handleSubmit} noValidate>
            {fields.map(({ icon, name, type, label }) => (
              <div key={name} className="form-group mb-3">
                <label className="form-label d-flex align-items-center">
                  <span className="me-2 text-success">{icon}</span> {label}
                </label>
                <input
                  type={type}
                  name={name}
                  className={`form-control ${
                    touched[name]
                      ? errors[name]
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  value={form[name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched[name] && errors[name] && (
                  <div className="invalid-feedback">{errors[name]}</div>
                )}
              </div>
            ))}

            <div className="form-group mb-4">
              <label className="form-label d-flex align-items-center">
                <FaCommentDots className="me-2 text-success" /> Message
              </label>
              <textarea
                name="message"
                rows="5"
                className={`form-control ${
                  touched.message
                    ? errors.message
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {touched.message && !form.message.trim() && (
                <div className="invalid-feedback">Message is required.</div>
              )}
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
