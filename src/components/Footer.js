import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/components/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-green">
      <Container>
        <Row className="align-items-start gy-4 footer-top">
          {/* Newsletter */}
          <Col md={4} className="newsletter-col">
            <h3 className="footer-title">النشرة الإخبارية</h3>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="ادخل بريدك الإلكتروني"
                aria-label="ادخل بريدك الإلكتروني"
              />
              <button type="submit" className="newsletter-btn">إرسال</button>
            </form>
          </Col>

          {/* Quick Links */}
          <Col md={4}>
            <h3 className="footer-title">روابط سريعة</h3>
            <ul className="footer-list">
              <li><Link to="/events" className="footer-link">الفعاليات</Link></li>
              <li><Link to="/booking" className="footer-link">حجز موعد</Link></li>
              <li><Link to="/membership" className="footer-link">الانضمام إلى العضوية</Link></li>
              <li><Link to="/pricing" className="footer-link">الأسعار</Link></li>
            </ul>
          </Col>

          {/* Club Info */}
          <Col md={4} className="club-info">
            <div className="club-header">
              <img src="/images/logo.PNG" alt="Makkah Yard" className="club-logo" />
            </div>
            <ul className="contact-list">
              <li>
                <i className="bi bi-telephone-fill"></i>
                <span>+966 55 018 5999</span>
              </li>
              <li>
                <i className="bi bi-envelope-fill"></i>
                <span>info@makkahyard.com</span>
              </li>
            </ul>
            <div className="social-icons">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            </div>
          </Col>
        </Row>

        {/* Payment Methods Band */}
        <div className="payment-band mt-4">
          <div className="payment-items">
            <img src="/images/payments/mada.svg" alt="mada" className="payment-logo" />
            <img src="/images/payments/visa.svg" alt="Visa" className="payment-logo" />
            <img src="/images/payments/mastercard.svg" alt="MasterCard" className="payment-logo" />
            <img src="/images/payments/apple-pay.svg" alt="Apple Pay" className="payment-logo" />
            <img src="/images/payments/amex.svg" alt="American Express" className="payment-logo" />
            <img src="/images/payments/tabby.svg" alt="tabby" className="payment-logo" />
            <img src="/images/payments/tamara.svg" alt="tamara" className="payment-logo" />
            <img src="/images/payments/qitaf.svg" alt="qitaf" className="payment-logo" />
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Makkah Yard. جميع الحقوق محفوظة.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
