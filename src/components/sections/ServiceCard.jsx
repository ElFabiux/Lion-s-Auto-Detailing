'use client';

import { useState } from 'react';
import Image from 'next/image';

const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Mapeo de nombres de archivos por ID de servicio
  const getServiceIconPath = (serviceId) => {
    const iconMap = {
      1: 'ppf.png',                    // PPF
      2: 'pulido-parabrisas.png',     // Pulido de Parabrisas
      3: 'correccion-pintura.png',    // Corrección de Pintura
      4: 'tapiceria.png',             // Tapicería
      5: 'pulido-faros.png',          // Pulido de Faros
      6: 'ceramico.png'               // Aplicación de Cerámico
    };
    
    return `/service-icons/${iconMap[serviceId] || 'ppf.png'}`;
  };

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
        <div className={`mb-6 p-4 rounded-full transition-all duration-300 flex items-center justify-center ${
          isHovered ? 'bg-red-orange-500' : 'bg-white-200'
        }`}>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Image
              src={getServiceIconPath(service.id)}
              alt={`Icono de ${service.title}`}
              width={64}
              height={64}
              className={`object-contain transition-all duration-300 ${
                isHovered ? 'brightness-0 invert' : ''
              }`}
              priority={service.id <= 3} // Prioridad para los primeros 3 iconos
            />
          </div>
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