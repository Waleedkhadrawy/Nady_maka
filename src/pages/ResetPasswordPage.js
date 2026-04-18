import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import '../styles/pages/LoginPage.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="login-page">
      <section className="login-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/video-thumb.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <h1 className="login-title">إعادة تعيين كلمة المرور</h1>
              <p className="login-subtitle">أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين</p>
            </Col>
          </Row>
        </Container>
      </section>
      <Container>
        <Row className="justify-content-center align-items-center py-5">
          <Col md={6} lg={4}>
            <Card className="shadow">
              <Card.Body className="p-4">
                {submitted && (
                  <Alert variant="success">تم إرسال الرابط إن وجد حساب مطابق.</Alert>
                )}
                <Form onSubmit={submit}>
                  <Form.Group className="mb-3">
                    <Form.Label>البريد الإلكتروني</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="example@mail.com" />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100">إرسال</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
