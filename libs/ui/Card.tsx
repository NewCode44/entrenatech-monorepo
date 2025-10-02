
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-secondary rounded-xl border border-gray-800 p-6 shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;