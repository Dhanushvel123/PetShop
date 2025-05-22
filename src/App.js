import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // <-- Named import

import SignIn from './pages/SignIn';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Food from './pages/Product/Food';
import Contact from './pages/Contact';
import Testimonial from './pages/Testimonial';
import Accessory from './pages/Product/Accessory';
import UserProfile from './pages/UserProfile';
import OrderHistory from './pages/OrderHistory';
import Admin from './pages/Admin';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    setToken(currentToken);

    if (currentToken) {
      try {
        const decoded = jwtDecode(currentToken);
        setUsername(decoded.username || decoded.name || decoded.email || 'User');
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token');
      setToken(updatedToken);

      if (updatedToken) {
        try {
          const decoded = jwtDecode(updatedToken);
          setUsername(decoded.username || decoded.name || decoded.email || 'User');
        } catch (err) {
          console.error('Token decode failed:', err);
        }
      } else {
        setUsername('');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsername('');
     navigate('/signin');
  };

  return (
    <Router>
      <Navbar bg="success" expand="lg" variant="dark" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to={token ? "/home" : "/signin"} className="fw-bold">
            PetShop 🐾
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {token ? (
              <Nav className="ms-auto align-items-center">
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                <Nav.Link as={Link} to="/about">About</Nav.Link>
                <Nav.Link as={Link} to="/services">Services</Nav.Link>
                <NavDropdown title="Products" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/products/food">Food</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/products/accessory">Accessories</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                <Nav.Link as={Link} to="/testimonial">Testimonials</Nav.Link>
                <Nav.Link as={Link} to="/orders">Order History</Nav.Link>

                {/* Admin Dashboard link visible to all logged-in users */}
                <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>

                <Link to="/profile" className="d-flex align-items-center text-white fw-bold text-decoration-none ms-3">
                  <FaUserCircle size={22} className="me-2" />
                  {username}
                </Link>

                <Button
                  variant="outline-light"
                  className="ms-3 mt-2 mt-lg-0"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="container py-4">
        <Routes>
          <Route path="/signin" element={<SignIn setToken={setToken} />} />
          <Route path="/home" element={token ? <Home /> : <Navigate to="/signin" />} />
          <Route path="/about" element={token ? <About /> : <Navigate to="/signin" />} />
          <Route path="/services" element={token ? <Services /> : <Navigate to="/signin" />} />
          <Route path="/products/food" element={token ? <Food /> : <Navigate to="/signin" />} />
          <Route path="/products/accessory" element={token ? <Accessory /> : <Navigate to="/signin" />} />
          <Route path="/contact" element={token ? <Contact /> : <Navigate to="/signin" />} />
          <Route path="/testimonial" element={token ? <Testimonial /> : <Navigate to="/signin" />} />
          <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/signin" />} />
          <Route path="/orders" element={token ? <OrderHistory /> : <Navigate to="/signin" />} />

          {/* Admin page accessible to all logged-in users */}
          <Route path="/admin" element={token ? <Admin /> : <Navigate to="/signin" />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={token ? "/home" : "/signin"} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
