// components/ui/CustomProcessingAlert.jsx
"use client";

import { useState, useEffect } from "react";
import { Clock, Users, RefreshCw, X } from "lucide-react";

const CustomProcessingAlert = ({ isOpen, onClose, lockedFor = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [countdown, setCountdown] = useState(5); // 5 segundos de countdown

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 50);
      // Prevenir scroll del body
      document.body.style.overflow = "hidden";

      // Inicializar countdown
      setCountdown(5);
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

  // Countdown timer
  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown]);

  if (!isVisible) return null;

  const formatTime = (seconds) => {
    return seconds > 0 ? `${seconds}s` : "Ya puede intentar";
  };

  const getProgressPercentage = () => {
    return ((5 - countdown) / 5) * 100;
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
        {/* Processing Icon with Animation */}
        <div className="relative text-center pt-8 pb-6">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse" />

          {/* Main Icon */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg">
            <div className="relative">
              {/* Spinning outer ring */}
              <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-white/30 rounded-full animate-spin" />
              {/* Main icon */}
              <div className="flex items-center justify-center w-16 h-16">
                <Users className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Processing Message */}
        <div className="text-center px-6 pb-6">
          <h2
            className="text-2xl font-bold text-white mb-2 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            ¡CITA EN PROCESO!
          </h2>
          <p
            className="text-blue-400 font-semibold mb-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Otro usuario está procesando esta cita
          </p>

          {/* Processing Information */}
          <div
            className="bg-black/30 rounded-lg p-4 mb-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-center gap-4 text-sm text-white/80 mb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin-slow" />
                <span>Procesando reserva...</span>
              </div>
              {lockedFor > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Hace {Math.round(lockedFor)}s</span>
                </div>
              )}
            </div>

            {/* Countdown display */}
            <div className="text-center mb-3">
              <div className="text-lg font-bold text-white">
                {formatTime(countdown)}
              </div>
              <div className="text-xs text-white/60">
                Tiempo sugerido de espera
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          <p
            className="text-white/80 text-sm leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            Por favor espere unos segundos e intente nuevamente. Si el problema
            persiste, seleccione otra cita.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div
            className="flex gap-3 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <button
              onClick={onClose}
              disabled={countdown > 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 text-sm font-medium ${
                countdown > 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              }`}
            >
              <X
                className={`w-4 h-4 ${
                  countdown > 0
                    ? ""
                    : "group-hover:rotate-180 transition-transform duration-300"
                }`}
              />
              {countdown > 0 ? `Esperar ${countdown}s` : "Intentar de nuevo"}
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          <div className="absolute top-1/4 left-1/6 w-20 h-20 bg-blue-500/5 rounded-full blur-xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      <style jsx>{`
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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) translateX(5px);
            opacity: 0.8;
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-8px) translateX(-3px);
            opacity: 0.6;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CustomProcessingAlert;
