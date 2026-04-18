import React, { useState } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import SectionTitle from './SectionTitle';
import '../styles/components/VideoGallery.css';

const VideoGallery = ({ title, subtitle, videos }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  const getEmbedUrl = (url, isYoutube) => {
    if (isYoutube) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  return (
    <section className="section video-gallery-section">
      <Container>
        <SectionTitle title={title} subtitle={subtitle} />
        <Row className="video-gallery-grid">
          {videos.map((video, index) => (
            <Col lg={4} md={6} sm={12} key={index} className="mb-4">
              <div 
                className="video-gallery-item" 
                onClick={() => handleVideoClick(video)}
              >
                <div className="video-gallery-thumbnail">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="video-gallery-img" 
                  />
                  <div className="video-gallery-overlay">
                    <div className="play-button">
                      <i className="bi bi-play-circle-fill"></i>
                    </div>
                    <div className="video-info">
                      <h5>{video.title}</h5>
                      <p>{video.description}</p>
                    </div>
                  </div>
                </div>
                <div className="video-gallery-content">
                  <h6>{video.title}</h6>
                  <span className="video-duration">{video.duration}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Video Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedVideo?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedVideo && (
            <div className="video-player-container">
              {selectedVideo.isYoutube ? (
                <iframe
                  width="100%"
                  height="400"
                  src={getEmbedUrl(selectedVideo.url, selectedVideo.isYoutube)}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  width="100%"
                  height="400"
                  controls
                  autoPlay
                >
                  <source src={selectedVideo.url} type="video/mp4" />
                  متصفحك لا يدعم تشغيل الفيديو.
                </video>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default VideoGallery;