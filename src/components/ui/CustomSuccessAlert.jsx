"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";


const CustomSuccessAlert = ({ isOpen, onClose, appointmentData }) => {
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
        {/* Success Icon with Animation */}
        <div className="relative text-center pt-8 pb-6">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-500/20 rounded-full blur-xl animate-pulse" />

          {/* Main Icon */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg animate-bounce-subtle">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center px-6 pb-6">
          <h2
            className="text-2xl font-bold text-white mb-2 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            ¡CITA CONFIRMADA!
          </h2>
          <p
            className="text-green-400 font-semibold mb-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Su cita ha sido agendada exitosamente
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div
            className="flex gap-3 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="flex-1 py-3 px-4 bg-red-orange-500 hover:bg-red-orange-600 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-red-orange-500/25 text-sm font-medium"
            >
              Ir al Inicio
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          <div className="absolute top-1/4 left-1/6 w-20 h-20 bg-green-500/5 rounded-full blur-xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-red-orange-500/5 rounded-full blur-xl animate-pulse"
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

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
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

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default CustomSuccessAlert;
