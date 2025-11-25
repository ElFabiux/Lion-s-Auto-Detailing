import { getBookedSlots, cancelSlot } from '@/lib/notion';
import { withRateLimit } from '@/lib/rate-limiter';

async function getBookedSlotsHandler(request) {
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
        suggestion: 'Verificar que NOTION_DATABASE_AVAILABILITY_ID esté configurado correctamente'
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

async function cancelSlotHandler(request) {
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

export const GET = withRateLimit(getBookedSlotsHandler, '/api/booked-slots');
export const DELETE = withRateLimit(cancelSlotHandler, '/api/booked-slots');