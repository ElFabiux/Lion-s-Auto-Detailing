// app/api/book-appointment/route.js - Versión sin alert nativo
import { bookSlot } from '@/lib/notion-availability';

export async function POST(request) {
  try {
    const body = await request.json();
    const { slotId, personalInfo, services, dateTime } = body;

    // Validar datos requeridos
    if (!slotId || !personalInfo || !services || !dateTime) {
      return Response.json({
        success: false,
        error: 'Datos incompletos',
        missing: {
          slotId: !slotId,
          personalInfo: !personalInfo,
          services: !services,
          dateTime: !dateTime
        }
      }, { status: 400 });
    }

    // Validar información personal
    if (!personalInfo.name || !personalInfo.phone || !personalInfo.email) {
      return Response.json({
        success: false,
        error: 'Información personal incompleta',
        missing: {
          name: !personalInfo.name,
          phone: !personalInfo.phone,
          email: !personalInfo.email
        }
      }, { status: 400 });
    }

    console.log('📝 Agendando cita en slot:', slotId);
    
    // Agendar la cita - actualiza el slot con toda la información
    const result = await bookSlot(slotId, personalInfo, services);
    
    if (result.success) {
      console.log('✅ Cita agendada exitosamente');
      
      return Response.json({
        success: true,
        message: result.message,
        appointmentDetails: {
          client: personalInfo.name,
          date: dateTime.selectedDate,
          time: dateTime.selectedTime,
          package: services.selectedPackage?.name,
          vehicle: services.selectedVehicle,
          price: services.selectedPackage?.prices?.[services.selectedVehicle]
        }
      });
    } else {
      console.error('❌ Error agendando cita:', result.error);
      
      return Response.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error en API /api/book-appointment:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message,
      suggestion: 'Verifica que NOTION_DATABASE_AVAILABILITY_ID esté configurado correctamente'
    }, { status: 500 });
  }
}