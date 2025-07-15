'use client';

import { useState } from 'react';
import { Check, Car, Truck, Mountain, X, HandHelping } from 'lucide-react';
import Link from 'next/link';

const PackageCard = ({ pkg, index }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('sedan');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vehicleTypes = [
    { key: 'sedan', label: 'Sedán', icon: Car },
    { key: 'suv', label: 'SUV', icon: Truck },
    { key: '4x4', label: '4x4', icon: Mountain }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Información detallada para el modal
  const detailedInfo = {
    1: { // Bronce
      title: "Mantenimiento Para Cerámico",
      description: "Servicio especializado para vehículos con tratamiento cerámico",
      services: [
        "Usamos sistema de filtración para evitar la gota seca durante el lavado",
        "Lavado con espuma activa",
        "Detallado de Aros, llantas y guardabarros",
        "Aplicación de Sellador en Húmedo Wet Coat en pintura y aros que supera la protección y repelencia del agua de una cera convencional",
        "Refuerzo con Quick Detailer Base sílica (Base principal de los cerámicos)",
        "Reacondicionado de partes negras (plásticos externos)",
        "Limpieza, aspirado, y reacondicionado de interior con productos de alta protección y poco brillo",
        "Limpieza y Desengrasado de Parabrisas y ventanas"
      ]
    },
    2: { // Plata
      title: "Limpieza Profunda",
      description: "Servicio completo de limpieza interior y exterior",
      services: [
        "Limpieza de techo",
        "Aspirado y cepillado de Alfombras",
        "Limpieza profunda de paneles internos",
        "Limpieza de cinturones",
        "Extracción de asientos",
        "Limpieza de asientos",
        "Protección de paneles internos con Plastic Care",
        "Limpieza profunda de vidrios",
        "Lavado Básico exterior"
      ]
    },
    3: { // Oro
      title: "Abrillantado de un Solo paso (UNO protect)",
      description: "PAQUETE SOLO INCLUYE PINTURA - Especializado en restauración de brillo",
      services: [
        "Lavado premium Exterior",
        "Eliminación de Ceras existentes",
        "Descontaminación de pintura con Arcilla (Clay Bar)",
        "Pulido Con producto de un solo paso (UNO protect) que realza el brillo mientras deja una protección de hasta 6 meses",
        "Rehidratación de partes negras (Plásticos exteriores)",
        "Limpieza y Desengrasado de vidrios (no pulido)"
      ]
    },
    4: { // Diamante
      title: "Tratamiento Cerámico Completo para Auto",
      description: "Protección Premium Duradera - Pintura y Componentes Externos",
      services: [
        "Preparación de Superficie:",
        "• Lavado profundo y descontaminación con arcilla (Clay Bar)",
        "• Eliminación de ceras y residuos antiguos",
        "• Corrección menor de brillo con pulido suave (si es necesario)",
        "Aplicación de Revestimiento Cerámico:",
        "• Capa base de cerámico de alta resistencia",
        "• Sellador hidrofóbico para máxima repelencia al agua y suciedad",
        "• Protección UV y antioxidante para evitar decoloración",
        "Protección Adicional:",
        "• Tratamiento cerámico para vidrios (repelente de agua)",
        "• Revestimiento en llantas y aros para evitar acumulación de brake dust",
        "• Reacondicionamiento de plásticos y molduras con protector UV",
        "Beneficios:",
        "• Brillo intenso y efecto 'espejo'",
        "• Fácil mantenimiento y autolavado rápido",
        "• Resistencia a rayos UV, químicos y contaminación ambiental"
      ]
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    
    // Emitir evento personalizado para que el navbar se oculte
    window.dispatchEvent(new CustomEvent('modalOpen'));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset'; // Restaurar scroll del body
    
    // Emitir evento personalizado para que el navbar aparezca
    window.dispatchEvent(new CustomEvent('modalClose'));
  };

  return (
    <>
      <div
        className={`relative group transform transition-all duration-500 hover:scale-105 cursor-pointer ${
          pkg.featured ? 'lg:scale-105 lg:hover:scale-110' : ''
        }`}
        onClick={openModal}
      >
        {/* Featured badge */}
        {pkg.featured && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-red-orange-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
              RECOMENDADO
            </div>
          </div>
        )}

        {/* Card */}
        <div className={`${pkg.cardBg} backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl transition-all duration-300 h-full flex flex-col ${
          pkg.featured ? 'ring-2 ring-red-orange-500/50' : ''
        }`}>
          
          {/* Package Icon & Header */}
          <div className="text-center mb-6">
            <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${pkg.color} shadow-lg mb-4`}>
              <pkg.icon className="w-6 h-6 text-white" />
            </div>
            
            <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}>
              {pkg.name}
            </h3>
            
            <p className="text-sm text-gray-300 leading-tight">
              {pkg.subtitle}
            </p>
          </div>

          {/* Vehicle Type Selector */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-1 bg-black/20 p-1 rounded-lg">
              {vehicleTypes.map((vehicle) => {
                const IconComponent = vehicle.icon;
                return (
                  <button
                    key={vehicle.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVehicle(vehicle.key);
                    }}
                    className={`flex flex-col items-center p-2 rounded-md transition-all duration-300 ${
                      selectedVehicle === vehicle.key
                        ? 'bg-red-orange-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mb-1" />
                    <span className="text-xs font-medium">{vehicle.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-white">
              {formatPrice(pkg.prices[selectedVehicle])}
            </div>
          </div>

          {/* Highlights List */}
          <div className="flex-grow mb-6">
            <ul className="space-y-2">
              {pkg.highlights.map((highlight, highlightIndex) => (
                <li key={highlightIndex} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-red-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* View Details Button */}
          <button className="w-full py-2 px-4 rounded-lg font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 text-sm mb-3">
            Ver Detalles Completos
          </button>

          {/* CTA Button */}
          <Link
            href="/agendar-cita"
            onClick={(e) => e.stopPropagation()}
            className={`block w-full text-center py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm ${
              pkg.featured 
                ? 'bg-red-orange-500 hover:bg-red-orange-600' 
                : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
            }`}
          >
            Solicitar Servicio
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </div>

      {/* Modal - Z-INDEX MÁXIMO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop - Z-INDEX MUY ALTO */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fadeIn z-[99998]"
            onClick={closeModal}
          />
          
          {/* Modal Content - Z-INDEX EL MÁS ALTO */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp z-[99999]">
            
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${pkg.color} relative`}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-full z-[100000]"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <pkg.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{pkg.name}</h2>
                  <p className="text-white/90">{detailedInfo[pkg.id].title}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              
              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed">
                  {detailedInfo[pkg.id].description}
                </p>
              </div>

              {/* Price Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Precios por Tipo de Vehículo</h3>
                <div className="grid grid-cols-3 gap-3">
                  {vehicleTypes.map((vehicle) => {
                    const IconComponent = vehicle.icon;
                    return (
                      <div key={vehicle.key} className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                        <IconComponent className="w-6 h-6 text-red-orange-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-300">{vehicle.label}</div>
                        <div className="text-lg font-bold text-white">
                          {formatPrice(pkg.prices[vehicle.key])}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services List */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <HandHelping className="w-5 h-5 text-red-orange-500" />
                  Servicios Incluidos
                </h3>
                <ul className="space-y-3">
                  {detailedInfo[pkg.id].services.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {service.startsWith('•') ? (
                        <>
                          <div className="w-2 h-2 bg-red-orange-500 rounded-full mt-2 ml-4 flex-shrink-0" />
                          <span className="text-gray-300 text-sm leading-relaxed">{service.substring(1).trim()}</span>
                        </>
                      ) : service.endsWith(':') ? (
                        <div className="w-full">
                          <h4 className="text-red-orange-500 font-semibold text-sm">{service}</h4>
                        </div>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-red-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm leading-relaxed">{service}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Link
                href="/agendar-cita"
                className="block w-full text-center py-4 px-6 bg-red-orange-500 hover:bg-red-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Solicitar Este Paquete
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        /* COMENTARIO: Jerarquía de z-index establecida:
           - Modal container: z-[99999] (99999)
           - Modal backdrop: z-[99998] (99998) 
           - Modal content: z-[99999] (99999)
           - Close button: z-[100000] (100000)
           
           Esto asegura que el modal esté por encima de:
           - Navbar (z-50 = 50)
           - Galería títulos (z-10 = 10)
           - Cualquier otro elemento de la página
           
           NOTA: Usamos valores muy altos para garantizar que NUNCA 
           haya conflictos con otros componentes
        */
      `}</style>
    </>
  );
};

export default PackageCard;