"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Crown, Award } from "lucide-react";
import Link from "next/link";
import PackageCard from "./PackageCard";

const PackagesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: "0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  const packages = [
    {
      id: 1,
      name: "PLATA",
      price: "₡10,000",
      icon: Award,
      featured: false,
      services: [
        "Lavado exterior completo",
        "Aspirado interior básico",
        "Limpieza de vidrios",
        "Encerado básico",
      ],
      color: "from-gray-400 to-gray-600",
      cardBg: "bg-gradient-to-br from-gray-800/90 to-gray-900/90",
    },
    {
      id: 2,
      name: "BRONCE",
      price: "₡20,000",
      icon: Star,
      featured: true,
      services: [
        "Todo lo del paquete Plata",
        "Limpieza profunda interior",
        "Tratamiento de llantas",
        "Ambientador premium",
        "Protección UV",
      ],
      color: "from-amber-600 to-amber-800",
      cardBg: "bg-gradient-to-br from-amber-900/90 to-red-orange-900/90",
    },
    {
      id: 3,
      name: "ORO",
      price: "₡35,000",
      icon: Crown,
      featured: false,
      services: [
        "Todo lo del paquete Bronce",
        "Detallado completo",
        "Encerado premium",
        "Limpieza de motor",
        "Protección de asientos",
      ],
      color: "from-yellow-400 to-yellow-600",
      cardBg: "bg-gradient-to-br from-yellow-900/90 to-amber-900/90",
    },
  ];

  return (
    <>
      {/* Fixed background image layer - optimized */}
      <div
        className={`fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10 transition-opacity duration-300 will-change-auto ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url('/packages-bg.jpg')`,
          transform: "translateZ(0)", // Hardware acceleration
        }}
      />

      <section
        ref={sectionRef}
        id="paquetes"
        className="relative min-h-screen overflow-hidden bg-transparent"
        style={{ willChange: "auto" }}
      >
        {/* Dark overlay - optimized */}
        <div
          className="absolute inset-0 bg-black/70 z-0"
          style={{ willChange: "auto" }}
        />

        {/* Content */}
        <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                PAQUETES ESPECIALES
              </h2>
              <p className="text-lg sm:text-xl text-red-orange-500 max-w-2xl mx-auto">
                Paquetes completos con variedad de servicios incluidos
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {packages.map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <p className="text-gray-300 mb-6">
                ¿No encuentras el paquete perfecto? Contáctanos para crear uno
                personalizado
              </p>
              <Link
                href="/agendar-cita"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-red-orange-500 text-red-orange-500 px-8 py-3 rounded-lg font-semibold
                       transition-all duration-300 hover:bg-red-orange-500 hover:text-white hover:scale-105
                       active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-orange-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Contactar para Paquete Personalizado
              </Link>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-amber-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </section>
    </>
  );
};

export default PackagesSection;
