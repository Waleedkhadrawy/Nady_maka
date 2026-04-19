import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/components/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-premium">
      <Container>
        <Row className="gy-5 footer-top">
          {/* Club Info */}
          <Col lg={4} md={12} className="club-info pe-md-4">
            <div className="mb-4">
              <img src="/images/logo.PNG" alt="Makkah Yard" style={{ height: 65, filter: 'brightness(1.5)' }} />
            </div>
            <p>
              نادي مكة يارد الرياضي، وجهتك الأولى للياقة البدنية المتكاملة في مكة المكرمة. نحن نوفر أفضل المرافق وأحدث الأجهزة لتجربة رياضية استثنائية.
            </p>
            <ul className="contact-list">
              <li>
                <i className="bi bi-telephone-fill"></i>
                <span>+966 55 018 5999</span>
              </li>
              <li>
                <i className="bi bi-envelope-fill"></i>
                <span>info@makkahyard.com</span>
              </li>
              <li>
                <i className="bi bi-geo-alt-fill"></i>
                <span>مكة المكرمة، المملكة العربية السعودية</span>
              </li>
            </ul>
            <div className="social-icons">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon-box" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-box" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-box" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={4} md={6}>
            <h3 className="footer-title">روابط سريعة</h3>
            <ul className="footer-list">
              <li><Link to="/about" className="footer-link">من نحن</Link></li>
              <li><Link to="/academy" className="footer-link">الأكاديمية الرياضية</Link></li>
              <li><Link to="/events" className="footer-link">الفعاليات القادمة</Link></li>
              <li><Link to="/booking" className="footer-link">حجز موعد</Link></li>
              <li><Link to="/membership" className="footer-link">الانضمام إلى العضوية</Link></li>
              <li><Link to="/pricing" className="footer-link">الأسعار والباقات</Link></li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={4} md={6}>
            <h3 className="footer-title">النشرة الإخبارية</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
              اشترك في نشرتنا البريدية لتصلك أحدث العروض والفعاليات الحصرية لنادي مكة يارد.
            </p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); }}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="البريد الإلكتروني..."
                required
              />
              <button type="submit" className="newsletter-btn">
                <i className="bi bi-send-fill ms-1"></i> اشترك
              </button>
            </form>
          </Col>
        </Row>

        {/* Payment Methods Band */}
        <div className="payment-band">
          <div className="payment-items">
            <img src="/images/payments/mada.svg" alt="mada" className="payment-logo" />
            <img src="/images/payments/visa.svg" alt="Visa" className="payment-logo" />
            <img src="/images/payments/mastercard.svg" alt="MasterCard" className="payment-logo" />
            <img src="/images/payments/apple-pay.svg" alt="Apple Pay" className="payment-logo" />
            <img src="/images/payments/amex.svg" alt="American Express" className="payment-logo" />
            <img src="/images/payments/tabby.svg" alt="tabby" className="payment-logo" />
            <img src="/images/payments/tamara.svg" alt="tamara" className="payment-logo" />
          </div>
        </div>

        <div className="footer-bottom">
          <p className="mb-0">&copy; {currentYear} Makkah Yard. جميع الحقوق محفوظة.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
