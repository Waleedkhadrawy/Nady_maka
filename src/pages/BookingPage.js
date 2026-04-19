import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/pages/BookingPage.css';

const SERVICES = [
  { id: 'pt', name: 'تدريب شخصي 1on1', desc: 'جلسة تدريب خاصة مع مدرب محترف', icon: 'bi-person-vcard' },
  { id: 'group', name: 'حصة جماعية', desc: 'تمارين الكارديو واللياقة ضمن مجموعة', icon: 'bi-people-fill' }, // Only bootstrap-icons
  { id: 'sauna', name: 'جلسة استشفاء', desc: 'مساج، ساونا، ومرافق صحية', icon: 'bi-droplet-half' },
  { id: 'academy', name: 'الأكاديميات', desc: 'تقييم والتحاق ببرامج الأكاديمية', icon: 'bi-mortarboard-fill' },
];

export default function BookingPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '', service: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Time slots logic
  const availableSlots = ['08:00', '10:00', '13:00', '15:00', '17:00', '19:00', '21:00'];

  const onChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === 'phone') nextValue = value.replace(/[^\d]/g, '').slice(0, 10);
    setForm({ ...form, [name]: nextValue });
  };

  const getFieldError = (fieldName) => {
    if (fieldName === 'phone' && form.phone && !/^05\d{8}$/.test(form.phone)) return 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.service) return toast.error('يرجى اختيار الخدمة أولاً');
    if (!form.time) return toast.error('يرجى تحديد وقت الحجز');
    if (getFieldError('phone')) return toast.error(getFieldError('phone'));

    setLoading(true);
    try {
      const scheduled_at = `${form.date}T${form.time}:00`;
      await api.createBooking({
        name: form.name, email: form.email, phone: form.phone,
        service: form.service, scheduled_at, notes: form.notes
      });
      setSuccess(true);
      toast.success('تم إرسال طلب الحجز بنجاح');
      window.scrollTo(0, 0);
    } catch (err) {
      toast.error(err.message || 'حدث خطأ أثناء إرسال الحجز');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="booking-page app-main py-5 text-center">
        <Col md={8} className="mx-auto mt-5">
          <Alert variant="success" className="p-5 border-0 rounded-4 shadow-sm">
            <i className="bi bi-calendar-check-fill text-success" style={{ fontSize: '4rem' }}></i>
            <h2 className="mt-4 mb-3">تم إرسال طلب الحجز بنجاح!</h2>
            <p className="lead text-muted mb-4">
              شكراً لك {form.name}، سنقوم بمراجعة طلب حجزك لخدمة <strong>{SERVICES.find(s=>s.id===form.service)?.name}</strong> والتواصل معك قريباً لتأكيد الموعد.
            </p>
            <Button variant="outline-success" className="btn-outline-premium mx-2" onClick={() => { setSuccess(false); setForm({name:'', email:'', phone:'', date:'', time:'', service:'', notes:''}); }}>
              حجز موعد جديد <i className="bi bi-plus-circle ms-1"></i>
            </Button>
            <Button href="/" variant="primary" className="btn-premium mx-2">
              العودة للرئيسية <i className="bi bi-house ms-1"></i>
            </Button>
          </Alert>
        </Col>
      </Container>
    );
  }

  return (
    <div className="booking-page app-main pt-4 pt-md-5">
      <Container>
        <div className="section-title-wrapper reveal-up mb-5">
          <div className="section-badge border border-primary text-primary">
            <i className="bi bi-calendar-date"></i> المواعيد
          </div>
          <h2>حجز موعد</h2>
          <p className="lead mx-auto" style={{ maxWidth: 600 }}>
            احجز موعدك لزيارة النادي، التقييم الرياضي، أو الاستفادة من الجلسات التدريبية المخصصة.
          </p>
        </div>

        <Form onSubmit={onSubmit}>
          <Row className="g-4">
            {/* Right side: Service & Calendar */}
            <Col lg={7} className="reveal-up" style={{ animationDelay: '0.1s' }}>
              
              <h5 className="mb-3 text-primary"><i className="bi bi-ui-checks-grid me-2"></i>اختر نوع الخدمة أو الموعد</h5>
              <Row className="g-3 mb-5">
                {SERVICES.map(svc => (
                  <Col md={6} key={svc.id}>
                    <div 
                      className={`service-card ${form.service === svc.id ? 'selected' : ''}`}
                      onClick={() => setForm({...form, service: svc.id})}
                    >
                      <i className={`bi ${svc.icon}`}></i>
                      <h5>{svc.name}</h5>
                      <p>{svc.desc}</p>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="calendar-header shadow-sm">
                <i className="bi bi-calendar3"></i>
                <div>
                  <h3>حدد التاريخ والوقت</h3>
                  <p className="mb-0 text-white-50">يوم الحجز وتفضيل الوقت المناسب لجداولك</p>
                </div>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">حدد التاريخ *</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="date" 
                      value={form.date} 
                      onChange={onChange} 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      className="py-3"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Label className="fw-bold mt-2">الأوقات المتاحة *</Form.Label>
                  <div>
                    {availableSlots.map(t => (
                      <span 
                        key={t}
                        className={`time-slot ${form.time === t ? 'selected' : ''}`}
                        onClick={() => setForm({...form, time: t})}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            </Col>

            {/* Left side: Personal Info & Submit */}
            <Col lg={5} className="reveal-up" style={{ animationDelay: '0.2s' }}>
              <Card className="booking-card glass-panel border-0 sticky-top" style={{ top: 100 }}>
                <Card.Body className="p-4 p-md-5">
                  <h4 className="mb-4 text-primary"><i className="bi bi-person-lines-fill me-2"></i>بياناتك الشخصية</h4>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>الاسم الكامل *</Form.Label>
                    <div className="position-relative">
                      <i className="bi bi-person position-absolute text-muted" style={{ right: 15, top: 12 }}></i>
                      <Form.Control name="name" value={form.name} onChange={onChange} required style={{ paddingRight: 40 }} />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>رقم الجوال *</Form.Label>
                    <div className="position-relative">
                      <i className="bi bi-phone position-absolute text-muted" style={{ right: 15, top: 12 }}></i>
                      <Form.Control name="phone" value={form.phone} onChange={onChange} required placeholder="05XXXXXXXX" style={{ paddingRight: 40, direction: 'ltr', textAlign: 'right' }} isInvalid={!!getFieldError('phone')} />
                    </div>
                    <Form.Control.Feedback type="invalid">{getFieldError('phone')}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>البريد الإلكتروني</Form.Label>
                    <div className="position-relative">
                      <i className="bi bi-envelope position-absolute text-muted" style={{ right: 15, top: 12 }}></i>
                      <Form.Control type="email" name="email" value={form.email} onChange={onChange} style={{ paddingRight: 40, direction: 'ltr', textAlign: 'right' }} />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>ملاحظات (اختياري)</Form.Label>
                    <Form.Control as="textarea" rows={3} name="notes" value={form.notes} onChange={onChange} placeholder="إضافة أي تفاصيل حول طلبك..." />
                  </Form.Group>

                  <Button type="submit" variant="primary" className="btn-premium w-100 py-3" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جارٍ المعالجة...</>
                    ) : (
                      <>تأكيد الحجز والإرسال <i className="bi bi-send-check ms-1"></i></>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}
