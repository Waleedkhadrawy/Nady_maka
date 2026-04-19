import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/pages/HomePage.css';

const heroVideo = `${process.env.PUBLIC_URL}/videos/1.mp4`;

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-premium">
        <div className="hero-video-wrap">
          <video autoPlay muted loop playsInline preload="metadata">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay-gradient"></div>
        </div>
        
        <Container className="hero-content reveal-up">
          <div className="section-badge bg-dark text-white mx-auto border border-secondary mb-4">
            <i className="bi bi-star-fill text-warning"></i> 
            <span>النادي الرياضي الأفخم في السعودية</span>
          </div>
          <h1 className="hero-title">
            أهلاً وسهلاً بك في <span className="text-primary d-inline-block">نادي مكة يارد</span>
          </h1>
          <p className="hero-subtitle">
            اكتشف إمكانياتك وحقق أهدافك الرياضية والصحية في بيئة تدريبية احترافية، مجهزة بأحدث التقنيات والمدربين المعتمدين لتجربة لا مثيل لها.
          </p>
          <div className="hero-actions mt-4">
            <Link to="/membership" className="btn-premium px-4 py-3 fs-5">
              انضم إلينا الآن <i className="bi bi-arrow-left mt-1"></i>
            </Link>
            <Link to="/booking" className="btn-outline-premium bg-dark text-white border-white px-4 py-3 fs-5" style={{ '--primary-dark': 'white' }}>
              احجز موعد <i className="bi bi-calendar-check mt-1"></i>
            </Link>
          </div>
        </Container>
      </section>
      
      {/* Services Grid */}
      <section className="home-services section-padding">
        <Container>
          <div className="section-title-wrapper reveal-up">
            <div className="section-badge">
              <i className="bi bi-lightning-charge-fill"></i> اشعر بالفرق
            </div>
            <h2>خدماتنا المتكاملة</h2>
            <p className="lead mx-auto" style={{ maxWidth: 700 }}>
              أطلق إمكاناتك مع برامج التمارين الجماعية والتدريب الشخصي! انضم إلى عائلتنا الرياضية لتحقيق أفضل النتائج.
            </p>
          </div>
          
          <Row className="g-4">
            {/* Feature 1 */}
            <Col lg={4} md={6}>
              <Link to="/academy" className="feature-card reveal-up" style={{ animationDelay: '0.1s' }}>
                <div className="feature-icon"><i className="bi bi-mortarboard-fill"></i></div>
                <h3>الأكاديميات</h3>
                <p>برامج تدريبية متخصصة لجميع الأعمار لتطوير المهارات الرياضية بأسس علمية صحيحة.</p>
              </Link>
            </Col>
            {/* Feature 2 */}
            <Col lg={4} md={6}>
              <Link to="/booking" className="feature-card reveal-up" style={{ animationDelay: '0.2s' }}>
                <div className="feature-icon"><i className="bi bi-calendar2-check-fill"></i></div>
                <h3>حجز المواعيد</h3>
                <p>نظام إلكتروني سهل وسريع يتيح لك تنظيم أوقات تمرينك وجلساتك مع المدربين الشخصيين.</p>
              </Link>
            </Col>
            {/* Feature 3 */}
            <Col lg={4} md={6}>
              <Link to="/membership" className="feature-card reveal-up" style={{ animationDelay: '0.3s' }}>
                <div className="feature-icon"><i className="bi bi-person-vcard-fill"></i></div>
                <h3>الاشتراكات</h3>
                <p>باقات عضوية مرنة ومدروسة لتناسب مختلف الاحتياجات بأسعار تنافسية ومزايا حصرية.</p>
              </Link>
            </Col>
            {/* Feature 4 */}
            <Col lg={4} md={6}>
              <Link to="/pricing" className="feature-card reveal-up" style={{ animationDelay: '0.4s' }}>
                <div className="feature-icon"><i className="bi bi-tags-fill"></i></div>
                <h3>الأسعار والعروض</h3>
                <p>اطلع على جميع تفاصيل الباقات والبرامج المتاحة حالياً لنادي مكة يارد.</p>
              </Link>
            </Col>
            {/* Feature 5 */}
            <Col lg={4} md={6}>
              <Link to="/trainer-evaluation" className="feature-card reveal-up" style={{ animationDelay: '0.5s' }}>
                <div className="feature-icon"><i className="bi bi-star-fill"></i></div>
                <h3>تقييم المدربين</h3>
                <p>ساهم في رفع جودة الخدمات بتزويدنا برأيك وتجربتك المهنية مع طاقم التدريب.</p>
              </Link>
            </Col>
            {/* Feature 6 */}
            <Col lg={4} md={6}>
              <Link to="/contact" className="feature-card reveal-up" style={{ animationDelay: '0.6s' }}>
                <div className="feature-icon"><i className="bi bi-chat-right-text-fill"></i></div>
                <h3>تواصل معنا</h3>
                <p>فريق الدعم متاح للإجابة على استفساراتك وتقديم المساعدة في أي وقت.</p>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Band */}
      <section className="stats-band">
        <Container>
          <Row className="g-4 text-center">
            <Col md={4} className="stat-box">
              <div className="stat-number">20+</div>
              <div className="stat-label">برنامج رياضي</div>
              <div className="stat-desc">متنوع ومصمم باحترافية</div>
            </Col>
            <Col md={4} className="stat-box">
              <div className="stat-number">20k</div>
              <div className="stat-label">حصة شهرية</div>
              <div className="stat-desc">مجدولة ومنتظمة للأعضاء</div>
            </Col>
            <Col md={4} className="stat-box">
              <div className="stat-number">24/7</div>
              <div className="stat-label">مرافق متاحة</div>
              <div className="stat-desc">أجهزة حديثة تعمل في بيئة نظيفة</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Media Gallery / Featured Showcases */}
      <section className="section-padding bg-main">
        <Container>
          <div className="section-title-wrapper">
            <div className="section-badge border border-primary">
              <i className="bi bi-camera-fill"></i> معرض مكة يارد
            </div>
            <h2>مرافق وتجهيزات خمس نجوم 🏆</h2>
            <p className="lead mx-auto" style={{ maxWidth: 700 }}>
              استكشف أحدث المرافق الرياضية والتجهيزات العالمية التي نوفرها لأعضائنا الكرام بالأسفل.
            </p>
          </div>
          
          <Row className="g-4">
            <Col lg={6} md={12}>
              <div className="media-card hover-lift">
                <img src="https://makkahyard.com/wp-content/uploads/2024/12/6.jpeg" alt="Olympic Pool" />
                <div className="media-icon-top"><i className="bi bi-water"></i></div>
                <div className="media-overlay">
                  <span className="badge-premium mb-2">مرفق مميز</span>
                  <h4>مسبح مكة يارد المتطور</h4>
                  <p><i className="bi bi-check-circle-fill text-primary"></i> مساحة تدريب واسعة مع أنظمة تعقيم متقدمة وتدريب متخصص.</p>
                </div>
              </div>
            </Col>

            <Col lg={6} md={12}>
              <div className="media-card hover-lift">
                <img src="https://makkahyard.com/wp-content/uploads/2024/12/5.jpeg" alt="Gym Area" />
                <div className="media-icon-top"><i className="bi bi-usb-drive-fill"></i></div>
                <div className="media-overlay">
                  <span className="badge-premium mb-2">منطقة الآلات</span>
                  <h4>صالة الأجهزة المتكاملة</h4>
                  <p><i className="bi bi-check-circle-fill text-primary"></i> أجهزة عالمية، مساحات مدروسة، وتهوية ممتازة.</p>
                </div>
              </div>
            </Col>
            
            <Col lg={6} md={12}>
              <div className="media-card hover-lift">
                <img src="https://makkahyard.com/wp-content/uploads/2024/12/4.jpeg" alt="Personal Training" />
                <div className="media-icon-top"><i className="bi bi-person-vcard"></i></div>
                <div className="media-overlay">
                  <span className="badge-premium mb-2">تدريب شخصي</span>
                  <h4>منطقة التدريب الخاص</h4>
                  <p><i className="bi bi-check-circle-fill text-primary"></i> جلسات 1on1 مع خبراء مرخصين لتحقيق أهدافك الخاصة.</p>
                </div>
              </div>
            </Col>
            
            <Col lg={6} md={12}>
              <div className="media-card hover-lift">
                <img src="https://makkahyard.com/wp-content/uploads/2024/12/2.jpeg" alt="Smart Tech" />
                <div className="media-icon-top"><i className="bi bi-smartwatch"></i></div>
                <div className="media-overlay">
                  <span className="badge-premium mb-2">تكنولوجيا حديثة</span>
                  <h4>معدات اللياقة الذكية</h4>
                  <p><i className="bi bi-check-circle-fill text-primary"></i> أجهزة تتبع الآداء متزامنة مع الهواتف الذكية والساعات.</p>
                </div>
              </div>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <Link to="/membership" className="btn-premium px-5 py-3 fs-5">
              ابدأ رحلتك الآن
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;