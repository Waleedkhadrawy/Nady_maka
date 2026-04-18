import React from 'react';
import '../styles/components/WhatsAppFloat.css';

// Image only display as requested

function WhatsAppFloat() {
  return (
    <img
      className="wa-fixed-left"
      src={`${process.env.PUBLIC_URL}/images/whts.PNG`}
      alt="واتساب"
    />
  );
}

export default WhatsAppFloat;
