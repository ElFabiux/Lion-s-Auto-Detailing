'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail, ArrowRight, X } from 'lucide-react';

const PersonalInfoStep = ({ data, updateData, onNext, onExit }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const CHARACTER_LIMITS = {
    name: 25,   
    email: 70,  
    phone: 8    
  };

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Validación nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.length > CHARACTER_LIMITS.name) {
      newErrors.name = `El nombre no puede exceder ${CHARACTER_LIMITS.name} caracteres`;
    }

    // Validación teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{8}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'El teléfono debe tener exactamente 8 dígitos';
    }

    // Validación email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    } else if (formData.email.length > CHARACTER_LIMITS.email) {
      newErrors.email = `El correo no puede exceder ${CHARACTER_LIMITS.email} caracteres`;
    }

    return newErrors;
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;

    // Aplicar límites de caracteres
    if (field === 'name' && value.length > CHARACTER_LIMITS.name) {
      processedValue = value.slice(0, CHARACTER_LIMITS.name);
    } else if (field === 'email' && value.length > CHARACTER_LIMITS.email) {
      processedValue = value.slice(0, CHARACTER_LIMITS.email);
    }

    const newData = { ...formData, [field]: processedValue };
    setFormData(newData);
    updateData(newData);

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = () => {
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const formatPhone = (value) => {
    // Remover todo excepto números
    const numbers = value.replace(/\D/g, '');
    // Limitar a 8 dígitos
    const limited = numbers.slice(0, 8);
    // Formatear como XXXX-XXXX
    if (limited.length > 4) {
      return `${limited.slice(0, 4)}-${limited.slice(4)}`;
    }
    return limited;
  };

  const getCharacterCountColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage < 70) return 'text-white/60';
    if (percentage < 90) return 'text-yellow-400';
    return 'text-red-400';
  };


  const shouldShowCharacterCount = (current, max) => {
    return (current / max) > 0.7; // Mostrar cuando esté al 70% o más
  };

  return (
    <div className={`transition-all duration-700 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            INGRESE SU INFORMACIÓN
          </h2>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            PERSONAL
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-red-orange-500 mx-auto rounded-full" />
        </div>

        {/* Form Fields */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Nombre */}
          <div className="group">
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
                <User className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                  formData.name ? 'text-red-orange-500' : 'text-white/40'
                }`} />
              </div>
              <input
                type="text"
                placeholder="Nombre/Apodo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                maxLength={CHARACTER_LIMITS.name}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-orange-500 focus:border-transparent text-sm sm:text-base ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20 hover:border-white/30'
                }`}
              />
              {formData.name && formData.name.length >= 2 && (
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            {/* Character count para nombre */}
            <div className="flex justify-between items-center mt-2">
              {errors.name && (
                <p className="text-red-400 text-xs sm:text-sm animate-fadeIn px-1 flex-1">{errors.name}</p>
              )}
              {shouldShowCharacterCount(formData.name.length, CHARACTER_LIMITS.name) && (
                <span className={`text-xs transition-colors duration-300 ${getCharacterCountColor(formData.name.length, CHARACTER_LIMITS.name)}`}>
                  {formData.name.length}/{CHARACTER_LIMITS.name}
                </span>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="group">
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Phone className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                  formData.phone ? 'text-red-orange-500' : 'text-white/40'
                }`} />
              </div>
              <input
                type="tel"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                maxLength={9} // Incluye el guión
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-orange-500 focus:border-transparent text-sm sm:text-base ${
                  errors.phone 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20 hover:border-white/30'
                }`}
              />
              {formData.phone && formData.phone.replace(/[-\s]/g, '').length === 8 && (
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            {/* Indicador de progreso para teléfono */}
            <div className="flex justify-between items-center mt-2">
              {errors.phone && (
                <p className="text-red-400 text-xs sm:text-sm animate-fadeIn px-1 flex-1">{errors.phone}</p>
              )}
              {formData.phone && !errors.phone && (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                          i < formData.phone.replace(/[-\s]/g, '').length
                            ? 'bg-green-500'
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/60">
                    {formData.phone.replace(/[-\s]/g, '').length}/8
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Correo */}
          <div className="group">
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Mail className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                  formData.email ? 'text-red-orange-500' : 'text-white/40'
                }`} />
              </div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                maxLength={CHARACTER_LIMITS.email}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-orange-500 focus:border-transparent text-sm sm:text-base ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20 hover:border-white/30'
                }`}
              />
              {formData.email && /\S+@\S+\.\S+/.test(formData.email) && (
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            {/* Character count para email */}
            <div className="flex justify-between items-center mt-2">
              {errors.email && (
                <p className="text-red-400 text-xs sm:text-sm animate-fadeIn px-1 flex-1">{errors.email}</p>
              )}
              {shouldShowCharacterCount(formData.email.length, CHARACTER_LIMITS.email) && (
                <span className={`text-xs transition-colors duration-300 ${getCharacterCountColor(formData.email.length, CHARACTER_LIMITS.email)}`}>
                  {formData.email.length}/{CHARACTER_LIMITS.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-8 sm:mt-10 gap-3 sm:gap-4">
          {/* Exit Button */}
          <button
            onClick={onExit}
            className="group flex items-center justify-center gap-2 px-3 py-3 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm min-w-[48px] sm:min-w-auto"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">SALIR</span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="group flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-3 bg-red-orange-500 hover:bg-red-orange-600 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-red-orange-500/25 min-w-[48px] sm:min-w-auto"
          >
            <span className="hidden sm:inline">SIGUIENTE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-red-orange-500 rounded-full animate-pulse" />
            <span className="text-xs text-white/60">Paso 1 de 4</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PersonalInfoStep;