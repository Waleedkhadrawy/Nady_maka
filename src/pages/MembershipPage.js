import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/pages/MembershipPage.css';

const MembershipPage = () => {
  const [form, setForm] = useState({
    username: '', firstName: '', lastName: '', email: '', password: '', gender: '', dob: '',
    phone: '', nationalId: '', jobTitle: '', address: '', package: '', paymentMethod: 'cash',
    partnerName: '', partnerEmail: '', partnerDob: '', partnerPhone: '',
  });
  const [packages, setPackages] = useState([]);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const rows = await api.listMembershipPackages();
        const mapped = rows.map(p => ({
          value: p.code, label: p.label, price: p.price != null ? `${p.price} ${p.currency || ''}`.trim() : '',
          period_days: p.period_days, segment: p.segment, allow_partner: !!p.allow_partner,
          min_age: p.min_age ?? null, max_age: p.max_age ?? null
        }));
        setPackages(mapped);
      } catch (e) {
        toast.error('لم نتمكن من تحميل الباقات، سيتم استخدام باقات افتراضية');
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

  const calcAge = (dob) => {
    if (!dob) return null;
    const d = new Date(dob); const now = new Date();
    let age = now.getFullYear() - d.getFullYear(); const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  const getFieldError = (fieldName) => {
    if (fieldName === 'firstName' && !form.firstName.trim()) return 'الاسم الأول مطلوب';
    if (fieldName === 'lastName' && !form.lastName.trim()) return 'الاسم الأخير مطلوب';
    if (fieldName === 'email') {
      if (!form.email.trim()) return 'البريد مطلوب';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'صيغة غير صحيحة';
    }
    if (fieldName === 'password') {
      if (!form.password) return 'الرقم السري مطلوب';
      if (form.password.length < 8) return 'أقل شيء 8 أحرف';
    }
    if (fieldName === 'gender' && !form.gender) return 'مطلوب';
    if (fieldName === 'dob' && !form.dob) return 'مطلوب';
    if (fieldName === 'phone') {
      if (!form.phone) return 'الجوال مطلوب';
      if (!/^05\d{8}$/.test(form.phone)) return 'يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';
    }
    if (fieldName === 'nationalId') {
      if (!form.nationalId) return 'رقم الهوية مطلوب';
      if (!/^\d{10}$/.test(form.nationalId)) return '10 أرقام فقط';
    }
    if (fieldName === 'package' && !form.package) return 'يجب اختيار الباقة';
    if (fieldName === 'partnerPhone' && form.partnerPhone && !/^05\d{8}$/.test(form.partnerPhone)) return 'رقم غير صحيح';
    return '';
  };

  const validateStep = (nextStep) => {
    setSubmitted(true);
    if (nextStep === 2) {
      const required = ['firstName', 'lastName', 'email', 'password', 'gender', 'dob', 'phone', 'nationalId'];
      if (required.some(f => !!getFieldError(f))) { toast.error('يرجى إكمال البيانات الإلزامية بنجاح'); return false; }
    }
    if (nextStep === 3 && !!getFieldError('package')) { toast.error('يرجى تحديد الباقة'); return false; }
    setSubmitted(false); return true;
  };

  const goToStep = (n) => { if (n > step && !validateStep(n)) return; setStep(n); };

  const onSubmit = async (e) => {
    e.preventDefault();
    const selected = packages.find(p => p.value === form.package);
    if (getFieldError('partnerPhone')) { toast.error('تأكد من رقم الشريك'); return; }
    const age = calcAge(form.dob);
    if (age !== null) {
      if (selected?.min_age != null && age < selected.min_age) { toast.error('عمرك أقل من المسموح للباقة'); return; }
      if (selected?.max_age != null && age > selected.max_age) { toast.error('عمرك تخطى المسموح للباقة'); return; }
    }
    const partner = selected?.allow_partner
      ? { name: form.partnerName, email: form.partnerEmail, birthDate: form.partnerDob, phone: form.partnerPhone }
      : { name: '', email: '', birthDate: '', phone: '' };
      
    const payload = {
      user: {
        username: form.username || `${form.firstName} ${form.lastName}`.trim(),
        email: form.email, password: form.password, phone: form.phone, gender: form.gender,
        dob: form.dob, firstName: form.firstName, lastName: form.lastName, nationalId: form.nationalId,
        jobTitle: form.jobTitle, address: form.address,
      },
      partner,
      membership: {
        value: selected?.value || form.package, label: selected?.label || '', period_days: selected?.period_days || 0,
        priceLabel: selected?.price || '', allow_partner: !!selected?.allow_partner,
        min_age: selected?.min_age ?? null, max_age: selected?.max_age ?? null,
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
  const displayPackages = ageSegment ? packages.filter(p => p.segment === ageSegment || !p.segment) : packages;

  return (
    <div className="app-container membership-page pt-4 pt-md-5">
      <Container>
        <div className="section-title-wrapper reveal-up mb-4">
          <div className="section-badge border border-primary"><i className="bi bi-person-plus-fill"></i> طلب التحاق</div>
          <h2>تسجيل العضوية</h2>
          <p className="lead mx-auto" style={{ maxWidth: 600 }}>
            ملء بياناتك واختيار الباقة المناسبة هي الخطوة الأولى لبدء رحلتك نحو اللياقة في مكة يارد.
          </p>
        </div>

        {/* Custom Stepper */}
        <div className="membership-stepper mb-5 reveal-up" style={{ animationDelay: '0.1s' }}>
          <div className={`step-chip ${step >= 1 ? 'bg-primary' : ''}`}><i className="bi bi-1-circle me-1"></i> معلوماتك الشخصية</div>
          <i className="bi bi-arrow-left text-muted d-none d-md-block"></i>
          <div className={`step-chip ${step >= 2 ? 'bg-primary' : ''}`}><i className="bi bi-2-circle me-1"></i> اختيار الباقة</div>
          <i className="bi bi-arrow-left text-muted d-none d-md-block"></i>
          <div className={`step-chip ${step >= 3 ? 'bg-primary' : ''}`}><i className="bi bi-3-circle me-1"></i> طريقة الدفع والتأكيد</div>
        </div>

        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card className="glass-panel border-0 mb-4 reveal-up" style={{ animationDelay: '0.2s' }}>
              <Card.Body className="p-4 p-md-5">
                <Form onSubmit={onSubmit}>
                  {/* STEP 1: Personal Info */}
                  {step === 1 && (
                    <div className="form-step">
                      <h4 className="mb-4 text-primary"><i className="bi bi-person-lines-fill me-2"></i>البيانات الأساسية</h4>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>الاسم الأول *</Form.Label>
                            <div className="position-relative">
                              <i className="bi bi-person position-absolute text-muted" style={{ right: 15, top: 12 }}></i>
                              <Form.Control name="firstName" value={form.firstName} onChange={onChange} isInvalid={submitted && !!getFieldError('firstName')} required style={{ paddingRight: 40 }} />
                            </div>
                            <Form.Control.Feedback type="invalid">{getFieldError('firstName')}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>الاسم الأخير *</Form.Label>
                            <div className="position-relative">
                              <i className="bi bi-person-add position-absolute text-muted" style={{ right: 15, top: 12 }}></i>
                              <Form.Control name="lastName" value={form.lastName} onChange={onChange} isInvalid={submitted && !!getFieldError('lastName')} required style={{ paddingRight: 40 }} />
                            </div>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>البريد الإلكتروني *</Form.Label>
                            <div className="position-relative">
                              <i className="bi bi-envelope position-absolute text-muted" style={{ right: 15, top: 12 }}></i>
                              <Form.Control type="email" name="email" value={form.email} onChange={onChange} isInvalid={submitted && !!getFieldError('email')} required style={{ paddingRight: 40, direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <Form.Control.Feedback type="invalid" className="d-block">{submitted && getFieldError('email')}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>كلمة المرور *</Form.Label>
                            <div className="position-relative">
                              <i className="bi bi-lock position-absolute text-muted" style={{ right: 15, top: 12 }}></i>
                              <Form.Control type="password" name="password" value={form.password} onChange={onChange} minLength={8} isInvalid={submitted && !!getFieldError('password')} required style={{ paddingRight: 40 }} />
                            </div>
                            <Form.Control.Feedback type="invalid" className="d-block">{submitted && getFieldError('password')}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>رقم الجوال *</Form.Label>
                            <div className="position-relative">
                              <i className="bi bi-phone position-absolute text-muted" style={{ right: 15, top: 12 }}></i>
                              <Form.Control name="phone" value={form.phone} onChange={onChange} isInvalid={submitted && !!getFieldError('phone')} required placeholder="05XXXXXXXX" style={{ paddingRight: 40, direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <Form.Control.Feedback type="invalid" className="d-block">{submitted && getFieldError('phone')}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>تاريخ الميلاد *</Form.Label>
                            <Form.Control type="date" name="dob" value={form.dob} onChange={onChange} isInvalid={submitted && !!getFieldError('dob')} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>رقم الهوية/الإقامة *</Form.Label>
                            <div className="position-relative">
                              <i className="bi bi-card-heading position-absolute text-muted" style={{ right: 15, top: 12 }}></i>
                              <Form.Control name="nationalId" value={form.nationalId} onChange={onChange} isInvalid={submitted && !!getFieldError('nationalId')} required placeholder="10 أرقام" style={{ paddingRight: 40 }} />
                            </div>
                            <Form.Control.Feedback type="invalid" className="d-block">{submitted && getFieldError('nationalId')}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>الجنس *</Form.Label>
                            <Form.Select name="gender" value={form.gender} onChange={onChange} isInvalid={submitted && !!getFieldError('gender')} required>
                              <option value="">اختر الجنس...</option>
                              <option value="male">ذكر</option>
                              <option value="female">أنثى</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {/* STEP 2: Package Info */}
                  {step === 2 && (
                    <div className="form-step">
                      <h4 className="mb-2 text-primary"><i className="bi bi-box-seam me-2"></i>اختر बाقة العضوية</h4>
                      <p className="text-muted small mb-4"><i className="bi bi-info-circle me-1"></i> يتم تصفية الباقات المتاحة تلقائياً بما يتناسب مع عمرك المسجل.</p>
                      
                      {submitted && getFieldError('package') && (
                        <Alert variant="danger" className="py-2"><i className="bi bi-exclamation-triangle me-2"></i>يجب عليك اختيار باقة واحدة على الأقل للاستمرار.</Alert>
                      )}

                      {displayPackages.length === 0 ? (
                        <Alert variant="warning">لا تتوافر باقات تناسب فئتك العمرية حالياً. تواصل مع الإدارة.</Alert>
                      ) : (
                        <div className="package-selection-grid">
                          {displayPackages.map(p => (
                            <div 
                              key={p.value} 
                              className={`package-card ${form.package === p.value ? 'selected' : ''}`}
                              onClick={() => setForm(prev => ({ ...prev, package: p.value }))}
                            >
                              <div className="pkg-title">{p.label}</div>
                              <div className="pkg-price">{p.price || 'يعتمد على التقييم'}</div>
                              <ul className="pkg-details">
                                {p.period_days ? <li><i className="bi bi-calendar2-range"></i> المدة: {p.period_days} يوماً</li> : null}
                                <li>
                                  {p.allow_partner ? <><i className="bi bi-people-fill text-success"></i> تتيح إضافة شريك/تابع</> : <><i className="bi bi-person-fill text-muted"></i> باقة فردية</>}
                                </li>
                                {p.segment === 'junior' && <li><i className="bi bi-emoji-smile-fill text-warning"></i> مخصصة للأشبال والأحداث</li>}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Partner Form Section if needed */}
                      {selected?.allow_partner && (
                        <div className="mt-4 pt-4 border-top">
                          <h5 className="mb-3 text-secondary"><i className="bi bi-people me-2"></i>بيانات التابع / الشريك (اختياري)</h5>
                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Group><Form.Label>اسم الشريك</Form.Label><Form.Control name="partnerName" value={form.partnerName} onChange={onChange} /></Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group><Form.Label>البريد الإلكتروني</Form.Label><Form.Control type="email" name="partnerEmail" value={form.partnerEmail} onChange={onChange} style={{ direction: 'ltr', textAlign: 'right' }} /></Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group><Form.Label>رقم الجوال</Form.Label><Form.Control name="partnerPhone" value={form.partnerPhone} onChange={onChange} placeholder="05XXXXXXXX" isInvalid={submitted && !!getFieldError('partnerPhone')} style={{ direction: 'ltr', textAlign: 'right' }} /></Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group><Form.Label>تاريخ الميلاد</Form.Label><Form.Control type="date" name="partnerDob" value={form.partnerDob} onChange={onChange} /></Form.Group>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 3: Payment & Summary */}
                  {step === 3 && (
                    <div className="form-step">
                      <h4 className="mb-4 text-primary"><i className="bi bi-credit-card me-2"></i>طريقة الدفع والتأكيد</h4>
                      
                      <div className="payment-selector">
                        <div className={`payment-option ${form.paymentMethod === 'cash' ? 'active' : ''}`} onClick={() => setForm(prev => ({...prev, paymentMethod: 'cash'}))}>
                          <i className="bi bi-cash-stack"></i>
                          <span>نقداً بالمركز</span>
                        </div>
                        <div className={`payment-option ${form.paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setForm(prev => ({...prev, paymentMethod: 'card'}))}>
                          <i className="bi bi-credit-card-2-front"></i>
                          <span>الدفع الإلكتروني</span>
                        </div>
                        <div className={`payment-option ${form.paymentMethod === 'bank_transfer' ? 'active' : ''}`} onClick={() => setForm(prev => ({...prev, paymentMethod: 'bank_transfer'}))}>
                          <i className="bi bi-bank"></i>
                          <span>تحويل بنكي</span>
                        </div>
                      </div>

                      <div className="review-card mt-4">
                        <div className="review-header">
                          <i className="bi bi-file-earmark-check border border-primary rounded-circle p-1"></i> ملخص الطلب
                        </div>
                        <div className="review-body">
                          <div className="review-row">
                            <span className="review-label">صاحب العضوية</span>
                            <span className="review-value">{`${form.firstName} ${form.lastName}`.trim()}</span>
                          </div>
                          <div className="review-row">
                            <span className="review-label">رقم الجوال</span>
                            <span className="review-value" style={{ direction: 'ltr' }}>{form.phone}</span>
                          </div>
                          <div className="review-row">
                            <span className="review-label">الباقة المختارة</span>
                            <span className="review-value text-primary">{selected?.label || '—'}</span>
                          </div>
                          <div className="review-row bg-light px-3 rounded mt-2">
                            <span className="review-label">إجمالي القيمة التقديرية</span>
                            <span className="review-value fs-5">{selected?.price || '—'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Alert variant="warning" className="mt-4 border-0 rounded-3 shadow-sm">
                        <i className="bi bi-info-circle-fill me-2"></i> بالنقر على زر التأكيد، سيتم تحويلك لصفحة الفاتورة لإنهاء الطلب ووضعه تحت مراجعة الإدارة.
                      </Alert>
                    </div>
                  )}

                  {/* Form Nav Buttons */}
                  <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                    <Button type="button" variant="outline-secondary" className="btn-outline-premium text-muted border-secondary" onClick={() => goToStep(Math.max(1, step - 1))} disabled={step === 1}>
                      <i className="bi bi-arrow-right me-1"></i> الخطوة السابقة
                    </Button>
                    
                    {step < 3 ? (
                      <Button type="button" className="btn-premium" onClick={() => goToStep(step + 1)}>
                        المتابعة <i className="bi bi-arrow-left ms-1"></i>
                      </Button>
                    ) : (
                      <Button type="submit" className="btn-premium">
                        تأكيد الطلب والدفع <i className="bi bi-check2-circle ms-1"></i>
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
