import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import '../styles/pages/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { api, setMemberToken } from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    if (!formData.password) {
      errs.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      errs.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.memberLogin({ email: formData.email.trim(), password: formData.password });
      if (res?.token) {
        setMemberToken(res.token);
        toast.success('مرحباً بك! تم تسجيل الدخول بنجاح 👋');
        setTimeout(() => navigate('/profile'), 700);
      }
    } catch (err) {
      toast.error(err.message || 'تعذر تسجيل الدخول، تحقق من البريد وكلمة المرور');
      setErrors({ password: ' ' }); // highlight fields
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f5e9 100%)', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '3rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-lg border-0" style={{ borderRadius: 20, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #2e7d32, #8BC34A)', padding: '2rem', textAlign: 'center' }}>
                <img src="/images/logo.PNG" alt="Makkah Yard" style={{ height: 64, marginBottom: '0.75rem', filter: 'brightness(0) invert(1)' }} />
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.35rem', fontWeight: 700 }}>تسجيل الدخول</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>مرحباً بك في نادي مكة يارد</p>
              </div>

              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">البريد الإلكتروني</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted" />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        isInvalid={!!errors.email}
                        style={{ borderRight: 'none', borderLeft: '1px solid #ced4da' }}
                        className="border-start-0"
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <Form.Label className="fw-semibold mb-0">كلمة المرور</Form.Label>
                      <Link to="/reset-password" style={{ fontSize: '0.8rem', color: '#8BC34A' }}>نسيت كلمة المرور؟</Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted" />
                      </span>
                      <Form.Control
                        type={showPass ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="أدخل كلمة المرور"
                        isInvalid={!!errors.password}
                        style={{ borderRight: 'none', borderLeft: 'none' }}
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0"
                        onClick={() => setShowPass(!showPass)}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'} text-muted`} />
                      </button>
                      <Form.Control.Feedback type="invalid">{errors.password === ' ' ? 'بيانات الدخول غير صحيحة' : errors.password}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                    style={{ padding: '0.75rem', fontWeight: 700, fontSize: '1rem', borderRadius: 12 }}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />جاري الدخول...</>
                    ) : (
                      <><i className="bi bi-box-arrow-in-right me-2" />تسجيل الدخول</>
                    )}
                  </Button>

                  <hr className="my-3" />

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>ليس لديك حساب؟</span>
                    <Link to="/membership" className="btn btn-outline-success btn-sm" style={{ borderRadius: 8, fontWeight: 600 }}>
                      <i className="bi bi-person-plus me-1" />إنشاء حساب
                    </Link>
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

export default LoginPage;
