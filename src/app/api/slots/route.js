// app/api/slots/route.js - Con rate limiting
import { getAvailableSlots } from '@/lib/notion';
import { withRateLimit } from '@/lib/rate-limiter';

async function getSlotsHandler(request) {
  try {
    const result = await getAvailableSlots();
    
    if (result.success) {
      return Response.json({
        success: true,
        data: result.data,
        message: `${result.data.length} horarios disponibles encontrados`
      });
    } else {
      return Response.json({
        success: false,
        error: result.error,
        suggestion: 'Verifica que NOTION_DATABASE_AVAILABILITY_ID esté configurado correctamente'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en API /api/slots:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}

export const GET = withRateLimit(getSlotsHandler, '/api/slots');