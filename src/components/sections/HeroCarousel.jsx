'use client';

import { useState, useEffect } from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlayKey, setAutoPlayKey] = useState(0); // Key para reiniciar el auto-play

  const slides = [
    {
      id: 1,
      title: "¡AGENDE SU CITA YA!",
      description: "Reserve su turno ahora y experimente la comodidad de un servicio personalizado sin esperas ni contratiempos. Su tiempo es valioso y nosotros lo respetamos, por eso le ofrecemos esta opción conveniente y rápida para que pueda organizar su día con total confianza.",
      backgroundImage: "/carousel-1.jpg", // Imagen del Toyota
      hasButton: true,
      buttonText: "Agendar",
      buttonIcon: Calendar,
      buttonAction: "schedule"
    },
    {
      id: 2,
      title: "MANTENIMIENTO DIARIO",
      description: "Nuestro servicio de mantenimiento diario está diseñado para mantener tu auto en perfectas condiciones todos los días. Ideal para conductores que utilizan su vehículo frecuentemente y desean conservar su apariencia impecable.",
      backgroundImage: "/carousel-2.jpg", // Imagen de la persona limpiando
      hasButton: true,
      buttonText: "Contactar",
      buttonIcon: MessageCircle,
      buttonAction: "contact"
    },
    {
      id: 3,
      title: "TODO EN UN SOLO LUGAR PARA TU VEHÍCULO",
      description: "Ofrecemos todos los servicios que tu auto necesita en un mismo lugar, desde lavado exterior e interior hasta tratamientos especializados, garantizando comodidad, calidad y resultados impecables sin que tengas que moverte de aquí.",
      backgroundImage: "/carousel-3.jpg", // Imagen del Mitsubishi Triton
      hasButton: false
    }
  ];

  // Auto-play del carrusel con reinicio cuando el usuario navega manualmente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Cambia cada 6 segundos

    return () => clearInterval(interval);
  }, [slides.length, autoPlayKey]); // Se reinicia cuando cambia autoPlayKey

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoPlayKey(prev => prev + 1); // Reinicia el auto-play
  };

  const goToPrevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    setAutoPlayKey(prev => prev + 1); // Reinicia el auto-play
  };

  const goToNextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
    setAutoPlayKey(prev => prev + 1); // Reinicia el auto-play
  };

  const handleButtonClick = (action) => {
    if (action === 'schedule') {
      // Redirigir a la página de agendar cita
      window.location.href = '/agendar-cita';
    } else if (action === 'contact') {
      // Abrir WhatsApp (reemplaza con tu número)
      window.open('https://wa.me/50688275168?text=Hola, me interesa el servicio de mantenimiento diario', '_blank');
    }
  };

  return (
    <section id="inicio" className="relative h-[85vh] sm:h-[90vh] md:h-[92vh] lg:h-[88vh] xl:h-[85vh] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Imagen de fondo */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.backgroundImage})` }}
            />
            
            {/* Overlay oscuro para mejorar legibilidad */}
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Contenido */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-7xl mx-auto">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
                  {slide.title}
                </h1>
                
                <p className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto leading-relaxed px-2 sm:px-0">
                  {slide.description}
                </p>
                
                {/* Botón (solo para las primeras dos slides) */}
                {slide.hasButton && (
                  <button
                    onClick={() => handleButtonClick(slide.buttonAction)}
                    className="inline-flex items-center gap-2 sm:gap-3 bg-red-orange-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg
                             transition-all duration-300 hover:bg-red-orange-600 hover:shadow-red hover:scale-105
                             active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-orange-500 focus:ring-offset-2
                             shadow-lg"
                  >
                    <slide.buttonIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    {slide.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores de puntos */}
      <div className="absolute bottom-4 xs:bottom-5 sm:bottom-6 md:bottom-8 lg:bottom-10 xl:bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-red-orange-500 scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Flechas de navegación */}
      <div className="absolute inset-y-0 left-2 xs:left-3 sm:left-4 md:left-6 lg:left-8 flex items-center z-20">
        <button
          onClick={goToPrevSlide}
          className="p-2 sm:p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 
                     hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-orange-500 backdrop-blur-sm"
          aria-label="Slide anterior"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute inset-y-0 right-2 xs:right-3 sm:right-4 md:right-6 lg:right-8 flex items-center z-20">
        <button
          onClick={goToNextSlide}
          className="p-2 sm:p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 
                     hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-orange-500 backdrop-blur-sm"
          aria-label="Siguiente slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;