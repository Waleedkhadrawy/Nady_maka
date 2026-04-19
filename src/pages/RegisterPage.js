import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { api, setMemberToken } from '../services/api';
import toast from 'react-hot-toast';

function getPasswordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–4
}

const strengthLabel = ['', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية جداً'];
const strengthVariant = ['', 'danger', 'warning', 'info', 'success'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName.trim()) errs.lastName = 'الاسم الأخير مطلوب';
    if (!formData.email.trim()) {
      errs.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    if (!formData.phone) {
      errs.phone = 'رقم الجوال مطلوب';
    } else if (!/^05\d{8}$/.test(formData.phone.trim())) {
      errs.phone = 'يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';
    }
    if (!formData.password) {
      errs.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      errs.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }
    if (!formData.agreeTerms) errs.agreeTerms = 'يجب الموافقة على الشروط والأحكام';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('يرجى إصلاح الأخطاء أدناه');
      return;
    }
    setLoading(true);
    try {
      const res = await api.memberRegister({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });
      if (res?.token) {
        setMemberToken(res.token);
        toast.success('تم إنشاء حسابك بنجاح! مرحباً بك 🎉');
        setTimeout(() => navigate('/profile'), 800);
      }
    } catch (err) {
      toast.error(err.message || 'تعذر إنشاء الحساب، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="register-page" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f5e9 100%)', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '3rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #8BC34A, #558B2F)', padding: '2rem', textAlign: 'center' }}>
                <img src="/images/logo.PNG" alt="Makkah Yard" style={{ height: 64, marginBottom: '1rem', filter: 'brightness(0) invert(1)' }} />
                <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>إنشاء حساب جديد</h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>انضم إلى عائلة نادي مكة يارد</p>
              </div>

              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit} noValidate>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>الاسم الأول <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="محمد"
                          isInvalid={!!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>الاسم الأخير <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="العمري"
                          isInvalid={!!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>البريد الإلكتروني <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>رقم الجوال <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05XXXXXXXX"
                      isInvalid={!!errors.phone}
                      maxLength={10}
                    />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-1">
                        <Form.Label>كلمة المرور <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="8 أحرف على الأقل"
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                      {formData.password && (
                        <div className="mb-3 mt-1">
                          <ProgressBar
                            now={(strength / 4) * 100}
                            variant={strengthVariant[strength]}
                            style={{ height: 5, borderRadius: 4 }}
                          />
                          <small className={`text-${strengthVariant[strength]}`}>{strengthLabel[strength]}</small>
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>تأكيد كلمة المرور <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="أعد إدخال كلمة المرور"
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      name="agreeTerms"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      isInvalid={!!errors.agreeTerms}
                      label={
                        <span>
                          أوافق على{' '}
                          <a href="/about" target="_blank" rel="noreferrer">الشروط والأحكام</a>
                          {' '}وسياسة الخصوصية
                        </span>
                      }
                      feedback={errors.agreeTerms}
                      feedbackType="invalid"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                    style={{ padding: '0.75rem', fontWeight: 700, fontSize: '1.05rem', borderRadius: 12 }}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" /> جاري الإنشاء...</>
                    ) : 'إنشاء الحساب'}
                  </Button>

                  <div className="text-center">
                    <span className="text-muted">لديك حساب بالفعل؟ </span>
                    <Link to="/login" className="fw-bold">تسجيل الدخول</Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;