'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, Home, HandHeart, Package, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer para animaciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: '0px',
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
    { name: 'Inicio', href: '#inicio', icon: Home, id: 'inicio' },
    { name: 'Servicios', href: '#servicios', icon: HandHeart, id: 'servicios' },
    { name: 'Paquetes', href: '#paquetes', icon: Package, id: 'paquetes' },
    { name: 'Galería', href: '#galeria', icon: ImageIcon, id: 'galeria' }
  ];

  // Función de scroll que NO interfiere con el navbar
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'instant'
      });
    }
  };

  return (
    <>
      {/* Fixed background image layer - mismo que packages */}
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
        className="relative h-[60vh] min-h-[500px] overflow-hidden bg-transparent"
        style={{ willChange: "auto" }}
      >
        {/* Dark overlay - mismo que packages */}
        <div className="absolute inset-0 bg-black/70 z-0" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            
            {/* Main Content Grid - 3 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              
              {/* Columna Izquierda - Logo y nombre */}
              <div className="text-center lg:text-left">
                <div className="flex flex-col items-center lg:items-start">
                  {/* Logo */}
                  <div className="mb-6">
                    <Image
                      src="/logo.png"
                      alt="Lion's Auto Detailing Logo"
                      width={120}
                      height={120}
                      className="w-auto h-24 lg:h-32"
                    />
                  </div>
                  
                  {/* Nombre de la empresa */}
                  <div className="mb-4">
                    <h2 className="text-2xl lg:text-3xl font-bold text-red-orange-500 mb-1">
                      LION'S AUTO
                    </h2>
                    <h3 className="text-xl lg:text-2xl font-bold text-white">
                      DETAILING
                    </h3>
                  </div>

                  {/* Copyright */}
                  <div className="mt-8">
                    <p className="text-gray-400 text-sm">
                      LION'S AUTO DETAILING © 2025
                    </p>
                  </div>
                </div>
              </div>

              {/* Columna Central - Links Útiles */}
              <div>
                <div className="text-center lg:text-left">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-8">
                    LINKS ÚTILES
                  </h3>
                  
                  <nav className="space-y-4">
                    {links.map((link, index) => {
                      const IconComponent = link.icon;
                      return (
                        <div key={index}>
                          <button
                            onClick={() => scrollToSection(link.id)}
                            className="flex items-center text-gray-300 hover:text-red-orange-500 transition-colors duration-300 text-lg group w-full justify-center lg:justify-start"
                          >
                            <IconComponent className="w-5 h-5 mr-3 text-red-orange-500 group-hover:scale-110 transition-transform duration-300" />
                            {link.name}
                          </button>
                        </div>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Columna Derecha - Información de Contacto */}
              <div>
                <div className="text-center lg:text-left">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-8">
                    INFORMACIÓN DE CONTACTO
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Ubicación */}
                    <div className="flex items-start justify-center lg:justify-start gap-3">
                      <MapPin className="w-5 h-5 text-red-orange-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-300 text-base leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                      </p>
                    </div>

                    {/* Teléfono */}
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <Phone className="w-5 h-5 text-red-orange-500 flex-shrink-0" />
                      <a 
                        href="tel:+50612345678"
                        className="text-gray-300 hover:text-red-orange-500 transition-colors duration-300 text-base"
                      >
                        +506 XXX XXX
                      </a>
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <Mail className="w-5 h-5 text-red-orange-500 flex-shrink-0" />
                      <a 
                        href="mailto:ejemplo@gmail.com"
                        className="text-gray-300 hover:text-red-orange-500 transition-colors duration-300 text-base"
                      >
                        ejemplo@gmail.com
                      </a>
                    </div>

                    {/* Redes Sociales */}
                    <div className="mt-8">
                      <div className="flex justify-center lg:justify-start gap-4">
                        {/* Facebook */}
                        <a
                          href="https://facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-300"
                          aria-label="Facebook"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>

                        {/* Instagram */}
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors duration-300"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>

                        {/* WhatsApp */}
                        <a
                          href="https://wa.me/50612345678"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors duration-300"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div 
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-orange-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>
      </section>
    </>
  );
};

export default ContactSection;