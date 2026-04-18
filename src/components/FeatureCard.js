import React from 'react';
import { Card } from 'react-bootstrap';

const FeatureCard = ({ icon, title, description, className = '' }) => {
  return (
    <Card className={`feature-card h-100 ${className}`}>
      <Card.Body className="text-center">
        <div className="icon mb-3">
          <i className={icon}></i>
        </div>
        <Card.Title as="h4">{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default FeatureCard;