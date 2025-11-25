import '../globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata = {
  title: 'Agendar Cita - Lion\'s Auto Detailing',
  description: 'Agenda tu cita para nuestros servicios de detailing automotriz',
}

export default function BookingLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}