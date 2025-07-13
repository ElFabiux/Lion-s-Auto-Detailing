// app/api/appointments/route.js - API para gestionar citas agendadas
import { getAppointments, updateAppointmentStatus } from '@/lib/notion-appointments';

/**
 * GET - Obtener todas las citas agendadas
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const fecha = searchParams.get('fecha');
    
    const filters = {};
    if (estado) filters.estado = estado;
    if (fecha) filters.fecha = fecha;
    
    const result = await getAppointments(filters);
    
    if (result.success) {
      return Response.json({
        success: true,
        data: result.data,
        count: result.data.length,
        filters: filters
      });
    } else {
      return Response.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en API GET /api/appointments:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * PATCH - Actualizar estado de una cita
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { appointmentId, newStatus } = body;
    
    if (!appointmentId || !newStatus) {
      return Response.json({
        success: false,
        error: 'appointmentId y newStatus son requeridos'
      }, { status: 400 });
    }
    
    const validStatuses = ['Confirmada', 'En Proceso', 'Completada', 'Cancelada', 'No Show'];
    if (!validStatuses.includes(newStatus)) {
      return Response.json({
        success: false,
        error: `Estado no válido. Estados permitidos: ${validStatuses.join(', ')}`
      }, { status: 400 });
    }
    
    const result = await updateAppointmentStatus(appointmentId, newStatus);
    
    if (result.success) {
      return Response.json({
        success: true,
        message: result.message,
        appointmentId: appointmentId,
        newStatus: newStatus
      });
    } else {
      return Response.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en API PATCH /api/appointments:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}

// Ejemplos de uso:
// GET /api/appointments - Todas las citas
// GET /api/appointments?estado=Confirmada - Solo citas confirmadas
// GET /api/appointments?fecha=2025-01-15 - Citas de una fecha específica
// PATCH /api/appointments { "appointmentId": "abc123", "newStatus": "Completada" }