import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/pages/AcademyPage.css';

const AcademyPage = () => {
  return (
    <div className="academy-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={12}>
              <h1 className="hero-title">جداول أكاديميات مكة يارد للياقة البدنية</h1>
            </Col>
          </Row>
        </Container>
  </section>

      {/* Academy Banner Image */}
      <section className="academy-banner py-4">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} md={12}>
              <img
                src={`${process.env.PUBLIC_URL}/images/acadmy.PNG`}
                alt="صورة الأكاديميات"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Removed tables per request: تظهر فقط الصورة مع العنوان */}
    </div>
  );
};

export default AcademyPage;