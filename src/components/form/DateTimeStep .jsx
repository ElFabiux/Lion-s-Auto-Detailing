"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Loader2,
  RefreshCw,
} from "lucide-react";

const DateTimeStep = ({ data, updateData, onNext, onPrev, onExit }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    fetchAvailableSlots();
  }, []);

  // Buscar slot seleccionado cuando cambian los datos o slots
  useEffect(() => {
    if (data.selectedDate && data.selectedTime && availableSlots.length > 0) {
      const existingSlot = availableSlots.findIndex(
        (slot) =>
          formatDateForComparison(slot.fecha) === data.selectedDate &&
          slot.hora === data.selectedTime
      );
      setSelectedSlot(existingSlot >= 0 ? existingSlot : null);
    }
  }, [data, availableSlots]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/slots");
      const result = await response.json();

      if (result.success) {
        const slotsFromAPI = result.data || [];

        // Filtrar fechas futuras CON CORRECCIÓN de zona horaria
        const futureSlots = slotsFromAPI.filter((slot) => {
          if (!slot.fecha) return false;

          const slotDate = new Date(slot.fecha + "T00:00:00");
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return slotDate >= today;
        });

        setAvailableSlots(futureSlots);
      } else {
        setError(result.error || "Error al cargar disponibilidad");
      }
    } catch (error) {
      console.error("Network Error:", error);
      setError("Error de conexión al cargar disponibilidad");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAvailableSlots();
    setRefreshing(false);
  };

  const formatDateForComparison = (isoDate) => {
    const date = new Date(isoDate + "T00:00:00"); 
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatDateForDisplay = (isoDate) => {
    const date = new Date(isoDate + "T00:00:00"); 
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const handleSlotSelect = (index) => {
    setSelectedSlot(index);
    const slot = availableSlots[index];
    updateData({
      selectedDate: formatDateForDisplay(slot.fecha),
      selectedTime: slot.hora,
      slotId: slot.id, // Guardar el ID del slot para después
    });
  };

  const handleNext = () => {
    if (selectedSlot !== null) {
      onNext();
    }
  };

  const getDayName = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(year, month - 1, day);
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return days[date.getDay()];
  };

  // Componente de Loading
  if (loading) {
    return (
      <div
        className={`transition-all duration-700 ${
          isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
              CARGANDO DISPONIBILIDAD
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-red-orange-500 mx-auto rounded-full" />
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-red-orange-500 animate-spin mb-4" />
            <p className="text-white/60 text-sm">
              Consultando horarios disponibles...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`transition-all duration-700 ${
          isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
              ERROR AL CARGAR
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-red-500 mx-auto rounded-full" />
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-400 text-center mb-6">
              <p className="text-lg font-semibold mb-2">
                No se pudo cargar la disponibilidad
              </p>
              <p className="text-sm text-white/60">{error}</p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-6 py-3 bg-red-orange-500 hover:bg-red-orange-600 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Reintentando..." : "Reintentar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-700 ${
        isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              SELECCIONE LA FECHA DE SU PREFERENCIA
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-white/60 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg disabled:opacity-50"
              title="Actualizar disponibilidad"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <div className="w-16 sm:w-20 h-1 bg-red-orange-500 mx-auto rounded-full" />
        </div>

        {availableSlots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg mb-4">
              No hay horarios disponibles en este momento
            </p>
            <p className="text-white/40 text-sm">
              Por favor, contacte directamente para agendar su cita
            </p>
          </div>
        ) : (
          <>
            {/* Table Header - Hidden on mobile, shown as cards */}
            <div className="hidden sm:block mb-4 lg:mb-6">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 bg-black/20 rounded-t-lg border-b border-white/10">
                <div className="flex items-center gap-2 text-red-orange-500 font-semibold text-sm lg:text-base">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Fecha</span>
                </div>
                <div className="flex items-center gap-2 text-red-orange-500 font-semibold text-sm lg:text-base">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Hora</span>
                </div>
                <div className="text-red-orange-500 font-semibold text-sm lg:text-base">
                  <span className="hidden sm:inline">Día</span>
                </div>
                <div className="text-red-orange-500 font-semibold text-center text-sm lg:text-base">
                  <span className="hidden sm:inline">Asignar</span>
                </div>
              </div>
            </div>

            {/* Available Slots */}
            <div className="max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
              <div className="space-y-2 pr-1 sm:pr-2">
                {availableSlots.map((slot, index) => (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotSelect(index)}
                    className={`cursor-pointer transition-all duration-300 border rounded-lg ${
                      selectedSlot === index
                        ? "bg-red-orange-500/20 border-red-orange-500 ring-1 sm:ring-2 ring-red-orange-500/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Mobile Layout - Card Style */}
                    <div className="block sm:hidden p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-white font-medium text-sm">
                              <Calendar className="w-4 h-4 text-red-orange-500" />
                              {formatDateForDisplay(slot.fecha)}
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                              <Clock className="w-4 h-4 text-red-orange-500" />
                              {slot.hora} - {slot.dia}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                            selectedSlot === index
                              ? "bg-red-orange-500 border-red-orange-500"
                              : "border-white/30"
                          }`}
                        >
                          {selectedSlot === index && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout - Table Style */}
                    <div className="hidden sm:grid sm:grid-cols-4 gap-2 lg:gap-4 p-3 lg:p-4">
                      <div className="text-white font-medium text-sm lg:text-base">
                        {formatDateForDisplay(slot.fecha)}
                      </div>
                      <div className="text-white font-medium text-sm lg:text-base">
                        {slot.hora}
                      </div>
                      <div className="text-white/80 text-sm lg:text-base">
                        {slot.dia}
                      </div>
                      <div className="flex justify-center">
                        <div
                          className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                            selectedSlot === index
                              ? "bg-red-orange-500 border-red-orange-500"
                              : "border-white/30 hover:border-red-orange-500"
                          }`}
                        >
                          {selectedSlot === index && (
                            <Check className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected slot info */}
            {selectedSlot !== null && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-orange-500/10 border border-red-orange-500/30 rounded-lg animate-fadeIn">
                <div className="text-center">
                  <span className="text-red-orange-500 text-xs sm:text-sm font-medium">
                    Seleccionada:{" "}
                  </span>
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {formatDateForDisplay(availableSlots[selectedSlot].fecha)} a
                    las {availableSlots[selectedSlot].hora}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center mt-6 sm:mt-8 lg:mt-10 gap-3 sm:gap-4">
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
            disabled={selectedSlot === null}
            className={`group flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg min-w-[48px] sm:min-w-auto ${
              selectedSlot !== null
                ? "bg-red-orange-500 hover:bg-red-orange-600 text-white hover:shadow-xl hover:shadow-red-orange-500/25"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span className="hidden sm:inline">SIGUIENTE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-red-orange-500 rounded-full animate-pulse" />
            <span className="text-xs text-white/60">Paso 2 de 4</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Estilos personalizados para scrollbar */
        .max-h-64::-webkit-scrollbar,
        .max-h-80::-webkit-scrollbar,
        .max-h-96::-webkit-scrollbar {
          width: 4px;
        }

        .max-h-64::-webkit-scrollbar-track,
        .max-h-80::-webkit-scrollbar-track,
        .max-h-96::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .max-h-64::-webkit-scrollbar-thumb,
        .max-h-80::-webkit-scrollbar-thumb,
        .max-h-96::-webkit-scrollbar-thumb {
          background: #f9402e;
          border-radius: 2px;
        }

        .max-h-64::-webkit-scrollbar-thumb:hover,
        .max-h-80::-webkit-scrollbar-thumb:hover,
        .max-h-96::-webkit-scrollbar-thumb:hover {
          background: #e63228;
        }

        @media (max-width: 640px) {
          .max-h-64::-webkit-scrollbar {
            width: 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default DateTimeStep;
