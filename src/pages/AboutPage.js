import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/pages/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <h1 className="hero-title">مرحباً بكم في مكة يارد - وجهتكم الرياضية المتميزة</h1>
              <p className="hero-subtitle">تجربة رياضية فريدة ومتكاملة في قلب مكة المكرمة</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Content */}
      <section className="about-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="content-block">
                <h2>نادي مكة يارد - تجربة رياضية استثنائية</h2>
                <p className="lead">
                  يقع مكة يارد على بُعد 10 دقائق جنوب المسجد الحرام على الطريق الدائري الرابع، ويطل على أشهر شوارع مكة المكرمة، شارع إبراهيم الخليل.
                </p>
                <p>
                  صُمم مكة يارد على مساحة 30 ألف متر مربع، ويضم صالات رياضية في مباني منفصلة للجنسين (مبنى الرجال - مبنى النساء) ومسابح داخلية مغطاة.
                </p>
              </div>

              <div className="content-block">
                <h3>مرافق وخدمات متكاملة</h3>
                <div className="facilities-grid">
                  <div className="facility-item">
                    <h4>🏋️‍♂️ صالات رياضية متطورة</h4>
                    <p>مباني منفصلة للرجال والنساء مجهزة بأحدث المعدات الرياضية</p>
                  </div>
                  <div className="facility-item">
                    <h4>🏊‍♀️ مسابح داخلية</h4>
                    <p>مسابح مغطاة ومجهزة بأعلى معايير السلامة والنظافة</p>
                  </div>
                  <div className="facility-item">
                    <h4>🏢 مركز أعمال</h4>
                    <p>مركز أعمال متكامل لخدمة رجال الأعمال والمهنيين</p>
                  </div>
                  <div className="facility-item">
                    <h4>🎪 قاعة المؤتمرات والفعاليات</h4>
                    <p>قاعة فاخرة تتسع لـ 500 شخص لاستضافة المؤتمرات والفعاليات</p>
                  </div>
                  <div className="facility-item">
                    <h4>🚗 مواقف السيارات</h4>
                    <p>جراج تحت المبنى الرئيسي يتسع لـ 300 سيارة مع خدمات مدفوعة مخصصة للمشتركين</p>
                  </div>
                  <div className="facility-item">
                    <h4>🎓 الأكاديميات الرياضية</h4>
                    <p>أكاديميات رياضية متنوعة للأطفال من الجنسين</p>
                  </div>
                  <div className="facility-item">
                    <h4>👶 مركز رعاية الأطفال</h4>
                    <p>مركز خاص لرعاية الأطفال تحت سن السادسة</p>
                  </div>
                </div>
              </div>

              <div className="content-block">
                <h3>المساحات الخضراء والترفيهية</h3>
                <p>
                  مساحات خضراء كبيرة ومتنوعة تخدم جميع أعضاء النادي وعائلاتهم وضيوفهم، مع عدة مقاهي حول هذه الساحات تقدم جميع الخدمات.
                </p>
                <p>
                  منطقة البوليفارد تخدم الجميع ويحيط بها عدد من المطاعم والمقاهي المتميزة بخدمات متنوعة، مع خدمات أخرى مثل: الحلاق، المقهى الشعبي... تطل على مساحات خضراء ومناطق مائية واسعة.
                </p>
              </div>

              <div className="content-block">
                <h3>قاعة المؤتمرات والفعاليات</h3>
                <p>
                  تعتبر قاعة المؤتمرات والفعاليات من أفخم قاعات الفعاليات في مكة المكرمة، مجهزة بأحدث التقنيات لاستضافة المؤتمرات والفعاليات المتنوعة.
                </p>
              </div>

              <div className="content-block">
                <h3>عضوية عائلية شاملة</h3>
                <p>
                  كل هذا وأكثر باشتراك عائلي واحد يشمل جميع أفراد العائلة وبأسعار رمزية تناسب الجميع. مكة يارد بيئة تُعتبر بيتاً ثانياً للمشترك.
                </p>
                <p className="highlight">
                  نحن في مكة يارد نطمح لتكوين واقع أجمل معكم... إنه المجتمع العظيم لعائلة مكة يارد. يشرفنا انضمامكم إلينا في هذه التجربة الفريدة والنوعية الأولى في المملكة.
                </p>
              </div>

              <div className="cta-section">
                <h3>انضم إلى عائلة مكة يارد اليوم</h3>
                <p>كن جزءاً من مجتمع حصري من الأفراد ذوي الاهتمامات المشتركة</p>
                <div className="cta-buttons">
                  <Link to="/membership" className="btn btn-primary btn-lg">اشترك الآن</Link>
                  <Link to="/contact" className="btn btn-outline-primary btn-lg">تواصل معنا</Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;