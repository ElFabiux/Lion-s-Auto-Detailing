import HeroCarousel from '@/components/sections/HeroCarousel';
import ServicesSection from '@/components/sections/ServicesSection';
import PackagesSection from '@/components/sections/PackagesSection';
import GallerySection from '@/components/sections/GallerySection';

export default function Home() {
  return (
    <div className="min-h-screen">
      
      {/* Sección Inicio - Carrusel */}
      <HeroCarousel />

      {/* Sección Servicios */}
      <ServicesSection />

      {/* Sección Paquetes */}
      <PackagesSection />

      {/* Sección Galería */}
      <GallerySection />

      {/* Sección Contáctanos */}
      <section id="contactanos" className="min-h-screen bg-primary-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary-white mb-4">Contáctanos</h2>
          <p className="text-gray-300">Contenido de contacto aquí</p>
        </div>
      </section>

    </div>
  )
}