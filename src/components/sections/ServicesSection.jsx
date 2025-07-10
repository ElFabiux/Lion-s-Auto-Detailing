'use client';

import ServiceCard from './ServiceCard';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: "LAVADO EXTERIOR",
      description: "Limpieza profunda del exterior de tu vehículo, incluyendo carrocería, llantas y vidrios, utilizando productos especializados para eliminar suciedad y proteger la pintura."
    },
    {
      id: 2,
      title: "LAVADO DE MOTOR",
      description: "Limpieza segura y detallada del compartimento del motor, retirando grasa, polvo y residuos para mejorar su funcionamiento y apariencia."
    },
    {
      id: 3,
      title: "LIMPIEZA INTERIOR",
      description: "Aspirado, limpieza de superficies y tratamiento de tapicería para eliminar manchas, olores y dejar el interior de tu auto como nuevo."
    },
    {
      id: 4,
      title: "TAPICERÍA COMPLETA",
      description: "Limpieza profunda de asientos, alfombras y paneles con técnicas especializadas para eliminar manchas, olores y bacterias, dejando la tapicería como nueva y protegida."
    },
    {
      id: 5,
      title: "PULIDO DE FAROS",
      description: "Restauración de faros opacos o amarillentos, mejorando su transparencia y aumentando la visibilidad nocturna."
    },
    {
      id: 6,
      title: "APLICACIÓN DE CERÁMICO",
      description: "Protección avanzada para la pintura de tu auto con recubrimiento cerámico, que repele agua, suciedad y rayos UV, brindando un acabado brillante y duradero."
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