'use client';
import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-10 px-3 py-1 text-white bg-gray-900 text-sm rounded-md shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-100 transition-opacity duration-300 w-max dark:bg-gray-700">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-700" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
