import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100 py-5">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img 
                    src="/images/logo.PNG" 
                    alt="Makkah Yard" 
                    className="logo mb-3"
                  />
                  <h3>إنشاء حساب جديد</h3>
                  <p className="text-muted">انضم إلى عائلة Makkah Yard</p>
                </div>

                {showAlert && (
                  <Alert variant="info">
                    جاري تطوير نظام التسجيل
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>الاسم الأول</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="أدخل اسمك الأول"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>الاسم الأخير</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="أدخل اسمك الأخير"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

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
                    <Form.Label>رقم الهاتف</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="أدخل رقم هاتفك"
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>تأكيد كلمة المرور</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="أعد إدخال كلمة المرور"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      label="أوافق على الشروط والأحكام وسياسة الخصوصية"
                      required
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3"
                    disabled={!formData.agreeTerms}
                  >
                    إنشاء الحساب
                  </Button>
                </Form>

                <hr />

                <div className="text-center">
                  <p className="mb-0">
                    لديك حساب بالفعل؟{' '}
                    <Link to="/login">تسجيل الدخول</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;