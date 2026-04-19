import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import SectionTitle from '../components/SectionTitle';
import '../styles/pages/BookingPage.css';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const services = [
    'مقابلة',
    'استشارة تدريبية',
    'تقييم اللياقة البدنية',
    'جلسة تدريب شخصي',
    'استشارة تغذية',
    'برنامج تدريبي مخصص'
  ];

  const timeSlots = [
    { label: '05:00 مساءً', value: '17:00:00' },
    { label: '05:30 مساءً', value: '17:30:00' },
    { label: '06:00 مساءً', value: '18:00:00' },
    { label: '06:30 مساءً', value: '18:30:00' },
    { label: '07:00 مساءً', value: '19:00:00' },
    { label: '07:30 مساءً', value: '19:30:00' },
    { label: '08:00 مساءً', value: '20:00:00' },
    { label: '08:30 مساءً', value: '20:30:00' },
    { label: '09:00 مساءً', value: '21:00:00' },
    { label: '09:30 مساءً', value: '21:30:00' },
    { label: '10:00 مساءً', value: '22:00:00' }
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
    console.log('Submitting booking form:', formData);
    

    try {
      console.log('Calling api.createBooking...');
      const response = await api.createBooking({ 
        name: formData.name, 
        phone: formData.phone, 
        email: formData.email, 
        service: formData.service, 
        date: formData.date, 
        time: formData.time, 
        notes: formData.notes 
      });
      console.log('Booking created successfully:', response);
      setShowAlert(true);
      setFormData({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' });
      toast.success('تم إرسال طلب الحجز بنجاح');
    } catch (err) {
      console.error('Booking submission error:', err);
      toast.error(err.message || 'تعذر إرسال طلب الحجز');
    }
  };

  return (
    <div className="booking-page">
      {/* Booking Form Section */}
      <section className="booking-form-section py-5">
        <Container>
          <Row className="justify-content-center">
            {/* Form Column */}
            <Col lg={8}>
              {showAlert && (
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                  تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الموعد.
                </Alert>
              )}
              
              <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">نموذج حجز الموعد</h4>
                  <small className="d-block mt-2">1) اختر الخدمة  2) حدد التاريخ والوقت  3) أكمل بياناتك ثم أرسل الطلب</small>
                </Card.Header>
                <Card.Body>
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
                          <Form.Label>رقم الهاتف *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="05xxxxxxxx"
                            pattern="05\d{8}"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

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

                    <Form.Group className="mb-3">
                      <Form.Label>نوع الخدمة *</Form.Label>
                      <Form.Select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">اختر نوع الخدمة</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>التاريخ المفضل *</Form.Label>
                          <Form.Control
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>الوقت المفضل *</Form.Label>
                          <Form.Select
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر الوقت</option>
                            {timeSlots.map((slot, index) => (
                              <option key={index} value={slot.value}>{slot.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label>ملاحظات إضافية</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="أي ملاحظات أو متطلبات خاصة"
                      />
                    </Form.Group>

                    <div className="text-center">
                      <Button type="submit" variant="primary" size="lg">
                        احجز الموعد
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section bg-light py-5">
        <Container>
          <SectionTitle 
            title="معلومات التواصل" 
            subtitle="يمكنك التواصل معنا مباشرة"
          />
          <Row className="text-center">
            <Col lg={4} md={6} className="mb-4">
              <div className="contact-item">
                <div className="contact-icon mb-3">
                  <i className="fas fa-phone fa-3x text-primary"></i>
                </div>
                <h5>الهاتف</h5>
                <p>+966 55 018 5959</p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="contact-item">
                <div className="contact-icon mb-3">
                  <i className="fas fa-envelope fa-3x text-primary"></i>
                </div>
                <h5>البريد الإلكتروني</h5>
                <p>info@makkahyard.com</p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="contact-item">
                <div className="contact-icon mb-3">
                  <i className="fas fa-clock fa-3x text-primary"></i>
                </div>
                <h5>ساعات العمل</h5>
                <p>السبت - الخميس: 6:00 ص - 11:00 م</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default BookingPage;
