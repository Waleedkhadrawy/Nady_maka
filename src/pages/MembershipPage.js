import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import '../styles/pages/MembershipPage.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const MembershipPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    phone: '',
    package: '',
    partnerName: '',
    partnerEmail: '',
    partnerDob: '',
    partnerPhone: '',
  });

  const [packages, setPackages] = useState([]);

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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const phoneOk = /^05\d{7}$/.test(form.phone);
    const partnerPhoneOk = form.partnerPhone ? /^05\d{7}$/.test(form.partnerPhone) : true;
    if (!phoneOk || !partnerPhoneOk) {
      toast.error('رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 9 أرقام');
      return;
    }
    if (!form.package || !form.username || !form.email || !form.password || !form.gender || !form.dob) {
      toast.error('يرجى إكمال كافة البيانات المطلوبة');
      return;
    }
    // Persist selection to proceed to checkout page
    const selected = packages.find(p=>p.value===form.package);
    // age eligibility check
    const calcAge = (dob) => {
      if (!dob) return null;
      const d = new Date(dob);
      const now = new Date();
      let age = now.getFullYear() - d.getFullYear();
      const m = now.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
      return age;
    };
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
    // partner only when allowed
    const partner = selected?.allow_partner ? { name: form.partnerName, email: form.partnerEmail, birthDate: form.partnerDob, phone: form.partnerPhone } : { name: '', email: '', birthDate: '', phone: '' };
    const payload = {
      user: { username: form.username, email: form.email, password: form.password, phone: form.phone, gender: form.gender, dob: form.dob },
      partner,
      membership: { value: selected?.value || form.package, label: selected?.label || '', period_days: selected?.period_days || 0, allow_partner: !!selected?.allow_partner, min_age: selected?.min_age ?? null, max_age: selected?.max_age ?? null }
    };
    localStorage.setItem('pending_membership', JSON.stringify(payload));
    navigate('/checkout');
  };

  const selected = packages.find(p => p.value === form.package);
  const ageSegment = (() => {
    if (!form.dob) return null;
    const d = new Date(form.dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age >= 15 ? 'adult' : 'junior';
  })();
  const displayPackages = ageSegment ? packages.filter(p => p.segment === ageSegment) : packages;

  return (
    <div className="membership-page">
      <Container>
        <Row className="justify-content-center pt-5 pb-4">
          <Col lg={10}>
            <h1 className="mb-3 text-center">الانضمام إلى العضوية</h1>
            <p className="text-center text-muted lead">يرجى تعبئة البيانات التالية لإتمام عضويتك في مكة يارد</p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow border-0">
              <Card.Body>
                <Row className="g-4">
                  <Col md={10} className="mx-auto">
                    <h5 className="mb-3">معلومات المسترك الأساسي</h5>
                    <Form onSubmit={onSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>اسم المستخدم</Form.Label>
                        <Form.Control name="username" value={form.username} onChange={onChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>البريد الإلكتروني</Form.Label>
                        <Form.Control type="email" name="email" value={form.email} onChange={onChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>كلمة المرور</Form.Label>
                        <Form.Control type="password" name="password" value={form.password} onChange={onChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>الجنس</Form.Label>
                        <Form.Select name="gender" value={form.gender} onChange={onChange} required>
                          <option value="">اختر</option>
                          <option value="male">ذكر</option>
                          <option value="female">أنثى</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>تاريخ الميلاد</Form.Label>
                        <Form.Control type="date" name="dob" value={form.dob} onChange={onChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>رقم الجوال</Form.Label>
                        <Form.Control name="phone" value={form.phone} onChange={onChange} required placeholder="مثال: 05XXXXXXX" />
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                {selected?.allow_partner && (
                  <Row className="g-4 mt-2">
                    <Col md={10} className="mx-auto">
                      <h5 className="mb-3">معلومات الشريك</h5>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>الاسم</Form.Label>
                          <Form.Control name="partnerName" value={form.partnerName || ''} onChange={onChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>البريد الإلكتروني</Form.Label>
                          <Form.Control type="email" name="partnerEmail" value={form.partnerEmail || ''} onChange={onChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>تاريخ الميلاد</Form.Label>
                          <Form.Control type="date" name="partnerDob" value={form.partnerDob || ''} onChange={onChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>رقم التليفون</Form.Label>
                          <Form.Control name="partnerPhone" value={form.partnerPhone || ''} onChange={onChange} placeholder="مثال: 05XXXXXXX" />
                        </Form.Group>
                      </Form>
                    </Col>
                  </Row>
                )}
                <hr className="my-4" />
                <Row className="g-4">
                  <Col md={6}>
                    <h5 className="mb-3">معلومات الدفع</h5>
                    <Form onSubmit={onSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>الباقة</Form.Label>
                        <Form.Select name="package" value={form.package} onChange={onChange} required>
                          <option value="">اختر الباقة</option>
                          {displayPackages.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label>السعر</Form.Label>
                        <Form.Control readOnly value={selected ? selected.price : ''} placeholder="—" />
                      </Form.Group>
                      <Button type="submit" variant="primary" size="lg" className="w-100">الدفع</Button>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MembershipPage;
