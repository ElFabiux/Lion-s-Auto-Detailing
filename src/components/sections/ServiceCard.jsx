'use client';

import { useState } from 'react';

const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group transition-all duration-300 hover:transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Card Container */}
      <div className="bg-white-50 rounded-lg shadow-lg p-8 h-full flex flex-col items-center text-center 
                      transition-all duration-300 hover:shadow-xl border border-white-200">
        
        {/* Icon Container */}
        <div className={`mb-6 p-4 rounded-full transition-all duration-300 ${
          isHovered ? 'bg-red-orange-500 text-white-50' : 'bg-white-200 text-woodsmoke-950'
        }`}>
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
          isHovered ? 'text-red-orange-500' : 'text-woodsmoke-950'
        }`}>
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-woodsmoke-600 leading-relaxed text-sm flex-grow">
          {service.description}
        </p>

      </div>
    </div>
  );
};

export default ServiceCard;