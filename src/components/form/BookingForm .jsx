'use client';

import { useState } from 'react';
import FormSidebar from './FormSidebar';
import PersonalInfoStep from './PersonalInfoStep';
import DateTimeStep from './DateTimeStep ';
import ServicesStep from './ServicesStep ';
import ConfirmationStep from './ConfirmationStep';

const BookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      phone: '',
      email: ''
    },
    dateTime: {
      selectedDate: null,
      selectedTime: null,
      slotId: null // ID del slot en Notion
    },
    services: {
      selectedPackage: null,
      selectedVehicle: 'sedan',
      additionalMessage: ''
    }
  });

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const exitForm = () => {
    window.location.href = '/';
  };

  const submitForm = async () => {
    try {
      setIsSubmitting(true);

      // Validar que tenemos todos los datos necesarios
      if (!formData.dateTime.slotId || !formData.personalInfo.name || !formData.services.selectedPackage) {
        throw new Error('Datos incompletos para agendar la cita');
      }

      // Enviar datos a la API
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: formData.dateTime.slotId,
          personalInfo: formData.personalInfo,
          services: formData.services,
          dateTime: formData.dateTime
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Mostrar mensaje de éxito
        alert('¡Cita agendada exitosamente! Te contactaremos pronto para confirmar los detalles.');
        
        // Redirigir al inicio
        window.location.href = '/';
      } else {
        throw new Error(result.error || 'Error al agendar la cita');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            updateData={(data) => updateFormData('personalInfo', data)}
            onNext={nextStep}
            onExit={exitForm}
          />
        );
      case 2:
        return (
          <DateTimeStep
            data={formData.dateTime}
            updateData={(data) => updateFormData('dateTime', data)}
            onNext={nextStep}
            onPrev={prevStep}
            onExit={exitForm}
          />
        );
      case 3:
        return (
          <ServicesStep
            data={formData.services}
            updateData={(data) => updateFormData('services', data)}
            onNext={nextStep}
            onPrev={prevStep}
            onExit={exitForm}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            formData={formData}
            onSubmit={submitForm}
            onPrev={prevStep}
            onExit={exitForm}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-woodsmoke-950 via-mine-shaft-950 to-woodsmoke-950 overflow-hidden">
      {/* Layout Desktop con Sidebar */}
      <div className="hidden lg:flex h-full">
        {/* Sidebar izquierdo */}
        <FormSidebar currentStep={currentStep} />
        
        {/* Área del formulario derecho */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-2xl">
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Layout Mobile/Tablet */}
      <div className="lg:hidden h-full flex flex-col">
        {/* Header móvil con indicador de pasos - FIJO */}
        <FormSidebar currentStep={currentStep} />
        
        {/* Área del formulario - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6 pt-8 pb-12">
            <div className="w-full max-w-lg">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-red-orange-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default BookingForm;