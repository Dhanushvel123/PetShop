import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Food from './pages/Product/Food';
import Contact from './pages/Contact';
import Testimonial from './pages/Testimonial';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Accessory from './pages/Product/Accessory';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/signin';
  };

  return (
    <Router>
      <Navbar bg="success" expand="lg" variant="dark" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to={token ? "/home" : "/signin"} className="fw-bold">PetShop 🐾</Navbar.Brand>
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
                <Button variant="outline-light" className="ms-lg-3 mt-2 mt-lg-0" onClick={handleLogout}>
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
          {/* Public Route */}
          <Route path="/signin" element={<SignIn setToken={setToken} />} />

          {/* Protected Routes */}
          <Route path="/home" element={token ? <Home /> : <Navigate to="/signin" />} />
          <Route path="/about" element={token ? <About /> : <Navigate to="/signin" />} />
          <Route path="/services" element={token ? <Services /> : <Navigate to="/signin" />} />
          <Route path="/products/food" element={token ? <Food /> : <Navigate to="/signin" />} />
          <Route path="/products/accessory" element={token ? <Accessory /> : <Navigate to="/signin" />} />
          <Route path="/contact" element={token ? <Contact /> : <Navigate to="/signin" />} />
          <Route path="/testimonial" element={token ? <Testimonial /> : <Navigate to="/signin" />} />

          {/* Default Route */}
          <Route path="*" element={<Navigate to={token ? "/home" : "/signin"} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
