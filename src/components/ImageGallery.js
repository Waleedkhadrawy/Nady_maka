import React, { useState } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import SectionTitle from './SectionTitle';
import '../styles/components/ImageGallery.css';

const ImageGallery = ({ title, subtitle, images }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <section className="section image-gallery-section">
      <Container>
        <SectionTitle title={title} subtitle={subtitle} />
        <Row className="image-gallery-grid">
          {images.map((image, index) => (
            <Col lg={4} md={6} sm={12} key={index} className="mb-4">
              <div 
                className="image-gallery-item" 
                onClick={() => handleImageClick(image, index)}
              >
                <div className="image-gallery-thumbnail">
                  <img 
                    src={image.src} 
                    alt={image.title} 
                    className="image-gallery-img" 
                  />
                  <div className="image-gallery-overlay">
                    <div className="zoom-icon">
                      <i className="bi bi-zoom-in"></i>
                    </div>
                    <div className="image-info">
                      <h5>{image.title}</h5>
                      <p>{image.description}</p>
                    </div>
                  </div>
                </div>
                <div className="image-gallery-content">
                  <h6>{image.title}</h6>
                  <span className="image-category">{image.category}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Image Modal */}
      <Modal show={showModal} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedImage?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedImage && (
            <div className="image-viewer-container">
              <div className="image-viewer">
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.title} 
                  className="modal-image" 
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      className="nav-arrow nav-arrow-left" 
                      onClick={handlePrevious}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <button 
                      className="nav-arrow nav-arrow-right" 
                      onClick={handleNext}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                <div className="image-counter">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>
              
              {/* Image Description */}
              <div className="image-description">
                <h5>{selectedImage.title}</h5>
                <p>{selectedImage.description}</p>
                <span className="image-category-modal">{selectedImage.category}</span>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default ImageGallery;