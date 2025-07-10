'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

const PackageCard = ({ pkg, index }) => {
  return (
    <div
      className={`relative group transform transition-all duration-500 hover:scale-105 ${
        pkg.featured ? 'md:scale-110 lg:scale-105 lg:hover:scale-110' : ''
      }`}
    >
      {/* Featured badge */}
      {pkg.featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-red-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            MÁS POPULAR
          </div>
        </div>
      )}

      {/* Card */}
      <div className={`${pkg.cardBg} backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl transition-all duration-300 ${
        pkg.featured ? 'ring-2 ring-red-orange-500/50' : ''
      }`}>
        
        {/* Package Icon */}
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full bg-gradient-to-r ${pkg.color} shadow-lg`}>
            <pkg.icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Package Name */}
        <h3 className={`text-2xl font-bold text-center mb-4 bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}>
          {pkg.name}
        </h3>

        {/* Price */}
        <div className="text-center mb-8">
          <span className="text-4xl font-bold text-white">{pkg.price}</span>
        </div>

        {/* Services List */}
        <ul className="space-y-3 mb-8">
          {pkg.services.map((service, serviceIndex) => (
            <li key={serviceIndex} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-red-orange-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{service}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          href="/agendar-cita"
          className={`block w-full text-center py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            pkg.featured 
              ? 'bg-red-orange-500 hover:bg-red-orange-600' 
              : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
          }`}
        >
          Solicitar
        </Link>
      </div>

      {/* Decorative elements - Removed red shadow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </div>
  );
};

export default PackageCard;