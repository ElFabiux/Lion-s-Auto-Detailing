'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);
  const [targetSection, setTargetSection] = useState(null);
  const isAutoScrolling = useRef(false);

  const navItems = [
    { name: 'Inicio', href: '#inicio', id: 'inicio' },
    { name: 'Servicios', href: '#servicios', id: 'servicios' },
    { name: 'Paquetes', href: '#paquetes', id: 'paquetes' },
    { name: 'Galería', href: '#galeria', id: 'galeria' },
    { name: 'Contáctanos', href: '#contactanos', id: 'contactanos' },
  ];

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
    const handleScroll = () => {
      // Si estamos en scroll automático y hay una sección objetivo, no actualizar
      if (isAutoScrolling.current && targetSection) {
        return;
      }

      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(navItems[index].id);
            
            // Si llegamos a la sección objetivo, limpiar el estado
            if (targetSection === navItems[index].id) {
              setTargetSection(null);
              isAutoScrolling.current = false;
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetSection]);

  // Función para scroll suave
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Marcar que estamos en scroll automático
      isAutoScrolling.current = true;
      setTargetSection(sectionId);
      
      const offsetTop = element.offsetTop - 80;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Después de un tiempo prudencial, asegurarse de que el scroll automático termine
      setTimeout(() => {
        isAutoScrolling.current = false;
        setActiveSection(sectionId);
        setTargetSection(null);
      }, 1000);
    }
  };

  // Determinar qué sección debe mostrarse activa
  const getActiveClass = (itemId) => {
    // Si hay una sección objetivo (click en nav), solo esa se muestra activa
    if (targetSection) {
      return itemId === targetSection;
    }
    // Si no, usar la sección actual basada en scroll
    return itemId === activeSection;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-primary-black-95 backdrop-blur-md shadow-lg' 
        : 'bg-primary-black'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105" 
            onClick={() => scrollToSection('inicio')}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-auto h-10"
            />
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                    getActiveClass(item.id)
                      ? 'text-red-orange-500'
                      : 'text-primary-white hover:text-primary-red'
                  }`}
                >
                  {item.name}
                  
                  {/* Underline animation */}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-red transform transition-transform duration-300 ${
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
              className="bg-primary-red text-primary-white px-6 py-2 rounded-lg font-medium 
                       transition-all duration-300 hover:bg-primary-red hover:shadow-red hover:scale-105
                       active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2"
            >
              📅 Agendar Cita
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
        className="text-primary-white hover:text-primary-red transition-colors duration-300 p-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-primary-black border border-primary-gray rounded-lg shadow-lg animate-slide-down">
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
                    ? 'text-primary-red bg-primary-gray'
                    : 'text-primary-white hover:text-primary-red hover:bg-primary-gray'
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="border-t border-primary-gray mt-2 pt-2">
              <Link
                href="/agendar-cita"
                className="block w-full text-left px-4 py-2 text-sm text-primary-white hover:text-primary-red transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                📅 Agendar Cita
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