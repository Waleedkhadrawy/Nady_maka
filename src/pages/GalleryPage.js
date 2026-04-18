import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Button, Nav } from 'react-bootstrap';
import SectionTitle from '../components/SectionTitle';

const GalleryPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('الكل');

  const galleryItems = [
    {
      id: 1,
      title: 'تدريب الكاراتيه',
      category: 'كاراتيه',
      image: '/images/karate.svg',
      description: 'جلسة تدريبية مكثفة للكاراتيه'
    },
    {
      id: 2,
      title: 'صالة اللياقة البدنية',
      category: 'لياقة',
      image: '/images/fitness.svg',
      description: 'أحدث الأجهزة الرياضية'
    },
    {
      id: 3,
      title: 'عرض الجمباز',
      category: 'جمباز',
      image: '/images/gymnastics.svg',
      description: 'عرض مذهل من طلاب الجمباز'
    },
    {
      id: 4,
      title: 'المرافق الرئيسية',
      category: 'مرافق',
      image: '/images/hero-bg.svg',
      description: 'جولة في مرافق النادي'
    },
    {
      id: 5,
      title: 'بطولة الكاراتيه الشتوية',
      category: 'فعاليات',
      image: '/images/karate.svg',
      description: 'لحظات من البطولة الأخيرة'
    },
    {
      id: 6,
      title: 'تدريب اللياقة الجماعي',
      category: 'لياقة',
      image: '/images/fitness.svg',
      description: 'حصة تدريبية جماعية'
    },
    {
      id: 7,
      title: 'مسابقة الجمباز',
      category: 'جمباز',
      image: '/images/gymnastics.svg',
      description: 'مشاركة في مسابقة إقليمية'
    },
    {
      id: 8,
      title: 'يوم مفتوح للعائلات',
      category: 'فعاليات',
      image: '/images/hero-bg.svg',
      description: 'فعالية عائلية مميزة'
    },
    {
      id: 9,
      title: 'تدريب الكاراتيه للأطفال',
      category: 'كاراتيه',
      image: '/images/karate.svg',
      description: 'برنامج خاص للأطفال'
    }
  ];

  const categories = ['الكل', 'كاراتيه', 'لياقة', 'جمباز', 'فعاليات', 'مرافق'];

  const filteredItems = activeCategory === 'الكل' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const handleImageClick = (item) => {
    setSelectedImage(item);
    setShowModal(true);
  };

  return (
    <div className="gallery-page">
      <div className="hero-section bg-gradient text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">معرض الصور</h1>
              <p className="lead mb-0">
                استكشف لحظات مميزة من أنشطة وفعاليات مكة يارد
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <SectionTitle 
          title="معرض الصور والفيديوهات"
          subtitle="شاهد أجمل اللحظات من أنشطتنا المتنوعة"
        />
        
        {/* Filter Navigation */}
        <Row className="mb-4">
          <Col>
            <Nav variant="pills" className="justify-content-center">
              {categories.map((category) => (
                <Nav.Item key={category}>
                  <Nav.Link 
                    active={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className="mx-1"
                  >
                    {category}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
        </Row>
        
        {/* Gallery Grid */}
        <Row className="g-4">
          {filteredItems.map((item) => (
            <Col lg={4} md={6} key={item.id}>
              <Card 
                className="gallery-item border-0 shadow-lg h-100"
                onClick={() => handleImageClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <div className="position-relative overflow-hidden">
                  <Card.Img 
                    variant="top" 
                    src={item.image} 
                    alt={item.title}
                    className="gallery-image"
                    style={{ height: '250px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                  <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <i className="fas fa-search-plus text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
                <Card.Body className="p-3">
                  <h6 className="card-title mb-2">{item.title}</h6>
                  <p className="card-text text-muted small mb-0">{item.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredItems.length === 0 && (
          <Row>
            <Col className="text-center py-5">
              <h4 className="text-muted">لا توجد صور في هذه الفئة حالياً</h4>
            </Col>
          </Row>
        )}

        {/* Statistics */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto">
            <div className="bg-light p-4 rounded text-center">
              <Row>
                <Col md={3} className="mb-3">
                  <h3 className="text-primary mb-1">{galleryItems.length}</h3>
                  <p className="mb-0 text-muted">إجمالي الصور</p>
                </Col>
                <Col md={3} className="mb-3">
                  <h3 className="text-success mb-1">50+</h3>
                  <p className="mb-0 text-muted">فعالية موثقة</p>
                </Col>
                <Col md={3} className="mb-3">
                  <h3 className="text-warning mb-1">100+</h3>
                  <p className="mb-0 text-muted">لحظة مميزة</p>
                </Col>
                <Col md={3} className="mb-3">
                  <h3 className="text-info mb-1">3</h3>
                  <p className="mb-0 text-muted">أنواع رياضية</p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Image Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedImage?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage && (
            <>
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title}
                className="img-fluid mb-3"
                style={{ maxHeight: '400px' }}
              />
              <p className="text-muted">{selectedImage.description}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .gallery-item:hover .gallery-image {
          transform: scale(1.05);
        }
        
        .gallery-overlay {
          background: rgba(0, 0, 0, 0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;