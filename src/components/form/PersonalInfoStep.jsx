'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail, ArrowRight, X } from 'lucide-react';

const PersonalInfoStep = ({ data, updateData, onNext, onExit }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{8}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 8 dígitos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }

    return newErrors;
  };

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
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
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-orange-500 focus:border-transparent text-sm sm:text-base ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20 hover:border-white/30'
                }`}
              />
              {formData.name && (
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs sm:text-sm mt-2 animate-fadeIn px-1">{errors.name}</p>
            )}
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
            {errors.phone && (
              <p className="text-red-400 text-xs sm:text-sm mt-2 animate-fadeIn px-1">{errors.phone}</p>
            )}
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
                placeholder="Correo"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
            {errors.email && (
              <p className="text-red-400 text-xs sm:text-sm mt-2 animate-fadeIn px-1">{errors.email}</p>
            )}
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
            {/* Texto solo visible en pantallas grandes */}
            <span className="hidden sm:inline">SALIR</span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="group flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-3 bg-red-orange-500 hover:bg-red-orange-600 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-red-orange-500/25 min-w-[48px] sm:min-w-auto"
          >
            {/* Texto solo visible en pantallas grandes */}
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