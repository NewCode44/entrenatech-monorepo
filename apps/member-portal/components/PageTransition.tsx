import React, { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, pageKey }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [pageKey]);

  return (
    <div
      className={`transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
