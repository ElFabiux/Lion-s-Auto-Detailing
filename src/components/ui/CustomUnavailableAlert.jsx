// components/ui/CustomUnavailableAlert.jsx
"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Calendar, X } from "lucide-react";

const CustomUnavailableAlert = ({ isOpen, onClose, slotData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 50);
      // Prevenir scroll del body
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isVisible) return null;

  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate + "T00:00:00");
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Alert Container */}
      <div
        className={`relative bg-gradient-to-br from-woodsmoke-950/95 to-mine-shaft-950/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl max-w-md w-full transform transition-all duration-300 ${
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Warning Icon with Animation */}
        <div className="relative text-center pt-8 pb-6">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-500/20 rounded-full blur-xl animate-pulse" />

          {/* Main Icon */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg animate-bounce-subtle">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center px-6 pb-6">
          <h2
            className="text-2xl font-bold text-white mb-2 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            ¡CITA NO DISPONIBLE!
          </h2>
          <p
            className="text-amber-400 font-semibold mb-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Esta cita fue ocupada hace unos momentos
          </p>
          
          {/* Slot Information */}
          {slotData && (
            <div
              className="bg-black/30 rounded-lg p-4 mb-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center justify-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{slotData.fecha ? formatDateForDisplay(slotData.fecha) : 'Fecha no disponible'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{slotData.hora || 'Hora no disponible'}</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="text-red-400 text-sm font-medium">
                  Estado: {slotData.estado || 'Ocupado'}
                </span>
              </div>
            </div>
          )}

          <p
            className="text-white/80 text-sm leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            Por favor, regrese a la selección de fecha y hora para elegir otra cita disponible.
          </p>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6">
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-amber-500/25 text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Entendido, seleccionar otra cita
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          <div className="absolute top-1/4 left-1/6 w-20 h-20 bg-amber-500/5 rounded-full blur-xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default CustomUnavailableAlert;