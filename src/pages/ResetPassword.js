import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Token for password reset
  const [formData, setFormData] = useState({ username: '', email: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handle input changes for the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for resetting the password
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3002/reset-password/${token}`, {
        username: formData.username,
        email: formData.email,
        newPassword: formData.newPassword,
      });

      setSuccess(res.data.message); // Show success message
      setTimeout(() => {
        navigate('/signin'); // Redirect to SignIn page after success
      }, 3000); // Redirect after 3 seconds to allow the user to see the success message
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during password reset');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Username Field */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        {/* Email Field */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* New Password Field */}
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        {/* Submit Button */}
        <button type="submit" style={styles.submitButton}>Reset Password</button>
      </form>

      {/* Error and Success Messages */}
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
    </div>
  );
};

// Styles for the ResetPassword page
const styles = {
  container: {
    maxWidth: '400px',
    margin: '4rem auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '0.75rem',
    backgroundColor: '#f25c2a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
  success: {
    color: 'green',
    marginTop: '1rem',
  },
};

export default ResetPassword;
