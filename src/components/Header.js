import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/components/Header.css';

const Header = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      fixed="top" 
      expanded={expanded}
      onToggle={setExpanded}
      className="navbar-custom"
    >
      <Container>
        {/* Logo on the right (matches screenshot layout) */}
        <Navbar.Brand className="brand-right d-none d-lg-block">
          <img
            src="/images/logo.PNG"
            alt="Makkah Yard Logo"
            className="top-right-logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Centered menu links */}
          <Nav className="nav-center mx-auto align-items-center">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>الرئيسية</Nav.Link>
            <Nav.Link as={Link} to="/academy" onClick={() => setExpanded(false)}>الأكاديمية</Nav.Link>
            <Nav.Link as={Link} to="/booking" onClick={() => setExpanded(false)}>حجز موعد</Nav.Link>
            <Nav.Link as={Link} to="/membership" onClick={() => setExpanded(false)}>الانضمام إلى العضوية</Nav.Link>
            <Nav.Link as={Link} to="/survey" onClick={() => setExpanded(false)}>استعلامات</Nav.Link>
            <Nav.Link as={Link} to="/pricing" onClick={() => setExpanded(false)}>الأسعار</Nav.Link>
            <NavDropdown title="تسجيل الدخول" id="login-dropdown" align="end">
              <NavDropdown.Item as={Link} to="/login" onClick={() => setExpanded(false)}>Log In</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reset-password" onClick={() => setExpanded(false)}>Reset password</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/trainer-evaluation" onClick={() => setExpanded(false)}>تقييم المدرب</Nav.Link>
          </Nav>

          {/* English pill on the left */}
          <Nav className="nav-left align-items-center">
            <Nav.Link href="#" className="english-pill" onClick={() => setExpanded(false)}>
              English
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
