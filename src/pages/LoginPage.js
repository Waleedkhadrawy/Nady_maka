import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import '../styles/pages/LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="login-page">
      <section className="login-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/video-thumb.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <h1 className="login-title">تسجيل الدخول</h1>
              <p className="login-subtitle">مرحبا بك من جديد في نادي مكة يارد</p>
            </Col>
          </Row>
        </Container>
      </section>
      <Container>
        <Row className="justify-content-center align-items-center py-5">
          <Col md={6} lg={4}>
            <Card className="shadow">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img 
                    src="/images/logo.PNG" 
                    alt="Makkah Yard" 
                    className="logo mb-3"
                  />
                  <h3>تسجيل الدخول</h3>
                  <p className="text-muted">أدخل بياناتك للوصول إلى حسابك</p>
                </div>

                {showAlert && (
                  <Alert variant="info">
                    جاري تطوير نظام تسجيل الدخول
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>البريد الإلكتروني</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>كلمة المرور</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="أدخل كلمة المرور"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox" 
                      label="تذكرني" 
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3"
                  >
                    تسجيل الدخول
                  </Button>

                  <div className="text-center">
                    <Link to="/forgot-password" className="text-muted">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                </Form>

                <hr />

                <div className="d-flex justify-content-between">
                  <Link to="/register">إنشاء حساب جديد</Link>
                  <Link to="/reset-password">إعادة تعيين كلمة المرور</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
