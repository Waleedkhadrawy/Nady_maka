import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import '../styles/pages/MembershipPage.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const MembershipPage = () => {
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    phone: '',
    nationalId: '',
    jobTitle: '',
    address: '',
    package: '',
    paymentMethod: 'cash',
    partnerName: '',
    partnerEmail: '',
    partnerDob: '',
    partnerPhone: '',
  });

  const [packages, setPackages] = useState([]);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const rows = await api.listMembershipPackages();
        const mapped = rows.map(p => ({ value: p.code, label: p.label, price: p.price != null ? `${p.price} ${p.currency || ''}`.trim() : '', period_days: p.period_days, segment: p.segment, allow_partner: !!p.allow_partner, min_age: p.min_age ?? null, max_age: p.max_age ?? null }));
        setPackages(mapped);
      } catch (e) {
        setPackages([
          { value: 'basic_year', label: 'الباقة الأساسية - سنة', price: '4620 ريال', period_days: 365, segment: 'adult' },
          { value: 'basic_6m', label: 'الباقة الأساسية - 6 أشهر', price: '2730 ريال', period_days: 182, segment: 'adult' },
          { value: 'basic_3m', label: 'الباقة الأساسية - 3 أشهر', price: '1312.5 ريال', period_days: 91, segment: 'adult' },
          { value: 'individual_year', label: 'الباقة الفردية - سنة', price: '3000 ريال', period_days: 365, segment: 'adult' },
          { value: 'individual_6m', label: 'الباقة الفردية - 6 أشهر', price: '1750 ريال', period_days: 182, segment: 'adult' },
          { value: 'individual_3m', label: 'الباقة الفردية - 3 أشهر', price: '1250 ريال', period_days: 91, segment: 'adult' },
          { value: 'junior_year', label: 'باقة الأحداث - سنة', price: '2500 ريال', period_days: 365, segment: 'junior' },
          { value: 'junior_6m', label: 'باقة الأحداث - 6 أشهر', price: '1500 ريال', period_days: 182, segment: 'junior' },
          { value: 'junior_3m', label: 'باقة الأحداث - 3 أشهر', price: '900 ريال', period_days: 91, segment: 'junior' },
        ]);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === 'phone' || name === 'partnerPhone') nextValue = value.replace(/[^\d]/g, '').slice(0, 10);
    if (name === 'nationalId') nextValue = value.replace(/[^\d]/g, '').slice(0, 10);
    setForm(prev => ({ ...prev, [name]: nextValue }));
  };

  const navigate = useNavigate();

  const calcAge = (dob) => {
    if (!dob) return null;
    const d = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  const getFieldError = (fieldName) => {
    if (fieldName === 'firstName' && !form.firstName.trim()) return 'الاسم الأول مطلوب';
    if (fieldName === 'lastName' && !form.lastName.trim()) return 'الاسم الأخير مطلوب';
    if (fieldName === 'email') {
      if (!form.email.trim()) return 'البريد الإلكتروني مطلوب';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'صيغة البريد الإلكتروني غير صحيحة';
    }
    if (fieldName === 'password') {
      if (!form.password) return 'كلمة المرور مطلوبة';
      if (form.password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    if (fieldName === 'gender' && !form.gender) return 'يرجى اختيار الجنس';
    if (fieldName === 'dob' && !form.dob) return 'تاريخ الميلاد مطلوب';
    if (fieldName === 'phone') {
      if (!form.phone) return 'رقم الجوال مطلوب';
      if (!/^05\d{8}$/.test(form.phone)) return 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';
    }
    if (fieldName === 'nationalId') {
      if (!form.nationalId) return 'رقم الهوية/الإقامة مطلوب';
      if (!/^\d{10}$/.test(form.nationalId)) return 'رقم الهوية/الإقامة يجب أن يتكون من 10 أرقام';
    }
    if (fieldName === 'package' && !form.package) return 'يرجى اختيار الباقة';
    if (fieldName === 'partnerPhone' && form.partnerPhone && !/^05\d{8}$/.test(form.partnerPhone)) return 'رقم جوال الشريك غير صحيح';
    return '';
  };

  const validateStep = (nextStep) => {
    setSubmitted(true);
    if (nextStep === 2) {
      const requiredStepOne = ['firstName', 'lastName', 'email', 'password', 'gender', 'dob', 'phone', 'nationalId'];
      const hasError = requiredStepOne.some((f) => !!getFieldError(f));
      if (hasError) {
        toast.error('يرجى إكمال البيانات الأساسية قبل المتابعة');
        return false;
      }
    }
    if (nextStep === 3 && !!getFieldError('package')) {
      toast.error('يرجى اختيار الباقة أولاً');
      return false;
    }
    setSubmitted(false);
    return true;
  };

  const goToStep = (nextStep) => {
    if (nextStep > step && !validateStep(nextStep)) return;
    setStep(nextStep);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const selected = packages.find(p => p.value === form.package);
    if (getFieldError('partnerPhone')) {
      toast.error('رقم جوال الشريك يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }
    const age = calcAge(form.dob);
    if (age !== null) {
      if (selected?.min_age != null && age < selected.min_age) {
        toast.error('العمر غير مؤهل لهذه الباقة');
        return;
      }
      if (selected?.max_age != null && age > selected.max_age) {
        toast.error('العمر غير مؤهل لهذه الباقة');
        return;
      }
    }
    const partner = selected?.allow_partner
      ? { name: form.partnerName, email: form.partnerEmail, birthDate: form.partnerDob, phone: form.partnerPhone }
      : { name: '', email: '', birthDate: '', phone: '' };
    const payload = {
      user: {
        username: form.username || `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        phone: form.phone,
        gender: form.gender,
        dob: form.dob,
        firstName: form.firstName,
        lastName: form.lastName,
        nationalId: form.nationalId,
        jobTitle: form.jobTitle,
        address: form.address,
      },
      partner,
      membership: {
        value: selected?.value || form.package,
        label: selected?.label || '',
        period_days: selected?.period_days || 0,
        priceLabel: selected?.price || '',
        allow_partner: !!selected?.allow_partner,
        min_age: selected?.min_age ?? null,
        max_age: selected?.max_age ?? null,
      },
      payment: { method: form.paymentMethod || 'cash' },
    };
    localStorage.setItem('pending_membership', JSON.stringify(payload));
    navigate('/checkout');
  };

  const selected = packages.find(p => p.value === form.package);
  const ageSegment = (() => {
    if (!form.dob) return null;
    const age = calcAge(form.dob);
    if (age === null) return null;
    return age >= 15 ? 'adult' : 'junior';
  })();
  const displayPackages = ageSegment ? packages.filter(p => p.segment === ageSegment) : packages;

  return (
    <div className="membership-page">
      <Container>
        <Row className="justify-content-center pt-5 pb-4">
          <Col lg={10}>
            <h1 className="mb-3 text-center">تسجيل العضوية</h1>
            <p className="text-center text-muted lead">رحلة تسجيل واضحة من 3 خطوات: بياناتك، اختيار الباقة، ثم تأكيد الدفع</p>
            <div className="membership-stepper mb-3">
              <Badge pill bg={step >= 1 ? 'primary' : 'secondary'} className="step-chip">1) البيانات الأساسية</Badge>
              <Badge pill bg={step >= 2 ? 'primary' : 'secondary'} className="step-chip">2) اختيار الباقة</Badge>
              <Badge pill bg={step >= 3 ? 'primary' : 'secondary'} className="step-chip">3) الدفع والتأكيد</Badge>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow border-0">
              <Card.Body>
                <Form onSubmit={onSubmit}>
                  {step === 1 && (
                    <Row className="g-4 form-step">
                      <Col md={10} className="mx-auto">
                        <h5 className="mb-3">البيانات الأساسية</h5>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>الاسم الأول *</Form.Label>
                              <Form.Control name="firstName" value={form.firstName} onChange={onChange} isInvalid={submitted && !!getFieldError('firstName')} required />
                              <Form.Control.Feedback type="invalid">{getFieldError('firstName')}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>الاسم الأخير *</Form.Label>
                              <Form.Control name="lastName" value={form.lastName} onChange={onChange} isInvalid={submitted && !!getFieldError('lastName')} required />
                              <Form.Control.Feedback type="invalid">{getFieldError('lastName')}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>اسم المستخدم (اختياري)</Form.Label>
                          <Form.Control name="username" value={form.username} onChange={onChange} placeholder="يتم توليده تلقائياً إن تُرك فارغاً" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>البريد الإلكتروني *</Form.Label>
                          <Form.Control type="email" name="email" value={form.email} onChange={onChange} isInvalid={submitted && !!getFieldError('email')} required />
                          <Form.Control.Feedback type="invalid">{getFieldError('email')}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>كلمة المرور *</Form.Label>
                          <Form.Control type="password" name="password" value={form.password} onChange={onChange} minLength={8} isInvalid={submitted && !!getFieldError('password')} required />
                          <Form.Control.Feedback type="invalid">{getFieldError('password')}</Form.Control.Feedback>
                        </Form.Group>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>الجنس *</Form.Label>
                              <Form.Select name="gender" value={form.gender} onChange={onChange} isInvalid={submitted && !!getFieldError('gender')} required>
                                <option value="">اختر</option>
                                <option value="male">ذكر</option>
                                <option value="female">أنثى</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">{getFieldError('gender')}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>تاريخ الميلاد *</Form.Label>
                              <Form.Control type="date" name="dob" value={form.dob} onChange={onChange} isInvalid={submitted && !!getFieldError('dob')} required />
                              <Form.Control.Feedback type="invalid">{getFieldError('dob')}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>رقم الجوال *</Form.Label>
                              <Form.Control name="phone" value={form.phone} onChange={onChange} isInvalid={submitted && !!getFieldError('phone')} required placeholder="05XXXXXXXX" />
                              <Form.Control.Feedback type="invalid">{getFieldError('phone')}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>رقم الهوية/الإقامة *</Form.Label>
                              <Form.Control name="nationalId" value={form.nationalId} onChange={onChange} isInvalid={submitted && !!getFieldError('nationalId')} required placeholder="10 أرقام" />
                              <Form.Control.Feedback type="invalid">{getFieldError('nationalId')}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>المسمى الوظيفي</Form.Label>
                          <Form.Control name="jobTitle" value={form.jobTitle} onChange={onChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>العنوان</Form.Label>
                          <Form.Control name="address" value={form.address} onChange={onChange} />
                        </Form.Group>
                      </Col>
                    </Row>
                  )}

                  {step === 2 && (
                    <Row className="g-4 form-step">
                      <Col md={10} className="mx-auto">
                        <h5 className="mb-3">اختر الباقة المناسبة</h5>
                        <Alert variant="light">
                          يتم فلترة الباقات تلقائياً حسب العمر لضمان التوافق مع شروط الاشتراك.
                        </Alert>
                        <Form.Group className="mb-3">
                          <Form.Label>الباقة *</Form.Label>
                          <Form.Select name="package" value={form.package} onChange={onChange} isInvalid={submitted && !!getFieldError('package')} required>
                            <option value="">اختر الباقة</option>
                            {displayPackages.map(p => (
                              <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{getFieldError('package')}</Form.Control.Feedback>
                        </Form.Group>
                        {selected && (
                          <Card className="border-0 bg-light">
                            <Card.Body>
                              <h6>{selected.label}</h6>
                              <p className="mb-1 text-muted">السعر: {selected.price || '—'}</p>
                              <p className="mb-1 text-muted">المدة: {selected.period_days ? `${selected.period_days} يوم` : '—'}</p>
                              <p className="mb-0 text-muted">يشمل شريك: {selected.allow_partner ? 'نعم' : 'لا'}</p>
                            </Card.Body>
                          </Card>
                        )}
                        {selected?.allow_partner && (
                          <Row className="mt-3">
                            <Col md={12}>
                              <h6 className="mb-3">بيانات الشريك (اختياري)</h6>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>الاسم</Form.Label>
                                    <Form.Control name="partnerName" value={form.partnerName || ''} onChange={onChange} />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>البريد الإلكتروني</Form.Label>
                                    <Form.Control type="email" name="partnerEmail" value={form.partnerEmail || ''} onChange={onChange} />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>تاريخ الميلاد</Form.Label>
                                    <Form.Control type="date" name="partnerDob" value={form.partnerDob || ''} onChange={onChange} />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>رقم الجوال</Form.Label>
                                    <Form.Control name="partnerPhone" value={form.partnerPhone || ''} onChange={onChange} isInvalid={submitted && !!getFieldError('partnerPhone')} placeholder="05XXXXXXXX" />
                                    <Form.Control.Feedback type="invalid">{getFieldError('partnerPhone')}</Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        )}
                      </Col>
                    </Row>
                  )}

                  {step === 3 && (
                    <Row className="g-4 form-step">
                      <Col md={10} className="mx-auto">
                        <h5 className="mb-3">الدفع والتأكيد</h5>
                        <Form.Group className="mb-3">
                          <Form.Label>طريقة الدفع</Form.Label>
                          <Form.Select name="paymentMethod" value={form.paymentMethod} onChange={onChange}>
                            <option value="cash">نقداً في الفرع</option>
                            <option value="card">بطاقة</option>
                            <option value="bank_transfer">تحويل بنكي</option>
                          </Form.Select>
                        </Form.Group>
                        <Alert variant="info" className="mb-3">
                          عند التأكيد سيتم حفظ طلب الاشتراك والانتقال لصفحة المراجعة النهائية.
                        </Alert>
                        <Card className="border-0 bg-light">
                          <Card.Body>
                            <p className="mb-1"><strong>الاسم:</strong> {`${form.firstName} ${form.lastName}`.trim()}</p>
                            <p className="mb-1"><strong>الجوال:</strong> {form.phone || '—'}</p>
                            <p className="mb-1"><strong>الباقة:</strong> {selected?.label || '—'}</p>
                            <p className="mb-0"><strong>السعر:</strong> {selected?.price || '—'}</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <Button type="button" variant="outline-secondary" onClick={() => goToStep(Math.max(1, step - 1))} disabled={step === 1}>
                      السابق
                    </Button>
                    {step < 3 ? (
                      <Button type="button" variant="primary" onClick={() => goToStep(step + 1)}>
                        التالي
                      </Button>
                    ) : (
                      <Button type="submit" variant="success">
                        متابعة إلى الدفع
                      </Button>
                    )}
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

export default MembershipPage;
