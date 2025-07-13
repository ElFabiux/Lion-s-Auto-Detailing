// app/api/booked-slots/route.js - API para ver citas agendadas
import { getBookedSlots, cancelSlot } from '@/lib/notion-availability';

/**
 * GET - Obtener todas las citas agendadas
 */
export async function GET() {
  try {
    const result = await getBookedSlots();
    
    if (result.success) {
      return Response.json({
        success: true,
        data: result.data,
        count: result.data.length,
        message: `${result.data.length} citas agendadas encontradas`
      });
    } else {
      return Response.json({
        success: false,
        error: result.error,
        suggestion: 'Verifica que NOTION_DATABASE_AVAILABILITY_ID esté configurado correctamente'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en API GET /api/booked-slots:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * DELETE - Cancelar una cita (liberar el slot)
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get('slotId');
    
    if (!slotId) {
      return Response.json({
        success: false,
        error: 'slotId es requerido'
      }, { status: 400 });
    }
    
    const result = await cancelSlot(slotId);
    
    if (result.success) {
      return Response.json({
        success: true,
        message: result.message,
        slotId: slotId
      });
    } else {
      return Response.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en API DELETE /api/booked-slots:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}

// Ejemplos de uso:
// GET /api/booked-slots - Ver todas las citas agendadas
// DELETE /api/booked-slots?slotId=abc123 - Cancelar una cita específica