import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import SectionTitle from '../components/SectionTitle';

const EventsPage = () => {
  const events = [
    {
      title: 'بطولة الكاراتيه الشتوية',
      date: '15 فبراير 2024',
      time: '6:00 مساءً',
      location: 'صالة الكاراتيه الرئيسية',
      description: 'بطولة داخلية لجميع المستويات مع جوائز قيمة للفائزين',
      image: '/images/karate.svg',
      category: 'بطولة',
      status: 'قريباً'
    },
    {
      title: 'ورشة اللياقة البدنية للمبتدئين',
      date: '20 فبراير 2024',
      time: '10:00 صباحاً',
      location: 'صالة اللياقة البدنية',
      description: 'تعلم أساسيات اللياقة البدنية مع مدربين محترفين',
      image: '/images/fitness.svg',
      category: 'ورشة',
      status: 'متاح'
    },
    {
      title: 'عرض الجمباز الفني',
      date: '25 فبراير 2024',
      time: '7:00 مساءً',
      location: 'الصالة الرئيسية',
      description: 'عرض مذهل من طلاب أكاديمية الجمباز',
      image: '/images/gymnastics.svg',
      category: 'عرض',
      status: 'متاح'
    },
    {
      title: 'يوم مفتوح للعائلات',
      date: '1 مارس 2024',
      time: '2:00 ظهراً',
      location: 'جميع المرافق',
      description: 'يوم ترفيهي للعائلات مع أنشطة متنوعة للأطفال والكبار',
      image: '/images/hero-bg.svg',
      category: 'فعالية',
      status: 'متاح'
    },
    {
      title: 'محاضرة التغذية الرياضية',
      date: '5 مارس 2024',
      time: '8:00 مساءً',
      location: 'قاعة المحاضرات',
      description: 'تعرف على أهمية التغذية السليمة للرياضيين',
      image: '/images/fitness.svg',
      category: 'محاضرة',
      status: 'متاح'
    },
    {
      title: 'بطولة الجمباز الربيعية',
      date: '10 مارس 2024',
      time: '5:00 مساءً',
      location: 'صالة الجمباز',
      description: 'بطولة إقليمية للجمباز مع مشاركة أندية أخرى',
      image: '/images/gymnastics.svg',
      category: 'بطولة',
      status: 'قريباً'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'متاح': return 'success';
      case 'قريباً': return 'warning';
      case 'مكتمل': return 'secondary';
      default: return 'primary';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'بطولة': return 'danger';
      case 'ورشة': return 'info';
      case 'عرض': return 'success';
      case 'فعالية': return 'primary';
      case 'محاضرة': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="events-page">
      <div className="hero-section bg-gradient text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">الفعاليات والأنشطة</h1>
              <p className="lead mb-0">
                اكتشف الفعاليات المثيرة والأنشطة المتنوعة في مكة يارد
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <SectionTitle 
          title="الفعاليات القادمة"
          subtitle="لا تفوت الفرصة للمشاركة في فعالياتنا المميزة"
        />
        
        <Row className="g-4">
          {events.map((event, index) => (
            <Col lg={4} md={6} key={index}>
              <Card className="h-100 border-0 shadow-lg event-card">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={event.image} 
                    alt={event.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <Badge bg={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="position-absolute top-0 start-0 m-3">
                    <Badge bg={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <h5 className="card-title mb-3">{event.title}</h5>
                  <p className="card-text text-muted mb-3">{event.description}</p>
                  
                  <div className="event-details mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-calendar text-primary me-2"></i>
                      <span>{event.date}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-clock text-primary me-2"></i>
                      <span>{event.time}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-100"
                    disabled={event.status === 'مكتمل'}
                  >
                    {event.status === 'مكتمل' ? 'انتهت الفعالية' : 'سجل الآن'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-5">
          <Col lg={8} className="mx-auto text-center">
            <div className="bg-light p-4 rounded">
              <h4 className="mb-3">هل تريد تنظيم فعالية خاصة؟</h4>
              <p className="mb-3">
                نحن نساعدك في تنظيم فعاليات خاصة ومناسبات رياضية مميزة
              </p>
              <Button variant="outline-primary" size="lg">
                اطلب فعالية خاصة
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EventsPage;