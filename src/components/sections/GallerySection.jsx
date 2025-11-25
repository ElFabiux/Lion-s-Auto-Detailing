"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";

const GallerySection = () => {
  const [activeTab, setActiveTab] = useState("exterior");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Datos de las imágenes
  const galleryData = {
    exterior: [
      {
        id: 1,
        src: "/exterior-gallery/gallery-exterior-1.jpg",
        alt: "Lavado exterior completo - Vista frontal",
        title: "Lavado Premium Exterior",
        description: "Resultado impecable con tratamiento especializado",
      },
      {
        id: 2,
        src: "/exterior-gallery/gallery-exterior-2.jpg",
        alt: "Detalle de Faros",
        title: "Faros Opacos?",
        description: "No es un problema!",
      },
      {
        id: 3,
        src: "/exterior-gallery/gallery-exterior-3.jpg",
        alt: "Faros detallados",
        title: "Brillo Perfecto",
        description: "Cada rincón con atención especial",
      },
      {
        id: 4,
        src: "/exterior-gallery/gallery-exterior-4.jpg",
        alt: "Tratamiento cerámico aplicado",
        title: "Tratamiento Cerámico",
        description: "Protección duradera y brillo intenso",
      },
      {
        id: 5,
        src: "/exterior-gallery/gallery-exterior-5.jpg",
        alt: "Vista lateral completa",
        title: "Resultado Final",
        description: "Vehículo completamente renovado",
      },
      {
        id: 6,
        src: "/exterior-gallery/gallery-exterior-6.jpg",
        alt: "Detalles",
        title: "Detalles Perfectos",
        description: "Cuidamos cada detalle para que tu auto luzca como nuevo",
      },
    ],
    interior: [
      {
        id: 7,
        src: "/interior-gallery/gallery-interior-1.jpg",
        alt: "Interior completamente limpio",
        title: "Limpieza Profunda Interior",
        description: "Aspirado y detallado completo",
      },
      {
        id: 8,
        src: "/interior-gallery/gallery-interior-2.jpg",
        alt: "Asientos renovados",
        title: "Renovación de Asientos",
        description: "Limpieza especializada de tapicería",
      },
      {
        id: 9,
        src: "/interior-gallery/gallery-interior-3.jpg",
        alt: "Resultados Sorprendentes",
        title: "Resultados Sorprendentes",
        description: "Ven ya!",
      },
      {
        id: 10,
        src: "/interior-gallery/gallery-interior-4.jpg",
        alt: "Alfombras como nuevas",
        title: "Alfombras Renovadas",
        description: "Extracción profunda de suciedad",
      },
      {
        id: 11,
        src: "/interior-gallery/gallery-interior-5.jpg",
        alt: "Detalles de puertas",
        title: "Paneles de Puertas",
        description: "Limpieza de cada detalle interior",
      },
      {
        id: 12,
        src: "/interior-gallery/gallery-interior-6.jpg",
        alt: "Todo se limpa",
        title: "No hay nada que falte",
        description: "Resultado profesional garantizado",
      },
    ],
  };

  const currentImages = galleryData[activeTab];

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % currentImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(currentImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex =
      currentImageIndex === 0
        ? currentImages.length - 1
        : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(currentImages[prevIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentImageIndex]);

  return (
    <>
      <section
        ref={sectionRef}
        id="galeria"
        className="relative min-h-screen bg-white py-20"
      >
        <div className="relative z-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div
              className={`text-center mb-16 transition-all duration-1000 delay-300 relative z-0 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-woodsmoke-950 mb-4">
                GALERÍA DE RESULTADOS
              </h2>
              <p className="text-lg sm:text-xl text-red-orange-500 max-w-2xl mx-auto">
                Descubre la calidad de nuestro trabajo a través de estos
                resultados reales
              </p>
            </div>

            <div
              className={`flex justify-center mb-16 transition-all duration-1000 delay-500 relative z-0 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="relative bg-woodsmoke-950 rounded-full p-2 border border-mine-shaft-800">
                {/* Sliding background indicator */}
                <div
                  className={`absolute top-2 bottom-2 bg-red-orange-500 rounded-full transition-all duration-300 ease-out ${
                    activeTab === "exterior"
                      ? "left-2 right-1/2 mr-1"
                      : "left-1/2 right-2 ml-1"
                  }`}
                />

                <div className="relative flex">
                  {[
                    { key: "exterior", label: "Exterior" },
                    { key: "interior", label: "Interior" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative z-10 px-8 py-3 font-semibold transition-all duration-300 rounded-full ${
                        activeTab === tab.key
                          ? "text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              key={activeTab}
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 relative z-0 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {currentImages.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => openModal(image, index)}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: isVisible
                      ? `slideInUp 0.8s ease-out forwards`
                      : "none",
                  }}
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                      <p className="text-sm text-gray-300 mb-4">
                        {image.description}
                      </p>
                      <div className="flex items-center gap-2 text-red-orange-500">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Ver imagen completa
                        </span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-red-orange-500/20 rounded-full backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-5 h-5 text-red-orange-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fadeIn z-[99998]"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center animate-modalSlideIn z-[99999]">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-[100000] text-white hover:text-red-orange-500 transition-colors duration-200 p-3 bg-black/50 rounded-full backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[100000] text-white hover:text-red-orange-500 transition-colors duration-200 p-3 bg-black/50 rounded-full backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[100000] text-white hover:text-red-orange-500 transition-colors duration-200 p-3 bg-black/50 rounded-full backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image container */}
            <div className="relative max-w-full max-h-full">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl font-bold mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-300">{selectedImage.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-red-orange-500 text-sm">
                    {currentImageIndex + 1} de {currentImages.length}
                  </span>
                  <div className="flex gap-2">
                    {currentImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          index === currentImageIndex
                            ? "bg-red-orange-500"
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-modalSlideIn {
          animation: modalSlideIn 0.4s ease-out;
        }

        /* COMENTARIO: Z-index jerarquía para evitar conflictos:
           - Contenido de galería: z-0 (0)
           - Modal de galería: z-[99999] (99999)
           - Controles del modal: z-[100000] (100000)
           
           Esto asegura que los modales de galería también estén
           por encima del navbar y títulos de sección.
        */
      `}</style>
    </>
  );
};

export default GallerySection;