import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/pages/ActivitiesPage.css';

const ActivitiesPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const activities = [
    {
      id: 1,
      title: 'الجمباز للأطفال',
      category: 'gymnastics',
      description: 'برنامج الجمباز المخصص للأطفال من سن 4-12 سنة، يركز على تطوير المرونة والقوة والتوازن.',
      image: '/images/gymnastics-kids.jpg',
      duration: '60 دقيقة',
      level: 'مبتدئ',
      price: '200 ريال/شهر',
      schedule: 'السبت والثلاثاء 4:00 مساءً'
    },
    {
      id: 2,
      title: 'الجمباز للكبار',
      category: 'gymnastics',
      description: 'برنامج الجمباز للبالغين يركز على اللياقة البدنية والمرونة والقوة الوظيفية.',
      image: '/images/gymnastics-adults.jpg',
      duration: '75 دقيقة',
      level: 'متوسط',
      price: '300 ريال/شهر',
      schedule: 'الأحد والأربعاء 6:00 مساءً'
    },
    {
      id: 3,
      title: 'اللياقة البدنية العامة',
      category: 'fitness',
      description: 'برنامج شامل للياقة البدنية يشمل تمارين القوة والكارديو والمرونة.',
      image: '/images/fitness-general.jpg',
      duration: '60 دقيقة',
      level: 'جميع المستويات',
      price: '250 ريال/شهر',
      schedule: 'يومياً 7:00 صباحاً و 7:00 مساءً'
    },
    {
      id: 4,
      title: 'تدريب القوة',
      category: 'fitness',
      description: 'برنامج متخصص في تدريب القوة وبناء العضلات باستخدام الأوزان الحرة والآلات.',
      image: '/images/strength-training.jpg',
      duration: '90 دقيقة',
      level: 'متقدم',
      price: '350 ريال/شهر',
      schedule: 'الاثنين والأربعاء والجمعة 8:00 مساءً'
    },
    {
      id: 5,
      title: 'الكاراتيه للأطفال',
      category: 'karate',
      description: 'تعليم فنون الدفاع عن النفس والانضباط والثقة بالنفس للأطفال.',
      image: '/images/karate-kids.jpg',
      duration: '60 دقيقة',
      level: 'مبتدئ',
      price: '280 ريال/شهر',
      schedule: 'السبت والثلاثاء 5:00 مساءً'
    },
    {
      id: 6,
      title: 'الكاراتيه للكبار',
      category: 'karate',
      description: 'تدريب متقدم في فنون الكاراتيه للبالغين مع التركيز على التقنيات المتقدمة.',
      image: '/images/karate-adults.jpg',
      duration: '90 دقيقة',
      level: 'متوسط إلى متقدم',
      price: '320 ريال/شهر',
      schedule: 'الأحد والأربعاء 8:00 مساءً'
    }
  ];

  const categories = [
    { key: 'all', label: 'جميع الأنشطة', icon: '🏃' },
    { key: 'gymnastics', label: 'الجمباز', icon: '🤸' },
    { key: 'fitness', label: 'اللياقة البدنية', icon: '💪' },
    { key: 'karate', label: 'الكاراتيه', icon: '🥋' }
  ];

  const filteredActivities = activeTab === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === activeTab);

  return (
    <div className="activities-page">
      {/* Hero Section */}
      <section className="activities-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="hero-title">أنشطتنا الرياضية</h1>
              <p className="hero-subtitle">
                اكتشف مجموعة متنوعة من الأنشطة الرياضية المصممة لجميع الأعمار والمستويات
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Activities Section */}
      <section className="activities-content">
        <Container>
          {/* Category Tabs */}
          <Row className="mb-5">
            <Col>
              <Nav variant="pills" className="category-tabs justify-content-center">
                {categories.map(category => (
                  <Nav.Item key={category.key}>
                    <Nav.Link 
                      active={activeTab === category.key}
                      onClick={() => setActiveTab(category.key)}
                      className="category-tab"
                    >
                      <span className="tab-icon">{category.icon}</span>
                      {category.label}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
          </Row>

          {/* Activities Grid */}
          <Row>
            {filteredActivities.map(activity => (
              <Col lg={4} md={6} className="mb-4" key={activity.id}>
                <Card className="activity-card h-100">
                  <div className="activity-image">
                    <Card.Img variant="top" src={activity.image} alt={activity.title} />
                    <div className="activity-overlay">
                      <span className="activity-level">{activity.level}</span>
                    </div>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="activity-title">{activity.title}</Card.Title>
                    <Card.Text className="activity-description">
                      {activity.description}
                    </Card.Text>
                    
                    <div className="activity-details mt-auto">
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <span>{activity.duration}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-calendar"></i>
                        <span>{activity.schedule}</span>
                      </div>
                      <div className="detail-item price">
                        <i className="fas fa-tag"></i>
                        <span>{activity.price}</span>
                      </div>
                    </div>
                    
                    <div className="activity-actions mt-3">
                      <Button variant="primary" className="btn-book" as={Link} to="/register">
                        احجز الآن
                      </Button>
                      <Button variant="outline-primary" className="btn-details">
                        تفاصيل أكثر
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="activities-cta">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2>هل تحتاج مساعدة في اختيار النشاط المناسب؟</h2>
              <p>فريقنا المتخصص جاهز لمساعدتك في اختيار البرنامج الأنسب لك أو لطفلك</p>
              <div className="cta-buttons">
                <Button variant="primary" size="lg" as={Link} to="/contact">
                  تواصل معنا
                </Button>
                <Button variant="outline-light" size="lg" className="ms-3">
                  احجز استشارة مجانية
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ActivitiesPage;