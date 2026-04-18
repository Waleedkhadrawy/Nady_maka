import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import SectionTitle from '../components/SectionTitle';
import '../styles/pages/SurveyPage.css';
import { api } from '../services/api';

const categories = [
  { key: 'membership', icon: 'fas fa-id-card', title: 'العضوية' },
  { key: 'pricing', icon: 'fas fa-tags', title: 'الأسعار' },
  { key: 'services', icon: 'fas fa-dumbbell', title: 'الخدمات' },
  { key: 'schedule', icon: 'fas fa-calendar-alt', title: 'الجداول' },
  { key: 'general', icon: 'fas fa-comments', title: 'استفسار عام' },
  { key: 'complaint', icon: 'fas fa-exclamation-circle', title: 'شكوى' }
];

const SurveyPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [dynamicForm, setDynamicForm] = useState(null);
  const [formData, setFormData] = useState({
    // معلومات شخصية
    name: '',
    age: '',
    gender: '',
    city: '',
    phone: '',
    email: '',
    // تقييم خدمات النادي
    rating: '5',
    servicesUsed: [],
    hasDifficulties: '',
    difficultiesComment: '',
    // الأنشطة المقترحة
    proposedActivities: '',
    wantDiscounts: '',
    // التواصل والمتابعة
    preferredContact: '',
    subscribeNewsletter: false,
    // ملاحظات إضافية
    additionalNotes: '',
    // تصنيف عام داخلي
    category: 'general',
    subject: '',
    message: ''
  });

  useEffect(()=>{
    (async()=>{
      try{ const f = await api.getForm('survey'); setDynamicForm(f||null); }catch{ setDynamicForm(null); }
    })();
  },[]);

  const setCategory = (key) => setFormData({ ...formData, category: key });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (dynamicForm){ await api.submitForm('survey', formData); } else { await api.submitSurvey(formData); }
      setIsSubmitted(true);
    } catch (err) { setError('تعذر إرسال الاستعلام'); }
  };

  const renderField = (f) => {
    const n = f.name; const v = formData[n] ?? (f.type==='checkbox' ? false : '');
    if (f.type==='textarea') return (<Form.Group><Form.Label>{f.label}</Form.Label><Form.Control as="textarea" rows={f.rows||3} name={n} value={v} onChange={handleChange} required={!!f.required} /></Form.Group>);
    if (f.type==='select') return (<Form.Group><Form.Label>{f.label}</Form.Label><Form.Select name={n} value={v} onChange={handleChange} required={!!f.required}><option value="">اختر</option>{(f.options||[]).map(opt=> (<option key={String(opt.value||opt)} value={String(opt.value||opt)}>{String(opt.label||opt)}</option>))}</Form.Select></Form.Group>);
    if (f.type==='radio') return (<Form.Group><Form.Label>{f.label}</Form.Label><div className="d-flex gap-3">{(f.options||[]).map(opt=> (<Form.Check key={String(opt.value||opt)} inline type="radio" name={n} value={String(opt.value||opt)} label={String(opt.label||opt)} checked={String(v)===String(opt.value||opt)} onChange={handleChange} />))}</div></Form.Group>);
    if (f.type==='checkbox') return (<Form.Check type="checkbox" name={n} checked={!!v} onChange={handleChange} label={f.label} />);
    return (<Form.Group><Form.Label>{f.label}</Form.Label><Form.Control type={f.type||'text'} name={n} value={v} onChange={handleChange} required={!!f.required} /></Form.Group>);
  };

  return (
    <div className="survey-page">
      <div className="survey-hero">
        <SectionTitle title="استعلامات" subtitle="نسعد بتلقي أسئلتك واقتراحاتك وملاحظاتك" />
      </div>
      <Container className="py-4">
        <Row className="g-4">
          <Col lg={5}>
            <Card className="shadow-lg border-0 survey-card">
              <Card.Body>
                <h5 className="mb-3">اختر نوع الاستعلام</h5>
                <div className="survey-chips">
                  {categories.map((c) => (
                    <button
                      key={c.key}
                      className={`chip ${formData.category === c.key ? 'active' : ''}`}
                      onClick={() => setCategory(c.key)}
                    >
                      <i className={`${c.icon} me-2`}></i>
                      {c.title}
                    </button>
                  ))}
                </div>
                <hr />
                <div className="d-grid gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-phone text-success"></i>
                    <span className="fw-bold">+966 55 018 5599</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-envelope text-info"></i>
                    <span className="fw-bold">info@makkahyard.com</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-clock text-warning"></i>
                    <span className="fw-bold">السبت - الخميس: 6:00 ص - 11:00 م</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Row className="mt-4 g-3">
              {categories.slice(0, 4).map((c) => (
                <Col md={6} key={c.key}>
                  <Card className="feature-tile h-100 border-0 shadow-sm">
                    <Card.Body className="d-flex align-items-center gap-3">
                      <div className="tile-icon"><i className={`${c.icon}`}></i></div>
                      <div>
                        <div className="fw-bold">{c.title}</div>
                        <small className="text-muted">تفاصيل وأسئلة شائعة</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={7}>
            <Card className="shadow-lg border-0 survey-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">نموذج الاستعلام</h5>
                  <Badge bg="success">خدمة سريعة</Badge>
                </div>
                {error && (
                  <Alert variant="danger" className="mb-3">{error}</Alert>
                )}
                {isSubmitted && (
                  <Alert variant="success" className="mb-3">
                    تم استلام الاستعلام بنجاح، سنعاود الاتصال بك قريباً.
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    {dynamicForm && Array.isArray(dynamicForm.schema?.fields) ? dynamicForm.schema.fields.map((f)=> (
                      <Col md={f.col||12} key={String(f.name)}>
                        {renderField(f)}
                      </Col>
                    )) : (
                      <>
                        <Col md={6}>{renderField({ type:'text', name:'name', label:'الاسم الكامل', required:true })}</Col>
                        <Col md={3}>{renderField({ type:'number', name:'age', label:'العمر' })}</Col>
                        <Col md={3}>{renderField({ type:'select', name:'gender', label:'الجنس', options:[{value:'male',label:'ذكر'},{value:'female',label:'أنثى'}] })}</Col>
                        <Col md={6}>{renderField({ type:'text', name:'city', label:'المدينة' })}</Col>
                        <Col md={6}>{renderField({ type:'text', name:'phone', label:'رقم الجوال', required:true })}</Col>
                        <Col md={6}>{renderField({ type:'email', name:'email', label:'البريد الإلكتروني' })}</Col>
                        <Col md={12}>{renderField({ type:'text', name:'subject', label:'عنوان موجز', required:true })}</Col>
                        <Col md={12}>{renderField({ type:'radio', name:'rating', label:'درجة الأهمية', options:[5,4,3,2,1].map(r=>({value:String(r),label:String(r)})) })}</Col>
                        <Col md={12}>{renderField({ type:'textarea', name:'message', label:'نص الاستعلام', rows:5 })}</Col>
                      </>
                    )}
                    <Col md={12}>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button type="submit" variant="primary" size="lg">إرسال الاستعلام</Button>
                        <small className="text-muted">نستجيب عادة خلال 24 ساعة</small>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SurveyPage;
