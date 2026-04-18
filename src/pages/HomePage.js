import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../styles/pages/HomePage.css';
import '../styles/components/ServicesSection.css';
import '../styles/components/TutorialVideos.css';
import '../styles/components/FeaturedVideo.css';
import '../styles/components/GallerySection.css';
import '../styles/components/AttractiveImageSection.css';
import '../styles/components/MainContentSection.css';
import '../styles/components/FitnessTimeStyle.css';

// Videos placeholders (avoid external blocked URLs)
const heroVideo = `${process.env.PUBLIC_URL}/videos/1.mp4`; // مسار آمن بالنسبة للجذر

const HomePage = () => {
  return (
    <div className="home-page fitness-time-style">
      {/* Hero Section - Fitness Time Style */}
      <section className="hero-section-ft">
        <div className="hero-video-container">
          <video autoPlay muted loop playsInline preload="metadata" className="hero-video">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>
        <Container>
          <div className="hero-content">
            <h1 className="hero-title">أهلاً وسهلاً بك في نادي مكه يارد الرياضي!</h1>
            <p className="hero-subtitle">النادي الصحي والرياضي الأول والأفخم في السعوديه</p>
            <div className="hero-buttons">
              <Button as={Link} to="/membership" className="btn-join-now">
                انضم الآن
              </Button>
              <Button as={Link} to="/booking" variant="outline-light" className="btn-book-appointment">
                احجز موعد
              </Button>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Main Services Section - Fitness Time Style */}
      <section className="main-services-section-ft">
        <Container>
          <div className="services-header-ft">
            <h2 className="services-title-ft">اشعر بالفرق!</h2>
            <p className="services-subtitle-ft">
              أطلق إمكاناتك مع دروس التمارين الجماعية المثيرة! انضم إلى المتحمسين ذوي التفكير المماثل، 
              مدفوعين بالصداقة الحماسية ويقودهم أساتذة اللياقة البدنية المعتمدون.
            </p>
          </div>
          
          <div className="main-services-grid-ft">
            <div className="service-card-ft" onClick={() => window.location.href='/academies'}>
              <div className="service-icon-ft">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>الأكاديميات</h3>
              <p>برامج تدريبية متخصصة لجميع الأعمار</p>
            </div>
            
            <div className="service-card-ft" onClick={() => window.location.href='/booking'}>
              <div className="service-icon-ft">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>حجز موعد</h3>
              <p>احجز جلستك التدريبية بسهولة</p>
            </div>
            
            <div className="service-card-ft" onClick={() => window.location.href='/membership'}>
              <div className="service-icon-ft">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3>الانضمام للعضوية</h3>
              <p>انضم إلى عائلة مكة يارد الرياضية</p>
            </div>
            
            <div className="service-card-ft" onClick={() => window.location.href='/pricing'}>
              <div className="service-icon-ft">
                <i className="fas fa-tags"></i>
              </div>
              <h3>الأسعار</h3>
              <p>باقات متنوعة تناسب جميع الاحتياجات</p>
            </div>
            
            <div className="service-card-ft" onClick={() => window.location.href='/login'}>
              <div className="service-icon-ft">
                <i className="fas fa-sign-in-alt"></i>
              </div>
              <h3>تسجيل الدخول</h3>
              <p>ادخل إلى حسابك الشخصي</p>
            </div>
            
            <div className="service-card-ft" onClick={() => window.location.href='/trainer-evaluation'}>
              <div className="service-icon-ft">
                <i className="fas fa-star"></i>
              </div>
              <h3>تقييم المدرب</h3>
              <p>قيم تجربتك مع مدربينا المحترفين</p>
            </div>
          </div>
          
          <div className="stats-section-ft">
            <div className="stat-item-ft">
              <div className="stat-number-ft">20+</div>
              <div className="stat-label-ft">برنامج</div>
              <div className="stat-desc-ft">عبر نوادي مكة يارد</div>
            </div>
            <div className="stat-item-ft">
              <div className="stat-number-ft">20,000+</div>
              <div className="stat-label-ft">حصة</div>
              <div className="stat-desc-ft">مجدولة شهرياً</div>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Featured Videos Section - Fitness Time Style */}
      <section className="featured-videos-section-ft">
        <Container>
          <div className="videos-header-ft">
            <h2 className="videos-title-ft">مرافق 5 نجوم</h2>
            <p className="videos-subtitle-ft">اكتشف مرافقنا المتطورة وتجربة مكة يارد الفريدة</p>
          </div>
          
          <Row className="videos-grid-ft">
            <Col lg={4} md={6} className="mb-4">
              <div className="video-card-ft">
                <div className="video-container-ft">
                  <video controls className="video-player-ft">
                    <source src={heroVideo} type="video/mp4" />
                  </video>
                  <div className="video-overlay-ft">
                    <i className="fas fa-play-circle"></i>
                  </div>
                </div>
                <div className="video-info-ft">
                  <h4>الفيديو الرئيسي</h4>
                  <p>جولة شاملة في مرافق مكة يارد</p>
                </div>
              </div>
            </Col>
            
            <Col lg={4} md={6} className="mb-4">
              <div className="video-card-ft">
                <div className="video-container-ft">
                  <video controls className="video-player-ft" poster="/images/video-thumb.svg">
                    {/* مصدر الفيديو سيضاف لاحقًا */}
                  </video>
                  <div className="video-overlay-ft">
                    <i className="fas fa-play-circle"></i>
                  </div>
                </div>
                <div className="video-info-ft">
                  <h4>فيديو النادي كامل</h4>
                  <p>استكشف جميع أقسام النادي ومرافقه</p>
                </div>
              </div>
            </Col>
            
            <Col lg={4} md={6} className="mb-4">
              <div className="video-card-ft">
                <div className="video-container-ft">
                  <video controls className="video-player-ft" poster="/images/video-thumb.svg">
                    {/* مصدر الفيديو سيضاف لاحقًا */}
                  </video>
                  <div className="video-overlay-ft">
                    <i className="fas fa-play-circle"></i>
                  </div>
                </div>
                <div className="video-info-ft">
                  <h4>فيديو بصوت لمكة كامل</h4>
                  <p>تعرف على قصة مكة يارد وأهدافها</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Facilities Showcase Section */}
      <section className="facilities-showcase-ft">
        <Container>
          <div className="facilities-content">
            <div className="facility-image">
              <img 
                src="/images/fitness.svg" 
                alt="مرافق مكة يارد المتطورة" 
                className="facility-main-image"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <h3>فرص للتواصل ومسابقات ممتعة</h3>
                  <p>انضم إلينا واستمتع بتجربة فريدة ومميزة</p>
                  <button className="cta-button">
                    <i className="fas fa-arrow-left"></i>
                    اكتشف المزيد
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Premium Gallery Section */}
      <section className="section premium-gallery-section">
        <Container>
          <div className="gallery-header text-center mb-5">
            <div className="section-badge mx-auto mb-3">
              <i className="fas fa-camera"></i>
              <span>معرض مكة يارد</span>
            </div>
            <h2 className="gallery-title">
              🏆 <span className="highlight">مرافقنا المتميزة</span> في صور 🏆
            </h2>
            <p className="gallery-subtitle">
              استكشف أحدث المرافق الرياضية والتجهيزات العالمية التي نوفرها لأعضائنا الكرام
            </p>
          </div>
          
          <Row className="premium-gallery-grid">
            <Col lg={6} md={6} className="mb-4">
              <div className="premium-gallery-item main-feature">
                <div className="image-container">
                  <img 
                    src="https://makkahyard.com/wp-content/uploads/2024/12/6.jpeg" 
                    alt="حمام السباحة المتطور" 
                    className="img-fluid"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <div className="feature-badge">
                        <i className="fas fa-swimming-pool"></i>
                        <span>مرفق مميز</span>
                      </div>
                      <h3>حمام السباحة المتطور</h3>
                      <p>حمام سباحة أولمبي بأحدث أنظمة التنقية والتدفئة</p>
                      <div className="feature-stats">
                        <span><i className="fas fa-thermometer-half"></i> تدفئة ذكية</span>
                        <span><i className="fas fa-shield-alt"></i> أمان عالي</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={6} md={6} className="mb-4">
              <div className="premium-gallery-item">
                <div className="image-container">
                  <img 
                    src="https://makkahyard.com/wp-content/uploads/2024/12/5.jpeg" 
                    alt="صالة الألعاب الرياضية" 
                    className="img-fluid"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <div className="feature-badge">
                        <i className="fas fa-dumbbell"></i>
                        <span>تجهيزات حديثة</span>
                      </div>
                      <h3>صالة الألعاب المتكاملة</h3>
                      <p>أجهزة رياضية عالمية وبرامج تدريبية متخصصة</p>
                      <div className="feature-stats">
                        <span><i className="fas fa-clock"></i> 24/7</span>
                        <span><i className="fas fa-users"></i> مدربين محترفين</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={6} md={6} className="mb-4">
              <div className="premium-gallery-item">
                <div className="image-container">
                  <img 
                    src="https://makkahyard.com/wp-content/uploads/2024/12/4.jpeg" 
                    alt="منطقة التدريب الشخصي" 
                    className="img-fluid"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <div className="feature-badge">
                        <i className="fas fa-user-tie"></i>
                        <span>تدريب شخصي</span>
                      </div>
                      <h3>منطقة التدريب الخاص</h3>
                      <p>جلسات تدريبية مخصصة مع أفضل المدربين</p>
                      <div className="feature-stats">
                        <span><i className="fas fa-medal"></i> برامج مخصصة</span>
                        <span><i className="fas fa-chart-line"></i> متابعة دقيقة</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={6} md={6} className="mb-4">
              <div className="premium-gallery-item">
                <div className="image-container">
                  <img 
                    src="https://makkahyard.com/wp-content/uploads/2024/12/2.jpeg" 
                    alt="معدات اللياقة المتقدمة" 
                    className="img-fluid"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <div className="feature-badge">
                        <i className="fas fa-cogs"></i>
                        <span>تقنية متقدمة</span>
                      </div>
                      <h3>معدات اللياقة الذكية</h3>
                      <p>أحدث الأجهزة الرياضية بتقنيات ذكية متطورة</p>
                      <div className="feature-stats">
                        <span><i className="fas fa-wifi"></i> اتصال ذكي</span>
                        <span><i className="fas fa-mobile-alt"></i> تطبيق متكامل</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="gallery-cta text-center mt-5">
            <div className="cta-content">
              <h3>🌟 جاهز لتجربة التميز؟ 🌟</h3>
              <p>انضم إلى مجتمع مكة يارد واستمتع بأفضل المرافق الرياضية في المنطقة</p>
              <div className="cta-buttons">
                <Button as={Link} to="/membership" className="btn-premium me-3">
                  <i className="fas fa-crown"></i>
                  اشترك الآن
                </Button>
                <Button as={Link} to="/gallery" variant="outline-primary" className="btn-gallery">
                  <i className="fas fa-images"></i>
                  شاهد المزيد
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;