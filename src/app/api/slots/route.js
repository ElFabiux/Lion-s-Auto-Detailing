// app/api/slots/route.js - Versión simplificada
import { getAvailableSlots } from '@/lib/notion';

export async function GET() {
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

// import { getAvailableSlots } from '@/lib/notion-availability';

// export async function GET() {
//   try {
//     const result = await getAvailableSlots();
    
//     if (result.success) {
//       return Response.json({
//         success: true,
//         data: result.data,
//         message: `${result.data.length} horarios disponibles encontrados`
//       });
//     } else {
//       return Response.json({
//         success: false,
//         error: result.error,
//         suggestion: 'Verifica que NOTION_DATABASE_AVAILABILITY_ID esté configurado correctamente'
//       }, { status: 500 });
//     }
//   } catch (error) {
//     console.error('Error en API /api/slots:', error);
//     return Response.json({
//       success: false,
//       error: 'Error interno del servidor',
//       details: error.message
//     }, { status: 500 });
//   }
// }