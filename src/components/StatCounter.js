import React, { useState, useEffect, useRef } from 'react';

const StatCounter = ({ end, duration = 2000, suffix = '', prefix = '', title }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observed = counterRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (observed) {
      observer.observe(observed);
    }

    return () => {
      if (observed) {
        observer.unobserve(observed);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      let startTime = null;
      const startCount = 0;
      const endCount = end;

      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const currentCount = Math.floor(progress * (endCount - startCount) + startCount);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, end, duration]);

  return (
    <div ref={counterRef} className="stat-counter text-center">
      <div className="stat-number">
        <span className="h2 font-weight-bold text-white">
          {prefix}{count.toLocaleString()}{suffix}
        </span>
      </div>
      {title && (
        <div className="stat-title">
          <span className="text-light">{title}</span>
        </div>
      )}
    </div>
  );
};

export default StatCounter;