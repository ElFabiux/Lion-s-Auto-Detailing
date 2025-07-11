"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Crown, Award, Gem } from "lucide-react";
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
      name: "BRONCE",
      subtitle: "Mantenimiento Para Cerámico",
      basePrice: 30000,
      prices: {
        sedan: 30000,
        suv: 35000,
        "4x4": 40000
      },
      icon: Award,
      featured: false,
      highlights: [
        "Sistema de filtración anti-gota seca",
        "Lavado con espuma activa",
        "Sellador Wet Coat superior a cera",
        "Quick Detailer base sílica",
        "Reacondicionado completo interior"
      ],
      color: "from-amber-600 to-amber-800",
      cardBg: "bg-gradient-to-br from-amber-900/90 to-red-orange-900/90",
    },
    {
      id: 2,
      name: "PLATA",
      subtitle: "Limpieza Profunda",
      basePrice: 85000,
      prices: {
        sedan: 85000,
        suv: 95000,
        "4x4": 105000
      },
      icon: Star,
      featured: false,
      highlights: [
        "Limpieza de techo completa",
        "Extracción y limpieza de asientos",
        "Aspirado y cepillado profundo",
        "Protección Plastic Care",
        "Limpieza de cinturones"
      ],
      color: "from-gray-400 to-gray-600",
      cardBg: "bg-gradient-to-br from-gray-800/90 to-gray-900/90",
    },
    {
      id: 3,
      name: "ORO",
      subtitle: "Abrillantado UNO Protect",
      basePrice: 155000,
      prices: {
        sedan: 155000,
        suv: 175000,
        "4x4": 195000
      },
      icon: Crown,
      featured: true,
      highlights: [
        "Solo pintura - Especializado",
        "Descontaminación con Clay Bar",
        "Pulido un solo paso UNO protect",
        "Protección hasta 6 meses",
        "Rehidratación plásticos externos"
      ],
      color: "from-yellow-300 to-yellow-500",
      cardBg: "bg-gradient-to-br from-yellow-800/90 to-yellow-700/90",
    },
    {
      id: 4,
      name: "DIAMANTE",
      subtitle: "Tratamiento Cerámico Completo",
      basePrice: 200000,
      prices: {
        sedan: 200000,
        suv: 230000,
        "4x4": 260000
      },
      icon: Gem,
      featured: false,
      highlights: [
        "Protección hasta duradera",
        "Revestimiento cerámico alta resistencia",
        "Tratamiento cerámico para vidrios",
        "Brillo intenso efecto espejo",
        "Resistencia UV y químicos"
      ],
      color: "from-blue-400 to-purple-600",
      cardBg: "bg-gradient-to-br from-blue-900/90 to-purple-900/90",
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-6">
              {packages.map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
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