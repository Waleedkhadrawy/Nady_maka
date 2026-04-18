import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ActivityCard = ({ image, title, description, link, className = '' }) => {
  return (
    <Card 
      className={`activity-card ${className}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <Card.Body className="d-flex align-items-end">
        <div className="card-content">
          <Card.Title as="h4">{title}</Card.Title>
          <Card.Text>{description}</Card.Text>
          {link && (
            <Button 
              as={Link} 
              to={link} 
              variant="outline-light" 
              size="sm"
            >
              اعرف المزيد
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ActivityCard;