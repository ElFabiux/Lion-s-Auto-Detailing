import HeroCarousel from '@/components/sections/HeroCarousel';
import ServicesSection from '@/components/sections/ServicesSection';
import PackagesSection from '@/components/sections/PackagesSection';
import GallerySection from '@/components/sections/GallerySection';
import ContactSection from '@/components/sections/ContactSection ';

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
      <ContactSection />

    </div>
  )
}