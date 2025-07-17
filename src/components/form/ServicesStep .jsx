'use client';

import ServiceCard from './ServiceCard';
// Importar iconos de React Icons
import { FaShieldAlt } from 'react-icons/fa'; // PPF - Escudo
import { MdCleaningServices } from 'react-icons/md'; // Pulido de parabrisas
import { FaPaintBrush } from 'react-icons/fa'; // Corrección de pintura
import { MdEventSeat } from 'react-icons/md'; // Tapicería
import { FaLightbulb } from 'react-icons/fa'; // Pulido de faros
import { GiSparkles } from 'react-icons/gi'; // Aplicación de cerámico

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: "PPF",
      description: "Lámina protectora invisible que se adhiere perfectamente a las partes más vulnerables de tu auto como manijas, bordes de puertas, faros y pantallas. Funciona como un escudo transparente que previene rayones, golpes menores y el desgaste del uso diario, manteniendo tu vehículo como nuevo.",
      icon: FaShieldAlt
    },
    {
      id: 2,
      title: "PULIDO DE PARABRISAS",
      description: "Restauración profesional de parabrisas rayados o dañados. Eliminamos rayones menores, marcas de limpiaparabrisas y pequeñas astillas para mejorar la visibilidad y claridad del vidrio, evitando costosos reemplazos y garantizando una conducción más segura.",
      icon: MdCleaningServices
    },
    {
      id: 3,
      title: "CORRECCIÓN DE PINTURA",
      description: "Eliminación profesional de rayones, remolinos y defectos de la pintura. Restauramos el brillo original y preparamos la superficie para tratamientos de protección de larga duración.",
      icon: FaPaintBrush
    },
    {
      id: 4,
      title: "TAPICERÍA COMPLETA",
      description: "Limpieza profunda de asientos, alfombras y paneles con técnicas especializadas para eliminar manchas, olores y bacterias, dejando la tapicería como nueva y protegida.",
      icon: MdEventSeat
    },
    {
      id: 5,
      title: "PULIDO DE FAROS",
      description: "Restauración de faros opacos o amarillentos, mejorando su transparencia y aumentando la visibilidad nocturna.",
      icon: FaLightbulb
    },
    {
      id: 6,
      title: "APLICACIÓN DE CERÁMICO",
      description: "Protección avanzada para la pintura de tu auto con recubrimiento cerámico, que repele agua, suciedad y rayos UV, brindando un acabado brillante y duradero.",
      icon: GiSparkles
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-white-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-woodsmoke-950 mb-6">
            NUESTROS SERVICIOS
          </h2>
          <p className="text-xl text-red-orange-500 max-w-3xl mx-auto leading-relaxed">
            Ofrecemos servicios de alta calidad para la limpieza de su vehículo
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;