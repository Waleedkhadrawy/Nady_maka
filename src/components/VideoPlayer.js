import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import '../styles/components/VideoPlayer.css';

const VideoPlayer = ({ thumbnail, title, description, videoUrl, isYoutube = false }) => {
  const [showModal, setShowModal] = useState(false);

  const handlePlay = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const getEmbedUrl = (url) => {
    if (isYoutube) {
      // Convert YouTube URL to embed format
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  return (
    <>
      <div className="video-container" onClick={handlePlay}>
        <div className="video-thumbnail">
          <img src={thumbnail} alt={title} className="video-thumb-img" />
          <div className="play-overlay">
            <i className="bi bi-play-circle-fill"></i>
          </div>
        </div>
        <div className="video-text">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="video-player-container">
            {isYoutube ? (
              <iframe
                width="100%"
                height="400"
                src={getEmbedUrl(videoUrl)}
                title={title}
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
                <source src={videoUrl} type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VideoPlayer;