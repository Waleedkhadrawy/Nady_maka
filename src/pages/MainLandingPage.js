import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../styles/pages/MainLandingPage.css';

const MainLandingPage = () => {
  return (
    <div className="main-landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} md={12} className="hero-content">
              <div className="hero-text">
                <div className="hero-badge">
                  <span>فعاليات حصرية للأعضاء</span>
                </div>
                <h1 className="hero-title">
                  فرص للتواصل ومسابقات
                  <span className="highlight"> ممتعة</span>
                </h1>
                <p className="hero-description">
                  استمتع بفعاليات متنوعة تجمع بين الرياضة والتواصل والمسابقات المثيرة في بيئة عائلية آمنة ومحفزة
                </p>
                <p className="hero-subdescription">
                  شارك في مسابقات متنوعة وتواصل مع أفراد يحبون الرياضة في جو حماسي في مجتمعنا
                </p>
              </div>
            </Col>
            <Col lg={12} md={12} className="hero-services">
              <div className="services-section">
                <h2 className="services-title">خدماتنا</h2>
                <p className="services-subtitle">نقدم مجموعة متنوعة من الخدمات الرياضية والترفيهية</p>
                <div className="services-grid-new">
                  <div className="service-card-new">
                    <div className="service-icon-new">
                      <i className="fas fa-clock"></i>
                    </div>
                    <h3>الحجز</h3>
                    <p>احجز موعدك بسهولة</p>
                  </div>
                  <div className="service-card-new">
                    <div className="service-icon-new">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <h3>الفعاليات</h3>
                    <p>شارك في الأنشطة المتنوعة</p>
                  </div>
                  <div className="service-card-new">
                    <div className="service-icon-new">
                      <i className="fas fa-users"></i>
                    </div>
                    <h3>العضوية</h3>
                    <p>انضم لمجتمعنا الرياضي</p>
                  </div>
                  <div className="service-card-new">
                    <div className="service-icon-new">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <h3>اتصل بنا</h3>
                    <p>تواصل معنا في أي وقت</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>



      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2>ابدأ رحلتك معنا اليوم</h2>
              <p>انضم إلى مجتمع مكة يارد واستمتع بتجربة رياضية فريدة</p>
              <div className="cta-buttons">
                <Button className="btn-primary me-3">سجل الآن</Button>
                <Button className="btn-outline">تواصل معنا</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default MainLandingPage;