import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getMemberToken, getToken } from '../services/api';
import '../styles/components/Header.css';

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const memberToken = getMemberToken();
  const adminToken = getToken();

  // Highlight active link
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('member_token');
    localStorage.removeItem('member_profile');
    setExpanded(false);
    navigate('/');
  };

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
        {/* Logo right/mobile */}
        <Navbar.Brand as={Link} to="/" className="brand-right d-none d-lg-block">
          <img src="/images/logo.PNG" alt="Makkah Yard Logo" />
        </Navbar.Brand>
        <Navbar.Brand as={Link} to="/" className="brand-mobile d-lg-none">
          <img src="/images/logo.PNG" alt="Makkah Yard Logo" style={{ height: 45 }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <i className="bi bi-list fs-3" style={{ color: 'var(--primary-dark)' }}></i>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Centered menu links */}
          <Nav className="nav-center mx-auto align-items-center">
            <Nav.Link as={Link} to="/" className={isActive('/') ? 'active' : ''} onClick={() => setExpanded(false)}>الرئيسية</Nav.Link>
            <Nav.Link as={Link} to="/academy" className={isActive('/academy') ? 'active' : ''} onClick={() => setExpanded(false)}>الأكاديمية</Nav.Link>
            <Nav.Link as={Link} to="/booking" className={isActive('/booking') ? 'active' : ''} onClick={() => setExpanded(false)}>حجز موعد</Nav.Link>
            <Nav.Link as={Link} to="/membership" className={isActive('/membership') ? 'active' : ''} onClick={() => setExpanded(false)}>الانضمام إلى العضوية</Nav.Link>
            <Nav.Link as={Link} to="/pricing" className={isActive('/pricing') ? 'active' : ''} onClick={() => setExpanded(false)}>الأسعار</Nav.Link>
            <Nav.Link as={Link} to="/trainer-evaluation" className={isActive('/trainer-evaluation') ? 'active' : ''} onClick={() => setExpanded(false)}>تقييم المدرب</Nav.Link>
          </Nav>

          {/* Left Buttons Group */}
          <Nav className="nav-left align-items-center">
            <div className="auth-buttons align-items-center d-flex flex-wrap justify-content-center">
              {memberToken ? (
                <NavDropdown title={<><i className="bi bi-person-circle ms-1"></i> حسابي</>} id="user-dropdown" align="start">
                  <NavDropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                    <i className="bi bi-person-vcard ms-2"></i> الملف الشخصي
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right ms-2"></i> تسجيل الخروج
                  </NavDropdown.Item>
                </NavDropdown>
              ) : adminToken ? (
                <Button as={Link} to="/admin" variant="outline-success" size="sm" className="btn-outline-premium mx-1" onClick={() => setExpanded(false)}>
                  <i className="bi bi-speedometer2 ms-1"></i> لوحة التحكم
                </Button>
              ) : (
                <Button as={Link} to="/login" variant="outline-success" size="sm" className="btn-outline-premium mx-1" onClick={() => setExpanded(false)}>
                  <i className="bi bi-box-arrow-in-right ms-1"></i> دخول اليوزر
                </Button>
              )}
            </div>
            <Nav.Link href="#" className="english-pill d-none d-lg-block" onClick={() => setExpanded(false)}>
              English
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
