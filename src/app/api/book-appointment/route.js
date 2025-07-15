// app/api/book-appointment/route.js - Con verificación de disponibilidad
import { bookSlot, getSlotById } from '@/lib/notion';

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

    console.log('📝 Verificando disponibilidad del slot:', slotId);
    
    // NUEVA VERIFICACIÓN: Comprobar si el slot sigue disponible
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
      }, { status: 409 }); // 409 Conflict
    }

    console.log('✅ Slot disponible, procediendo con el agendamiento');
    
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

// // app/api/book-appointment/route.js - Versión simplificada
// import { bookSlot } from '@/lib/notion';

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { slotId, personalInfo, services, dateTime } = body;

//     // Validar datos requeridos
//     if (!slotId || !personalInfo || !services || !dateTime) {
//       return Response.json({
//         success: false,
//         error: 'Datos incompletos',
//         missing: {
//           slotId: !slotId,
//           personalInfo: !personalInfo,
//           services: !services,
//           dateTime: !dateTime
//         }
//       }, { status: 400 });
//     }

//     // Validar información personal
//     if (!personalInfo.name || !personalInfo.phone || !personalInfo.email) {
//       return Response.json({
//         success: false,
//         error: 'Información personal incompleta',
//         missing: {
//           name: !personalInfo.name,
//           phone: !personalInfo.phone,
//           email: !personalInfo.email
//         }
//       }, { status: 400 });
//     }

//     console.log('📝 Agendando cita en slot:', slotId);
    
//     const result = await bookSlot(slotId, personalInfo, services);
    
//     if (result.success) {
//       console.log('✅ Cita agendada exitosamente');
      
//       return Response.json({
//         success: true,
//         message: result.message,
//         appointmentDetails: {
//           client: personalInfo.name,
//           date: dateTime.selectedDate,
//           time: dateTime.selectedTime,
//           package: services.selectedPackage?.name,
//           vehicle: services.selectedVehicle,
//           price: services.selectedPackage?.prices?.[services.selectedVehicle]
//         }
//       });
//     } else {
//       console.error('❌ Error agendando cita:', result.error);
      
//       return Response.json({
//         success: false,
//         error: result.error
//       }, { status: 500 });
//     }
    
//   } catch (error) {
//     console.error('❌ Error en API /api/book-appointment:', error);
//     return Response.json({
//       success: false,
//       error: 'Error interno del servidor',
//       details: error.message,
//       suggestion: 'Verifica que NOTION_DATABASE_AVAILABILITY_ID esté configurado correctamente'
//     }, { status: 500 });
//   }
// }