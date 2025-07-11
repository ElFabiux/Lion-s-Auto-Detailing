"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Star,
  Crown,
  Gem,
  Car,
  Truck,
  Mountain,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Info,
} from "lucide-react";

const ServicesStep = ({ data, updateData, onNext, onPrev, onExit }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(data.selectedPackage);
  // CAMBIO: Inicializar con el vehículo guardado o sedan por defecto
  const [selectedVehicle, setSelectedVehicle] = useState(data.selectedVehicle || "sedan");
  const [additionalMessage, setAdditionalMessage] = useState(
    data.additionalMessage || ""
  );
  const [showPackageDetails, setShowPackageDetails] = useState(null);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const packages = [
    {
      id: 1,
      name: "BRONCE",
      subtitle: "Mantenimiento Para Cerámico",
      icon: Award,
      prices: { sedan: 30000, suv: 35000, "4x4": 40000 },
      color: "from-amber-600 to-amber-800",
      highlights: [
        "Sistema de filtración anti-gota seca",
        "Lavado con espuma activa",
        "Sellador Wet Coat superior a cera",
        "Quick Detailer base sílica",
        "Reacondicionado completo interior",
      ],
    },
    {
      id: 2,
      name: "PLATA",
      subtitle: "Limpieza Profunda",
      icon: Star,
      prices: { sedan: 85000, suv: 95000, "4x4": 105000 },
      color: "from-gray-400 to-gray-600",
      highlights: [
        "Limpieza de techo completa",
        "Extracción y limpieza de asientos",
        "Aspirado y cepillado profundo",
        "Protección Plastic Care",
        "Limpieza de cinturones",
      ],
    },
    {
      id: 3,
      name: "ORO",
      subtitle: "Abrillantado UNO Protect",
      icon: Crown,
      prices: { sedan: 155000, suv: 175000, "4x4": 195000 },
      color: "from-yellow-300 to-yellow-500",
      highlights: [
        "Solo pintura - Especializado",
        "Descontaminación con Clay Bar",
        "Pulido un solo paso UNO protect",
        "Protección hasta 6 meses",
        "Rehidratación plásticos externos",
      ],
    },
    {
      id: 4,
      name: "DIAMANTE",
      subtitle: "Tratamiento Cerámico Completo",
      icon: Gem,
      prices: { sedan: 200000, suv: 230000, "4x4": 260000 },
      color: "from-blue-400 to-purple-600",
      highlights: [
        "Protección duradera",
        "Revestimiento cerámico alta resistencia",
        "Tratamiento cerámico para vidrios",
        "Brillo intenso efecto espejo",
        "Resistencia UV y químicos",
      ],
    },
  ];

  const vehicleTypes = [
    { key: "sedan", label: "Sedán", icon: Car },
    { key: "suv", label: "SUV", icon: Truck },
    { key: "4x4", label: "4x4", icon: Mountain },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    // CAMBIO: Incluir selectedVehicle en updateData
    updateData({
      selectedPackage: pkg,
      selectedVehicle, // Agregar esta línea
      additionalMessage,
    });
  };

  // CAMBIO: Nueva función para manejar cambio de vehículo
  const handleVehicleChange = (vehicleType) => {
    setSelectedVehicle(vehicleType);
    updateData({
      selectedPackage,
      selectedVehicle: vehicleType, // Guardar el tipo de vehículo
      additionalMessage,
    });
  };

  const handleMessageChange = (message) => {
    setAdditionalMessage(message);
    // CAMBIO: Incluir selectedVehicle en updateData
    updateData({
      selectedPackage,
      selectedVehicle, // Agregar esta línea
      additionalMessage: message,
    });
  };

  const handleNext = () => {
    if (selectedPackage) {
      onNext();
    }
  };

  return (
    <div
      className={`transition-all duration-700 h-full flex items-center justify-center ${
        isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Container responsive - móvil: full height, desktop: tamaño fijo centrado */}
      <div className="w-full h-full lg:h-auto lg:max-h-[85vh] lg:w-[900px] lg:max-w-4xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden min-w-0">
        {/* Header - fijo en la parte superior */}
        <div className="flex-shrink-0 text-center p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            SELECCIONE EL PAQUETE
          </h2>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            DE SU PREFERENCIA
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-red-orange-500 mx-auto rounded-full" />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 px-4 sm:px-6 lg:px-8">
          {/* Vehicle Type Selector - parte del scroll */}
          <div className="mb-6 sm:mb-8">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-center text-sm sm:text-base">
              Tipo de Vehículo
            </h4>
            <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-black/20 p-1 sm:p-2 rounded-lg">
              {vehicleTypes.map((vehicle) => {
                const IconComponent = vehicle.icon;
                return (
                  <button
                    key={vehicle.key}
                    onClick={() => handleVehicleChange(vehicle.key)}
                    className={`flex flex-col items-center p-2 sm:p-3 rounded-md transition-all duration-300 ${
                      selectedVehicle === vehicle.key
                        ? "bg-red-orange-500 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm font-medium">
                      {vehicle.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Packages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 min-w-0">
            {packages.map((pkg) => {
              const IconComponent = pkg.icon;
              const isSelected = selectedPackage?.id === pkg.id;

              return (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg)}
                  className={`relative group cursor-pointer transition-all duration-300 
                  /* Solo hover y zoom en pantallas grandes (lg y superiores) */
                  lg:hover:scale-105 lg:transform
                  /* En pantallas pequeñas mantener escala normal */
                  ${isSelected ? "lg:scale-105" : "scale-100"}
                `}
                >
                  <div
                    className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border transition-all duration-300 relative ${
                      isSelected
                        ? "border-red-orange-500 bg-red-orange-500/10"
                        : "border-white/10 lg:hover:border-white/20"
                    }`}
                  >
                    {/* Selection Ring - Solo visible cuando está seleccionado */}
                    {isSelected && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-orange-500/60 to-red-orange-600/60 rounded-xl blur-sm animate-pulse-soft" />
                    )}

                    {/* Card Content */}
                    <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                      {/* Package Header */}
                      <div className="text-center mb-3 sm:mb-4">
                        <div
                          className={`inline-flex p-2 sm:p-3 rounded-full bg-gradient-to-r ${pkg.color} shadow-lg mb-2 sm:mb-3`}
                        >
                          <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h3
                          className={`text-base sm:text-lg font-bold mb-1 bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}
                        >
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-gray-300">{pkg.subtitle}</p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-3 sm:mb-4">
                        <div className="text-lg sm:text-xl font-bold text-white">
                          {formatPrice(pkg.prices[selectedVehicle])}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                        {pkg.highlights.slice(0, 3).map((highlight, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="w-3 h-3 text-red-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-300 leading-tight">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Details Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPackageDetails(
                            showPackageDetails === pkg.id ? null : pkg.id
                          );
                        }}
                        className="w-full py-2 text-xs text-red-orange-500 hover:text-red-orange-400 transition-colors duration-300 flex items-center justify-center gap-1"
                      >
                        <Info className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          {showPackageDetails === pkg.id
                            ? "Ocultar Detalles"
                            : "Ver Más Detalles"}
                        </span>
                        <span className="sm:hidden">
                          {showPackageDetails === pkg.id ? "Menos" : "Más"}
                        </span>
                      </button>

                      {/* Expanded Details */}
                      {showPackageDetails === pkg.id && (
                        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-black/20 rounded-lg animate-expandDown">
                          <div className="space-y-1 sm:space-y-2">
                            {pkg.highlights.slice(3).map((highlight, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <Check className="w-3 h-3 text-red-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-300 leading-tight">
                                  {highlight}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-orange-500 rounded-full flex items-center justify-center animate-scaleIn z-20">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Message */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-red-orange-500 flex-shrink-0" />
              <span className="hidden sm:inline">
                Mensaje Adicional (Opcional)
              </span>
              <span className="sm:hidden">Mensaje (Opcional)</span>
            </label>
            <textarea
              value={additionalMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="¿Necesita algo específico o tiene alguna solicitud especial?"
              rows={3}
              className="w-full p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-orange-500 focus:border-transparent resize-none text-sm sm:text-base min-w-0"
            />
          </div>
        </div>

        {/* Buttons - fijos en la parte inferior */}
        <div className="flex-shrink-0 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6">
          <div className="flex justify-between items-center gap-3 sm:gap-4">
            <div className="flex gap-2 sm:gap-4">
              {/* Exit Button */}
              <button
                onClick={onExit}
                className="group flex items-center justify-center gap-2 px-3 py-3 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm min-w-[48px] sm:min-w-auto"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">SALIR</span>
              </button>

              {/* Previous Button */}
              <button
                onClick={onPrev}
                className="group flex items-center justify-center gap-2 px-3 py-3 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm min-w-[48px] sm:min-w-auto"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="hidden sm:inline">ANTERIOR</span>
              </button>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!selectedPackage}
              className={`group flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg min-w-[48px] sm:min-w-auto ${
                selectedPackage
                  ? "bg-red-orange-500 hover:bg-red-orange-600 text-white hover:shadow-xl hover:shadow-red-orange-500/25"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="hidden sm:inline">SIGUIENTE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 sm:mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-orange-500 rounded-full animate-pulse" />
              <span className="text-xs text-white/60">Paso 3 de 4</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes expandDown {
            from {
              opacity: 0;
              max-height: 0;
            }
            to {
              opacity: 1;
              max-height: 200px;
            }
          }

          @keyframes scaleIn {
            from {
              transform: scale(0);
            }
            to {
              transform: scale(1);
            }
          }

          @keyframes pulse-soft {
            0%,
            100% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.005);
            }
          }

          .animate-expandDown {
            animation: expandDown 0.3s ease-out;
          }

          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }

          .animate-pulse-soft {
            animation: pulse-soft 3s ease-in-out infinite;
          }

          /* Scrollbar styles para el área de contenido */
          .flex-1::-webkit-scrollbar {
            width: 4px;
          }

          .flex-1::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
          }

          .flex-1::-webkit-scrollbar-thumb {
            background: #f9402e;
            border-radius: 2px;
          }

          .flex-1::-webkit-scrollbar-thumb:hover {
            background: #e63228;
          }

          /* Prevenir scroll horizontal */
          .flex-1 {
            overflow-x: hidden !important;
          }

          @media (max-width: 640px) {
            .flex-1::-webkit-scrollbar {
              width: 3px;
            }
          }

          /* Estilos adicionales para el contenedor responsive */
          @media (min-width: 1024px) {
            /* En desktop, mantener el contenedor centrado y con altura fija */
            .lg\\:max-h-\\[85vh\\] {
              max-height: 85vh;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ServicesStep;