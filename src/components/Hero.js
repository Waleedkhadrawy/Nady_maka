import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/components/Hero.css';

const Hero = ({ title, subtitle, backgroundImage, backgroundVideo, buttonText, buttonLink }) => {
  return (
    <section className="hero bg-overlay">
      {/* Video Background */}
      {backgroundVideo && (
        <video 
          className="hero-video" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
          {/* Fallback to image if video fails */}
          <img src={backgroundImage} alt="Background" className="hero-fallback-image" />
        </video>
      )}
      
      {/* Image Background (fallback or when no video) */}
      {!backgroundVideo && backgroundImage && (
        <div 
          className="hero-image" 
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      <Container>
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          {buttonText && buttonLink && (
            <Link to={buttonLink}>
              <Button className="hero-button btn-lg btn-rounded">{buttonText}</Button>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Hero;