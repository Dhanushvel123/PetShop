import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? 'http://localhost:3002/login' : 'http://localhost:3002/register';

    try {
      const res = await axios.post(url, {
        username: formData.username,
        password: formData.password,
      });

      if (isLogin) {
        // Save token on login only
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        navigate('/home'); // ✅ Navigate to home after login
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true); // ✅ Switch to login form
        setFormData({ username: '', password: '' }); // Reset form
      }
    } catch (err) {
      console.error(err.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed`);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.toggleButtons}>
        <button
          style={{ ...styles.toggleButton, backgroundColor: isLogin ? '#28a745' : '#ccc' }}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          style={{
            ...styles.toggleButton,
            backgroundColor: !isLogin ? '#28a745' : '#ccc',
          }}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
}

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
  toggleButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  toggleButton: {
    padding: '10px 20px',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '6px',
    margin: '0 0.5rem',
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
};

export default SignIn;