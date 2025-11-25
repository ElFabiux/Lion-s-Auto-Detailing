"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  MessageCircle,
  Home,
  HandHeart,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

const ContactSection = () => {
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

  const links = [
    { name: "Inicio", href: "#inicio", icon: Home, id: "inicio" },
    { name: "Servicios", href: "#servicios", icon: HandHeart, id: "servicios" },
    { name: "Paquetes", href: "#paquetes", icon: Package, id: "paquetes" },
    { name: "Galería", href: "#galeria", icon: ImageIcon, id: "galeria" },
  ];

  const contactMessage = encodeURIComponent(
    `¡Hola!\n` +
      `*Información de mi vehículo:*\n` +
      `• Marca: \n` +
      `• Modelo: \n` +
      `• Año: \n` +
      `Me quería contactar directamente con ustedes para...`
  );

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "instant",
      });
    }
  };

  return (
    <>
      {/* Fixed background image layer */}
      <div
        className={`fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10 transition-opacity duration-300 will-change-auto ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url('/packages-bg.jpg')`,
          transform: "translateZ(0)",
        }}
      />

      <section
        ref={sectionRef}
        id="contactanos"
        className="relative min-h-screen lg:min-h-[80vh] xl:min-h-[70vh] overflow-hidden bg-transparent"
        style={{ willChange: "auto" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 z-0" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-3 xs:px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto w-full">
            {/* Main Content Grid - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-start">
              <div
                className={`text-center md:text-left ${
                  "md:col-span-1 xl:col-span-1"
                }`}
              >
                <div className="flex flex-col items-center md:items-start">
                  {/* Logo */}
                  <div className="mb-4 sm:mb-6">
                    <Image
                      src="/logo.png"
                      alt="Lion's Auto Detailing Logo"
                      width={120}
                      height={120}
                      className="w-auto h-20 xs:h-24 sm:h-24 md:h-28 lg:h-32 xl:h-36"
                    />
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-red-orange-500 mb-1 sm:mb-2">
                      LION'S AUTO
                    </h2>
                    <h3 className="text-xl xs:text-2xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white tracking-wider">
                      DETAILING
                    </h3>
                  </div>

                  <div className="hidden lg:block mb-6 xl:mb-8">
                    <p className="text-gray-300 text-sm lg:text-base xl:text-lg leading-relaxed max-w-xs">
                      Servicios profesionales de detallado automotriz con la más
                      alta calidad
                    </p>
                  </div>

                  <div className="hidden md:block mt-4 sm:mt-6 lg:mt-8">
                    <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                      LION'S AUTO DETAILING © 2025
                    </p>
                    <p className="text-gray-500 text-xs mt-1 hidden sm:block">
                      Todos los derechos reservados
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 gap-8 sm:gap-12 ${
                  "md:col-span-1 xl:col-span-2 xl:grid-cols-2"
                }`}
              >
                {/* Links Útiles */}
                <div className="text-center md:text-left">
                  <h3 className="text-xl xs:text-2xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-6 lg:mb-8">
                    LINKS ÚTILES
                  </h3>

                  <nav className="space-y-4 sm:space-y-4 lg:space-y-5">
                    {links.map((link, index) => {
                      const IconComponent = link.icon;
                      return (
                        <div key={index}>
                          <button
                            onClick={() => scrollToSection(link.id)}
                            className="flex items-center text-gray-300 hover:text-red-orange-500 transition-colors duration-300 text-base xs:text-lg sm:text-base lg:text-lg xl:text-xl group w-full justify-center md:justify-start"
                          >
                            <IconComponent className="w-5 h-5 xs:w-6 xs:h-6 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-3 sm:mr-3 text-red-orange-500 transition-colors duration-300" />
                            <span className="font-medium">{link.name}</span>
                          </button>
                        </div>
                      );
                    })}
                  </nav>
                </div>

                {/* Información de Contacto */}
                <div className="text-center md:text-left">
                  <h3 className="text-xl xs:text-2xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-6 lg:mb-8">
                    CONTACTO
                  </h3>

                  <div className="space-y-5 sm:space-y-5 lg:space-y-6">
                    {/* Ubicación */}
                    <div className="flex items-start justify-center md:justify-start gap-3 sm:gap-3 group">
                      <MapPin className="w-5 h-5 xs:w-6 xs:h-6 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-orange-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-left">
                        <p className="text-gray-300 text-base xs:text-lg sm:text-base lg:text-lg xl:text-xl leading-relaxed">
                          Copa Buena, Coto Brus
                        </p>
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-3 group">
                      <Phone className="w-5 h-5 xs:w-6 xs:h-6 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                      <div>
                        <a
                          href="tel:+50688275168"
                          className="text-gray-300 hover:text-red-orange-500 transition-colors duration-300 text-base xs:text-lg sm:text-base lg:text-lg xl:text-xl font-medium"
                        >
                          +506 8827 5168
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-3 group">
                      <Mail className="w-5 h-5 xs:w-6 xs:h-6 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                      <div>
                        <a
                          href="mailto:info@lionsautodetailing.com"
                          className="text-gray-300 hover:text-red-orange-500 transition-colors duration-300 text-base xs:text-lg sm:text-base lg:text-lg xl:text-xl font-medium break-all"
                        >
                          lionsautodetailing11@gmail.com
                        </a>
                      </div>
                    </div>

                    {/* Redes Sociales */}
                    <div className="mt-8 sm:mt-8">
                      <h4 className="text-white font-semibold mb-4 sm:mb-4 text-base xs:text-lg sm:text-base lg:text-lg">
                        Síguenos
                      </h4>
                      <div className="flex justify-center md:justify-start gap-4 sm:gap-4">
                        {/* Facebook */}
                        <a
                          href="https://www.facebook.com/share/1BQuLt99hL/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 xs:w-14 xs:h-14 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
                          aria-label="Facebook"
                        >
                          <Facebook className="w-5 h-5 xs:w-6 xs:h-6 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </a>

                        {/* Instagram */}
                        <a
                          href="https://www.instagram.com/lion_sautodetailing?igsh=OWVkdzU5cGI3bXI0"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 xs:w-14 xs:h-14 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg flex items-center justify-center text-white hover:from-pink-600 hover:to-orange-500 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-5 h-5 xs:w-6 xs:h-6 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </a>

                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/50688275168?text=${contactMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 xs:w-14 xs:h-14 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-green-600 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle className="w-5 h-5 xs:w-6 xs:h-6 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:hidden mt-12 text-center">
              <div>
                <p className="text-gray-400 text-sm xs:text-base">
                  LION'S AUTO DETAILING © 2025
                </p>
                <p className="text-gray-500 text-xs xs:text-sm mt-1">
                  Todos los derechos reservados
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements - Responsivos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-red-orange-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/6 w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 bg-red-orange-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-red-orange-500/5 rounded-full blur-2xl sm:blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </section>
    </>
  );
};

export default ContactSection;
