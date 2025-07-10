export default function Home() {
  return (
    <div className="min-h-screen">
      
      {/* Sección Inicio */}
      <section id="inicio" className="min-h-screen bg-primary-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary-white mb-4">
            Bienvenido a <span className="text-primary-red">Tu Empresa</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Descripción de tu empresa y servicios principales
          </p>
        </div>
      </section>

      {/* Sección Servicios */}
      <section id="servicios" className="min-h-screen bg-primary-gray flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary-white mb-4">Servicios</h2>
          <p className="text-gray-300">Contenido de servicios aquí</p>
        </div>
      </section>

      {/* Sección Paquetes */}
      <section id="paquetes" className="min-h-screen bg-primary-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary-white mb-4">Paquetes</h2>
          <p className="text-gray-300">Contenido de paquetes aquí</p>
        </div>
      </section>

      {/* Sección Galería */}
      <section id="galeria" className="min-h-screen bg-primary-gray flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary-white mb-4">Galería</h2>
          <p className="text-gray-300">Contenido de galería aquí</p>
        </div>
      </section>

      {/* Sección Contáctanos */}
      <section id="contactanos" className="min-h-screen bg-primary-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary-white mb-4">Contáctanos</h2>
          <p className="text-gray-300">Contenido de contacto aquí</p>
        </div>
      </section>

    </div>
  )
}