'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);
  const [targetSection, setTargetSection] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAutoScrolling = useRef(false);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('down');
  const autoScrollTimer = useRef(null);

  const navItems = [
    { name: 'Inicio', href: '#inicio', id: 'inicio' },
    { name: 'Servicios', href: '#servicios', id: 'servicios' },
    { name: 'Paquetes', href: '#paquetes', id: 'paquetes' },
    { name: 'Galería', href: '#galeria', id: 'galeria' },
    { name: 'Contáctanos', href: '#contactanos', id: 'contactanos' },
  ];

  // Efecto para marcar cuando el componente está hidratado
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Detectar cuando se abre/cierra un modal
  useEffect(() => {
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    // Escuchar eventos personalizados para detectar modales
    window.addEventListener('modalOpen', handleModalOpen);
    window.addEventListener('modalClose', handleModalClose);

    // También detectar por cambios en el body overflow (método alternativo)
    const observer = new MutationObserver(() => {
      const bodyOverflow = document.body.style.overflow;
      setIsModalOpen(bodyOverflow === 'hidden');
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => {
      window.removeEventListener('modalOpen', handleModalOpen);
      window.removeEventListener('modalClose', handleModalClose);
      observer.disconnect();
    };
  }, []);

  // Detectar scroll para efecto del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detectar sección activa mientras se hace scroll
  useEffect(() => {
    if (!isHydrated) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Detectar dirección del scroll
      if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = 'down';
      } else {
        scrollDirection.current = 'up';
      }
      lastScrollY.current = currentScrollY;

      // Si estamos en scroll automático, no actualizar activeSection
      if (isAutoScrolling.current && targetSection) {
        return;
      }

      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;
      
      // Verificar si estamos al final de la página para activar "Contáctanos"
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = (windowHeight + window.scrollY) >= (documentHeight - 10);

      if (isAtBottom) {
        setActiveSection('contactanos');
        return;
      }

      // Lógica normal para detectar sección activa
      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(navItems[index].id);
          }
        }
      });
    };

    // Ejecutar una vez al inicio para establecer la sección correcta
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetSection, isHydrated]);

  // Función para scroll suave
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    // Limpiar timer anterior si existe
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }

    // Marcar que estamos en scroll automático
    isAutoScrolling.current = true;
    setTargetSection(sectionId);
    
    // Inmediatamente cambiar a la sección objetivo para evitar parpadeos
    setActiveSection(sectionId);
    
    let offsetTop;
    
    // Si es "Contáctanos", ir al final de la página
    if (sectionId === 'contactanos') {
      offsetTop = document.documentElement.scrollHeight - window.innerHeight;
    } else {
      offsetTop = element.offsetTop - 80;
    }
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });

    // Timer más largo para asegurar que el scroll automático termine
    autoScrollTimer.current = setTimeout(() => {
      isAutoScrolling.current = false;
      setTargetSection(null);
      
      // Verificar la posición final y ajustar si es necesario
      const finalScrollCheck = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const isAtBottom = (windowHeight + window.scrollY) >= (documentHeight - 10);
        
        if (sectionId === 'contactanos' && !isAtBottom) {
          // Si intentamos ir a contactanos pero no llegamos al final, ajustar
          window.scrollTo({
            top: document.documentElement.scrollHeight - window.innerHeight,
            behavior: 'smooth'
          });
        }
      };
      
      setTimeout(finalScrollCheck, 100);
    }, 1500);
  };

  // Determinar qué sección debe mostrarse activa
  const getActiveClass = (itemId) => {
    // Durante la hidratación, no mostrar ninguna sección activa para evitar mismatch
    if (!isHydrated) {
      return false;
    }
    
    // Si hay una sección objetivo (click en nav), solo esa se muestra activa
    if (targetSection) {
      return itemId === targetSection;
    }
    
    // Si no, usar la sección actual basada en scroll
    return itemId === activeSection;
  };

  // Cleanup del timer al desmontar
  useEffect(() => {
    return () => {
      if (autoScrollTimer.current) {
        clearTimeout(autoScrollTimer.current);
      }
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      isScrolled 
        ? 'bg-woodsmoke-950/90 backdrop-blur-md shadow-lg' 
        : 'bg-woodsmoke-950'
    } ${
      isModalOpen 
        ? 'opacity-0 pointer-events-none' 
        : 'opacity-100 pointer-events-auto'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            className="shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105" 
            onClick={() => scrollToSection('inicio')}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="w-auto h-14 sm:h-16"
            />
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative group cursor-pointer ${
                    getActiveClass(item.id)
                      ? 'text-red-orange-500'
                      : 'text-white-50 hover:text-red-orange-500'
                  }`}
                >
                  {item.name}
                  
                  {/* Underline animation */}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-orange-500 transform transition-transform duration-300 ${
                    getActiveClass(item.id) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link
              href="/agendar-cita"
              className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm
                       bg-red-orange-500 text-white-50 
                       border border-red-orange-500
                       transition-all duration-300 ease-in-out
                       hover:bg-red-orange-600 hover:border-red-orange-600 
                       hover:shadow-lg hover:shadow-red-orange-500/25
                       hover:-translate-y-0.5
                       active:translate-y-0 active:shadow-md active:shadow-red-orange-500/20
                       focus:outline-none focus:ring-2 focus:ring-red-orange-500/50 focus:ring-offset-2 focus:ring-offset-woodsmoke-950"
            >
              <Calendar className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Agendar Cita</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileMenu 
              navItems={navItems} 
              getActiveClass={getActiveClass} 
              scrollToSection={scrollToSection} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Componente para el menú móvil
const MobileMenu = ({ navItems, getActiveClass, scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white-50 hover:text-red-orange-500 transition-colors duration-300 p-2 rounded-lg hover:bg-mine-shaft-950"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-woodsmoke-950 border border-mine-shaft-950 rounded-lg shadow-lg animate-slide-down">
          <div className="py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-300 ${
                  getActiveClass(item.id)
                    ? 'text-red-orange-500 bg-mine-shaft-950'
                    : 'text-white-50 hover:text-red-orange-500 hover:bg-mine-shaft-950'
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="border-t border-mine-shaft-950 mt-2 pt-2">
              <Link
                href="/agendar-cita"
                className="group flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-white-50 hover:text-red-orange-500 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                <Calendar className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Agendar Cita</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el menú */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Navbar;