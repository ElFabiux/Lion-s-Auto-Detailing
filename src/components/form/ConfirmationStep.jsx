"use client";

import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  CalendarClock,
  CalendarCheck,
  Package,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  X,
  Send,
  Edit,
  Clock,
  CarFront,
  CircleCheck,
  ThumbsUp,
  OctagonAlert,
} from "lucide-react";
import CustomSuccessAlert from '../ui/CustomSuccessAlert';

const ConfirmationStep = ({ formData, onSubmit, onPrev, onExit }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Llamar la función onSubmit original (que hace la petición a la API)
      await onSubmit();

      // Preparar datos para el alert
      const selectedVehicle = formData.services.selectedVehicle || "sedan";
      const packagePrice = formData.services.selectedPackage.prices[selectedVehicle];

      const vehicleNames = {
        sedan: "Sedán",
        suv: "SUV",
        "4x4": "4x4",
      };

      const appointmentDetails = {
        client: formData.personalInfo.name,
        date: formData.dateTime.selectedDate,
        time: formData.dateTime.selectedTime,
        package: formData.services.selectedPackage?.name,
        vehicle: vehicleNames[selectedVehicle],
        price: packagePrice
      };

      setAppointmentData(appointmentDetails);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAlertClose = () => {
    setShowSuccessAlert(false);
    // Redirigir al inicio después de cerrar el alert
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  };

  const getDayName = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(year, month - 1, day);
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return days[date.getDay()];
  };

  const getMonthName = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return months[parseInt(month) - 1];
  };

  // Obtener el tipo de vehículo seleccionado
  const selectedVehicle = formData.services.selectedVehicle || "sedan";

  // Obtener el precio según el tipo de vehículo
  const packagePrice =
    formData.services.selectedPackage.prices[selectedVehicle];

  // Mapear los nombres de los vehículos para mostrar
  const vehicleNames = {
    sedan: "Sedán",
    suv: "SUV",
    "4x4": "4x4",
  };

  return (
    <>
      <div
        className={`transition-all duration-700 h-full flex items-center justify-center ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        {/* Container responsive - móvil: full height, desktop: tamaño fijo centrado */}
        <div className="w-full h-full lg:h-auto lg:max-h-[85vh] lg:w-[900px] lg:max-w-4xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden min-w-0">
          {/* Header - fijo en la parte superior */}
          <div className="flex-shrink-0 text-center p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
              VERIFIQUE SU INFORMACIÓN
            </h2>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
              Y CONFIRME LA CITA
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-green-500 mx-auto rounded-full" />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 px-4 sm:px-6 lg:px-8">
            {/* Information Summary */}
            <div className="space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-white">
                    <span className="hidden sm:inline">Información Personal</span>
                    <span className="sm:hidden">Datos Personales</span>
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <span className="text-white/60 text-xs sm:text-sm">
                      Nombre:
                    </span>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {formData.personalInfo.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60 text-xs sm:text-sm">
                      Teléfono:
                    </span>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {formData.personalInfo.phone}
                    </p>
                  </div>
                  <div className="sm:col-span-1">
                    <span className="text-white/60 text-xs sm:text-sm">
                      Correo:
                    </span>
                    <p className="text-white font-medium text-sm sm:text-base break-all">
                      {formData.personalInfo.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
                    <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-white">
                    <span className="hidden sm:inline">
                      Fecha y Hora de la Cita
                    </span>
                    <span className="sm:hidden">Fecha y Hora</span>
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/20 rounded-lg">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-red-orange-500" />
                    <div>
                      <span className="text-white/60 text-xs sm:text-sm">
                        Fecha:
                      </span>
                      <p className="text-white font-medium text-sm sm:text-base">
                        {formData.dateTime.selectedDate}
                      </p>
                      <p className="text-white/80 text-xs sm:text-sm">
                        {getDayName(formData.dateTime.selectedDate)},{" "}
                        {getMonthName(formData.dateTime.selectedDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/20 rounded-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-orange-500" />
                    <div>
                      <span className="text-white/60 text-xs sm:text-sm">
                        Hora:
                      </span>
                      <p className="text-white font-medium text-sm sm:text-base">
                        {formData.dateTime.selectedTime}
                      </p>
                      <p className="text-white/80 text-xs sm:text-sm">
                        Hora confirmada
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Package */}
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-emerald-500/20 rounded-lg">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-white">
                    <span className="hidden sm:inline">Paquete Seleccionado</span>
                    <span className="sm:hidden">Paquete</span>
                  </h4>
                </div>
                <div className="bg-black/20 rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${formData.services.selectedPackage.color}`}>
                        <formData.services.selectedPackage.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h5 className="text-lg sm:text-xl font-bold text-white">{formData.services.selectedPackage.name}</h5>
                        <p className="text-white/60 text-xs sm:text-sm">{formData.services.selectedPackage.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-red-orange-500">
                        {formatPrice(packagePrice)}
                      </p>
                      <p className="text-white/60 text-xs sm:text-sm">Precio para {vehicleNames[selectedVehicle]}</p>
                    </div>
                  </div>

                  {/* Package highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                    {formData.services.selectedPackage.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CircleCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80 text-xs sm:text-sm leading-tight">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Message */}
              {formData.services.additionalMessage && (
                <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-white">
                      <span className="hidden sm:inline">Mensaje Adicional</span>
                      <span className="sm:hidden">Mensaje</span>
                    </h4>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 sm:p-4">
                    <p className="text-white/90 italic text-sm sm:text-base">
                      "{formData.services.additionalMessage}"
                    </p>
                  </div>
                </div>
              )}

              {/* Summary Box */}
              <div className="bg-gradient-to-r from-red-orange-500/20 to-red-orange-600/20 rounded-xl p-4 sm:p-6 border border-red-orange-500/30">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 text-center">Resumen de la Cita</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-red-orange-500" />
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">{formData.personalInfo.name}</p>
                      <p className="text-white/60 text-xs sm:text-sm">Cliente</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <CarFront className="w-6 h-6 sm:w-8 sm:h-8 text-red-orange-500" />
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">{vehicleNames[selectedVehicle]}</p>
                      <p className="text-white/60 text-xs sm:text-sm">Vehículo</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <CalendarCheck className="w-6 h-6 sm:w-8 sm:h-8 text-red-orange-500" />
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">{formData.dateTime.selectedDate}</p>
                      <p className="text-white font-medium text-sm sm:text-base">{formData.dateTime.selectedTime}</p>
                      <p className="text-white/60 text-xs sm:text-sm">Fecha y Hora</p>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
                  <p className="text-lg sm:text-2xl font-bold text-white mb-1">
                    Paquete {formData.services.selectedPackage.name}
                  </p>
                  <p className="text-red-orange-500 font-semibold text-base sm:text-lg">
                    {formatPrice(packagePrice)}
                  </p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-yellow-500/15 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-2 sm:gap-3">
                  <OctagonAlert className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-white font-semibold mb-1 text-sm sm:text-base">
                      <span className="hidden sm:inline">
                        Información Importante
                      </span>
                      <span className="sm:hidden">Importante</span>
                    </h5>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                      Nos comunicaremos con
                      usted 24 horas antes de la cita para confirmar los detalles
                      finales.
                    </p>
                  </div>
                </div>
              </div>
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

              {/* Confirm Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`group flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg min-w-[48px] sm:min-w-auto ${isSubmitting
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white hover:shadow-xl hover:shadow-green-500/25"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">ENVIANDO...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="hidden sm:inline">CONFIRMAR CITA</span>
                    <span className="sm:hidden">CONFIRMAR</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 sm:mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-white/60">
                  <span className="hidden sm:inline">
                    Paso 4 de 4 - Confirmación Final
                  </span>
                  <span className="sm:hidden">Paso 4 de 4</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin {
            animation: spin 1s linear infinite;
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

      {/* Custom Success Alert */}
      <CustomSuccessAlert
        isOpen={showSuccessAlert}
        onClose={handleAlertClose}
        appointmentData={appointmentData}
      />
    </>
  );
};

export default ConfirmationStep;