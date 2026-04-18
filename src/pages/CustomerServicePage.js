import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Accordion } from 'react-bootstrap';
import SectionTitle from '../components/SectionTitle';
import '../styles/pages/CustomerServicePage.css';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const CustomerServicePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipNumber: '',
    inquiryType: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [showAlert, setShowAlert] = useState(false);

  const inquiryTypes = [
    'استفسار عام',
    'مشكلة في العضوية',
    'شكوى',
    'اقتراح',
    'مشكلة تقنية',
    'طلب إلغاء',
    'طلب استرداد',
    'تغيير معلومات العضوية'
  ];

  const faqData = [
    {
      question: 'كيف يمكنني تجديد عضويتي؟',
      answer: 'يمكنك تجديد عضويتك من خلال زيارة الاستقبال في الصالة أو التواصل معنا عبر الهاتف. كما يمكنك التجديد عبر الموقع الإلكتروني في قسم العضوية.'
    },
    {
      question: 'ما هي ساعات العمل؟',
      answer: 'نحن نعمل من السبت إلى الخميس من الساعة 6:00 صباحاً حتى 11:00 مساءً. يوم الجمعة من 2:00 ظهراً حتى 11:00 مساءً.'
    },
    {
      question: 'هل يمكنني تجميد عضويتي؟',
      answer: 'نعم، يمكنك تجميد عضويتك لمدة أقصاها شهرين في السنة الواحدة. يرجى التواصل مع خدمة العملاء قبل 48 ساعة على الأقل من تاريخ التجميد المطلوب.'
    },
    {
      question: 'كيف يمكنني حجز جلسة تدريب شخصي؟',
      answer: 'يمكنك حجز جلسة تدريب شخصي من خلال التطبيق، أو الاتصال بنا، أو زيارة الاستقبال. ننصح بالحجز المسبق لضمان توفر المدرب في الوقت المطلوب.'
    },
    {
      question: 'ما هي سياسة الإلغاء والاسترداد؟',
      answer: 'يمكن إلغاء العضوية خلال 7 أيام من تاريخ التسجيل مع استرداد كامل. بعد ذلك، يتم تطبيق رسوم إلغاء حسب نوع العضوية والمدة المتبقية.'
    },
    {
      question: 'هل تتوفر برامج للمبتدئين؟',
      answer: 'نعم، لدينا برامج مخصصة للمبتدئين تشمل التوجيه الأولي، وبرامج تدريبية مبسطة، وجلسات تعريفية مع المدربين.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitContactMessage({ name: formData.name, email: formData.email, phone: formData.phone, subject: formData.subject, message: formData.message });
      setShowAlert(true);
      setFormData({ name: '', email: '', phone: '', membershipNumber: '', inquiryType: '', subject: '', message: '', priority: 'medium' });
    } catch (err) {
      toast.error(err.message || 'تعذر إرسال الاستفسار');
    }
  };

  return (
    <div className="customer-service-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-4">خدمة العملاء</h1>
              <p className="lead">
                نحن هنا لمساعدتك! تواصل معنا لأي استفسار أو مساعدة تحتاجها
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Methods */}
      <section className="contact-methods py-5">
        <Container>
          <SectionTitle 
            title="طرق التواصل" 
            subtitle="اختر الطريقة الأنسب للتواصل معنا"
          />
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 contact-card text-center">
                <Card.Body>
                  <div className="contact-icon mb-3">
                    <i className="fas fa-phone fa-3x text-primary"></i>
                  </div>
                  <h5>الهاتف</h5>
                  <p className="mb-2">+966 55 018 5959</p>
                  <small className="text-muted">متاح 24/7</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 contact-card text-center">
                <Card.Body>
                  <div className="contact-icon mb-3">
                    <i className="fas fa-envelope fa-3x text-primary"></i>
                  </div>
                  <h5>البريد الإلكتروني</h5>
                  <p className="mb-2">info@makkahyard.com</p>
                  <small className="text-muted">رد خلال 24 ساعة</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 contact-card text-center">
                <Card.Body>
                  <div className="contact-icon mb-3">
                    <i className="fab fa-whatsapp fa-3x text-success"></i>
                  </div>
                  <h5>واتساب</h5>
                  <p className="mb-2">+966 55 018 5959</p>
                  <small className="text-muted">رد فوري</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 contact-card text-center">
                <Card.Body>
                  <div className="contact-icon mb-3">
                    <i className="fas fa-map-marker-alt fa-3x text-primary"></i>
                  </div>
                  <h5>زيارة شخصية</h5>
                  <p className="mb-2">مكة المكرمة</p>
                  <small className="text-muted">السبت - الخميس</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="contact-form bg-light py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">نموذج الاستفسار</h4>
                </Card.Header>
                <Card.Body>
                  {showAlert && (
                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                      تم إرسال استفسارك بنجاح! سنتواصل معك في أقرب وقت ممكن.
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
                            onChange={handleInputChange}
                            required
                            placeholder="أدخل اسمك الكامل"
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
                            onChange={handleInputChange}
                            required
                            placeholder="example@email.com"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>رقم الهاتف *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="05xxxxxxxx"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>رقم العضوية</Form.Label>
                          <Form.Control
                            type="text"
                            name="membershipNumber"
                            value={formData.membershipNumber}
                            onChange={handleInputChange}
                            placeholder="رقم العضوية (إن وجد)"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>نوع الاستفسار *</Form.Label>
                          <Form.Select
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر نوع الاستفسار</option>
                            {inquiryTypes.map((type, index) => (
                              <option key={index} value={type}>{type}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>الأولوية</Form.Label>
                          <Form.Select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                          >
                            <option value="low">منخفضة</option>
                            <option value="medium">متوسطة</option>
                            <option value="high">عالية</option>
                            <option value="urgent">عاجلة</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>موضوع الاستفسار *</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="عنوان مختصر للاستفسار"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>تفاصيل الاستفسار *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="اكتب تفاصيل استفسارك هنا..."
                      />
                    </Form.Group>

                    <div className="text-center">
                      <Button type="submit" variant="primary" size="lg">
                        إرسال الاستفسار
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-5">
        <Container>
          <SectionTitle 
            title="الأسئلة الشائعة" 
            subtitle="إجابات على أكثر الأسئلة شيوعاً"
          />
          <Row className="justify-content-center">
            <Col lg={10}>
              <Accordion>
                {faqData.map((faq, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>{faq.question}</Accordion.Header>
                    <Accordion.Body>{faq.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Service Hours */}
      <section className="service-hours bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h3 className="mb-4">ساعات خدمة العملاء</h3>
              <Row>
                <Col md={4} className="mb-3">
                  <h5>الهاتف والواتساب</h5>
                  <p>متاح 24 ساعة / 7 أيام</p>
                </Col>
                <Col md={4} className="mb-3">
                  <h5>البريد الإلكتروني</h5>
                  <p>رد خلال 24 ساعة</p>
                </Col>
                <Col md={4} className="mb-3">
                  <h5>الزيارة الشخصية</h5>
                  <p>السبت - الخميس: 6 ص - 11 م<br />الجمعة: 2 ظ - 11 م</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default CustomerServicePage;
