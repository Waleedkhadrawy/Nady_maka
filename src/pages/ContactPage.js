import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import '../styles/pages/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setAlertType('success');
    setAlertMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    setShowAlert(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    // Hide alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000);
  };

  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'العنوان',
      content: 'مكة المكرمة، المملكة العربية السعودية',
      details: 'حي العزيزية، شارع الملك عبدالعزيز'
    },
    {
      icon: 'fas fa-phone',
      title: 'الهاتف',
      content: '+966 12 345 6789',
      details: 'متاح من 8 صباحاً حتى 10 مساءً'
    },
    {
      icon: 'fas fa-envelope',
      title: 'البريد الإلكتروني',
      content: 'info@makkahyard.com',
      details: 'نرد على جميع الرسائل خلال 24 ساعة'
    },
    {
      icon: 'fas fa-clock',
      title: 'ساعات العمل',
      content: 'السبت - الخميس',
      details: '6:00 صباحاً - 11:00 مساءً'
    }
  ];

  const socialLinks = [
    { icon: 'fab fa-facebook', url: '#', name: 'Facebook' },
    { icon: 'fab fa-twitter', url: '#', name: 'Twitter' },
    { icon: 'fab fa-instagram', url: '#', name: 'Instagram' },
    { icon: 'fab fa-youtube', url: '#', name: 'YouTube' },
    { icon: 'fab fa-whatsapp', url: '#', name: 'WhatsApp' }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="hero-title">تواصل معنا</h1>
              <p className="hero-subtitle">
                نحن هنا لمساعدتك! تواصل معنا لأي استفسار أو للحصول على معلومات إضافية
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <Container>
          <Row>
            {/* Contact Form */}
            <Col lg={8} className="mb-5">
              <Card className="contact-form-card">
                <Card.Body>
                  <h3 className="form-title">أرسل لنا رسالة</h3>
                  <p className="form-subtitle">املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن</p>
                  
                  {showAlert && (
                    <Alert variant={alertType} className="mb-4">
                      {alertMessage}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>الاسم الكامل *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="أدخل اسمك الكامل"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>البريد الإلكتروني *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="أدخل بريدك الإلكتروني"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>رقم الهاتف</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="أدخل رقم هاتفك"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>الموضوع *</Form.Label>
                          <Form.Select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          >
                            <option value="">اختر الموضوع</option>
                            <option value="membership">الاشتراك والعضوية</option>
                            <option value="activities">الأنشطة والبرامج</option>
                            <option value="schedule">المواعيد والجدولة</option>
                            <option value="facilities">المرافق والخدمات</option>
                            <option value="complaint">شكوى أو اقتراح</option>
                            <option value="other">أخرى</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>الرسالة *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="اكتب رسالتك هنا..."
                        required
                      />
                    </Form.Group>
                    
                    <Button type="submit" variant="primary" size="lg" className="submit-btn">
                      <i className="fas fa-paper-plane me-2"></i>
                      إرسال الرسالة
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Info */}
            <Col lg={4}>
              <div className="contact-info">
                <h3 className="info-title">معلومات التواصل</h3>
                
                {contactInfo.map((info, index) => (
                  <Card className="info-card mb-3" key={index}>
                    <Card.Body>
                      <div className="info-item">
                        <div className="info-icon">
                          <i className={info.icon}></i>
                        </div>
                        <div className="info-content">
                          <h5>{info.title}</h5>
                          <p className="info-main">{info.content}</p>
                          <p className="info-details">{info.details}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}

                {/* Social Media */}
                <Card className="social-card">
                  <Card.Body>
                    <h5 className="social-title">تابعنا على</h5>
                    <div className="social-links">
                      {socialLinks.map((social, index) => (
                        <a 
                          key={index}
                          href={social.url}
                          className="social-link"
                          title={social.name}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className={social.icon}></i>
                        </a>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="contact-map">
        <Container fluid className="p-0">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.2547!2d39.8262!3d21.4225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDI1JzIxLjAiTiAzOcKwNDknMzQuMyJF!5e0!3m2!1sen!2ssa!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع مكة يارد"
            ></iframe>
            <div className="map-overlay">
              <div className="map-info">
                <h4>مكة يارد</h4>
                <p>مكة المكرمة، المملكة العربية السعودية</p>
                <Button variant="outline-light" size="sm">
                  <i className="fas fa-directions me-2"></i>
                  احصل على الاتجاهات
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;