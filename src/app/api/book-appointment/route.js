import { bookSlot, getSlotById } from '@/lib/notion';
import { withRateLimit, withReservationLock } from '@/lib/rate-limiter';

async function bookAppointmentHandler(request) {
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
    
    // Verificación de disponibilidad (con doble verificación para mayor seguridad)
    const slotCheck = await getSlotById(slotId);
    
    if (!slotCheck.success) {
      console.error('❌ Error al verificar slot:', slotCheck.error);
      return Response.json({
        success: false,
        error: 'Error al verificar la disponibilidad del horario',
        code: 'VERIFICATION_ERROR'
      }, { status: 500 });
    }

    // Verificar si el slot ya fue ocupado
    if (slotCheck.data.estado !== 'Disponible') {
      console.warn('⚠️ Slot ya ocupado:', slotId);
      return Response.json({
        success: false,
        error: 'La cita seleccionada ya fue ocupada por otro cliente',
        code: 'SLOT_UNAVAILABLE',
        slotData: {
          fecha: slotCheck.data.fecha,
          hora: slotCheck.data.hora,
          estado: slotCheck.data.estado
        }
      }, { status: 409 });
    }
    
    // Verificación adicional justo antes de reservar (para máxima seguridad)
    const finalCheck = await getSlotById(slotId);
    if (!finalCheck.success || finalCheck.data.estado !== 'Disponible') {
      return Response.json({
        success: false,
        error: 'El horario fue ocupado mientras se procesaba su solicitud',
        code: 'SLOT_UNAVAILABLE',
        slotData: finalCheck.data
      }, { status: 409 });
    }
    
    const result = await bookSlot(slotId, personalInfo, services);
    
    if (result.success) {
      
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
        error: result.error,
        code: 'BOOKING_ERROR'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error en API /api/book-appointment:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message,
      code: 'INTERNAL_ERROR',
      suggestion: 'Verifica que NOTION_DATABASE_AVAILABILITY_ID esté configurado correctamente'
    }, { status: 500 });
  }
}

// Aplicar rate limiting y bloqueo de slots
export const POST = withRateLimit(
  withReservationLock(bookAppointmentHandler),
  '/api/book-appointment'
);