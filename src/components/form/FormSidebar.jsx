'use client';

import Image from 'next/image';
import { User, Calendar, Settings, Check, ThumbsUp } from 'lucide-react';

const FormSidebar = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      title: "Información Personal",
      icon: User
    },
    {
      number: 2,
      title: "Fecha de la Cita",
      icon: Calendar
    },
    {
      number: 3,
      title: "Servicios a Ofrecer",
      icon: Settings
    },
    {
      number: 4,
      title: "Confirmar",
      icon: ThumbsUp
    }
  ];

  return (
    <>
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex w-80 bg-gradient-to-b from-woodsmoke-950 to-mine-shaft-950 p-8 flex-col border-r border-white/10">
        
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="Lion's Auto Detailing"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          <h1 className="text-red-orange-500 text-xl font-bold mb-1">LION'S AUTO</h1>
          <h2 className="text-white text-lg font-semibold tracking-wider">DETAILING</h2>
        </div>

        {/* Steps Desktop */}
        <div className="flex-1">
          <div className="space-y-6">
            {steps.map((step) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isDisabled = currentStep < step.number;

              return (
                <div
                  key={step.number}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-red-orange-500/20 border border-red-orange-500/30' 
                      : isCompleted 
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {/* Número del paso */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-red-orange-500 border-red-orange-500 text-white' 
                      : isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isDisabled 
                      ? 'border-gray-600 text-gray-600'
                      : 'border-white/20 text-white/60'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{step.number}</span>
                    )}
                  </div>

                  {/* Información del paso */}
                  <div className="flex-1">
                    <div className={`flex items-center gap-2 mb-1 transition-colors duration-300 ${
                      isActive 
                        ? 'text-red-orange-500' 
                        : isCompleted
                        ? 'text-green-400'
                        : isDisabled 
                        ? 'text-gray-600'
                        : 'text-white/60'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        Paso {step.number}
                      </span>
                    </div>
                    <h3 className={`text-sm font-semibold transition-colors duration-300 ${
                      isActive 
                        ? 'text-white' 
                        : isCompleted
                        ? 'text-green-400'
                        : isDisabled 
                        ? 'text-gray-600'
                        : 'text-white/60'
                    }`}>
                      {step.title}
                    </h3>
                  </div>

                  {/* Indicador de progreso */}
                  {isActive && (
                    <div className="w-2 h-2 bg-red-orange-500 rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer decorativo */}
        <div className="mt-8 text-center">
          <div className="text-xs text-white/40">
            Sistema de Agendamiento
          </div>
        </div>
      </div>

      {/* Header Mobile/Tablet */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-woodsmoke-950/95 to-mine-shaft-950/95 backdrop-blur-md border-b border-white/10 px-4 py-4">

        {/* Indicador de pasos móvil - Solo números */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isDisabled = currentStep < step.number;

              return (
                <div key={step.number} className="flex items-center">
                  {/* Número del paso */}
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 text-sm font-bold ${
                    isActive 
                      ? 'bg-red-orange-500 border-red-orange-500 text-white ring-2 ring-red-orange-500/30' 
                      : isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-600 text-gray-600 bg-gray-800/50'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>

                  {/* Línea conectora (excepto en el último paso) */}
                  {index < steps.length - 1 && (
                    <div className={`w-6 sm:w-8 h-0.5 transition-colors duration-300 ${
                      isCompleted 
                        ? 'bg-green-500' 
                        : isActive && index < currentStep - 1
                        ? 'bg-red-orange-500'
                        : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Información del paso actual */}
        <div className="text-center mt-3">
          <div className="text-sm font-medium text-white mb-1">
            {steps[currentStep - 1]?.title}
          </div>
        </div>
      </div>

      {/* Spacer para compensar el header fijo en móvil */}
      <div className="lg:hidden h-28 sm:h-32" />
    </>
  );
};

export default FormSidebar;