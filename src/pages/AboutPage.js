import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/pages/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page app-main pt-5">
      <Container>
        {/* Header Title */}
        <div className="section-title-wrapper reveal-up mb-5 text-center mt-4">
          <div className="section-badge border border-primary text-primary">
            <i className="bi bi-info-circle-fill"></i> عن نادي مكة يارد
          </div>
          <h2>تجربة رياضية استثنائية</h2>
          <p className="lead mx-auto" style={{ maxWidth: 800 }}>
            يقع مكة يارد على بُعد 10 دقائق جنوب المسجد الحرام على الطريق الدائري الرابع، ويطل على أشهر شوارع مكة المكرمة، صُمم على مساحة 30 ألف متر مربع ليقدم تجربة رياضية متكاملة.
          </p>
        </div>

        {/* Facilities Section */}
        <Row className="g-4 mb-5 reveal-up" style={{ animationDelay: '0.1s' }}>
          {[
            { icon: 'bi-building', title: 'صالات رياضية متطورة', desc: 'مباني منفصلة للرجال والنساء مجهزة بأحدث المعدات الرياضية.' },
            { icon: 'bi-water', title: 'مسابح داخلية', desc: 'مسابح مغطاة ومجهزة بأعلى معايير السلامة والنظافة.' },
            { icon: 'bi-briefcase', title: 'مركز أعمال', desc: 'مركز أعمال متكامل لخدمة رجال الأعمال والمهنيين.' },
            { icon: 'bi-mic', title: 'قاعة مؤتمرات', desc: 'قاعة فاخرة تتسع لـ 500 شخص لاستضافة المؤتمرات والفعاليات.' },
            { icon: 'bi-p-circle', title: 'مواقف سيارات كبرى', desc: 'جراج تحت المبنى الرئيسي يتسع لـ 300 سيارة.' },
            { icon: 'bi-controller', title: 'أكاديميات للأطفال', desc: 'أكاديميات رياضية متنوعة ومركز رعاية للأطفال تحت سن السادسة.' },
          ].map((item, idx) => (
            <Col lg={4} md={6} key={idx}>
              <Card className="h-100 feature-card glass-panel text-center hover-lift border-0">
                <Card.Body className="p-4">
                  <div className="feature-icon bg-light text-primary mx-auto mb-3" style={{ width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    <i className={item.icon}></i>
                  </div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Big Info Block */}
        <Card className="glass-panel border-0 hover-lift mb-5 reveal-up" style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, var(--bg-dark), #1e293b)', color: 'white' }}>
          <Card.Body className="p-4 p-lg-5">
            <Row className="align-items-center">
              <Col lg={8}>
                <h3 className="text-primary mb-3">عضوية عائلية شاملة للمجتمع</h3>
                <p className="mb-4" style={{ color: '#cbd5e1' }}>
                  مساحات خضراء، منطقة البوليفارد ومقاهي ومطاعم تطل عليها... كل هذا وأكثر باشتراك عائلي واحد يشمل جميع أفراد العائلة. نحن في مكة يارد نطمح لتكوين مجتمع متكامل ليكون النادي بمثابة بيتك الثاني.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/membership" className="btn btn-premium px-4">
                    انضم إلينا الآن <i className="bi bi-arrow-left mt-1 ms-1"></i>
                  </Link>
                  <Link to="/pricing" className="btn btn-outline-light px-4" style={{ borderRadius: '12px' }}>
                    استعراض الباقات
                  </Link>
                </div>
              </Col>
              <Col lg={4} className="text-center mt-4 mt-lg-0">
                <i className="bi bi-shield-check text-primary" style={{ fontSize: '8rem', opacity: 0.1 }}></i>
              </Col>
            </Row>
          </Card.Body>
        </Card>

      </Container>
    </div>
  );
};

export default AboutPage;