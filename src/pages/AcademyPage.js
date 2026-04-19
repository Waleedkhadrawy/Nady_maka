import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/pages/AcademyPage.css';

const AcademyPage = () => {
  return (
    <div className="academy-page app-main pt-5 pb-5">
      <Container>
        <div className="section-title-wrapper reveal-up mb-5 text-center mt-4">
          <div className="section-badge border border-primary text-primary">
            <i className="bi bi-mortarboard-fill"></i> أكاديميات مكة يارد
          </div>
          <h2>جداول وبرامج الأكاديميات الرياضية</h2>
          <p className="lead mx-auto text-muted" style={{ maxWidth: 600 }}>
            اكتشف برامج الأكاديميات المخصصة للياقة البدنية والمصممة لتطوير مهارات المتدربين من كافة الأعمار ضمن بيئة رياضية احترافية.
          </p>
        </div>

        <Row className="justify-content-center reveal-up" style={{ animationDelay: '0.1s' }}>
          <Col lg={10} md={12}>
            <Card className="glass-panel border-0 hover-lift overflow-hidden">
              <img
                src={`${process.env.PUBLIC_URL}/images/acadmy.PNG`}
                alt="جداول أكاديميات مكة يارد"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderBottom: '4px solid var(--primary)'
                }}
              />
              <Card.Body className="p-4 text-center">
                <p className="mb-0 text-muted">
                  <i className="bi bi-info-circle me-2 text-primary"></i>
                  لمزيد من التفاصيل حول مواعيد التسجيل، يرجى التواصل مع إدارة الأكاديمية أو زيارة قسم خدمة العملاء في النادي.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AcademyPage;