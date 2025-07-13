// app/api/services/route.js - API para gestionar servicios
import { getActiveServices, getServiceById, createService, updateService } from '@/lib/notion-services';

/**
 * GET - Obtener servicios activos
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');
    
    let result;
    
    if (serviceId) {
      // Obtener un servicio específico
      result = await getServiceById(serviceId);
    } else {
      // Obtener todos los servicios activos
      result = await getActiveServices();
    }
    
    if (result.success) {
      return Response.json({
        success: true,
        data: result.data,
        count: Array.isArray(result.data) ? result.data.length : 1
      });
    } else {
      return Response.json({
        success: false,
        error: result.error,
        suggestion: 'Verifica que NOTION_DATABASE_SERVICES_ID esté configurado correctamente'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en API GET /api/services:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * POST - Crear un nuevo servicio
 */
export async function POST(request) {
  try {
    const serviceData = await request.json();
    
    // Validar datos requeridos
    if (!serviceData.nombre) {
      return Response.json({
        success: false,
        error: 'El nombre del servicio es requerido'
      }, { status: 400 });
    }
    
    const result = await createService(serviceData);
    
    if (result.success) {
      return Response.json({
        success: true,
        message: 'Servicio creado exitosamente',
        serviceId: result.serviceId,
        data: result.data
      });
    } else {
      return Response.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en API POST /api/services:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * PATCH - Actualizar un servicio existente
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { serviceId, ...serviceData } = body;
    
    if (!serviceId) {
      return Response.json({
        success: false,
        error: 'serviceId es requerido'
      }, { status: 400 });
    }
    
    const result = await updateService(serviceId, serviceData);
    
    if (result.success) {
      return Response.json({
        success: true,
        message: result.message,
        serviceId: serviceId
      });
    } else {
      return Response.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en API PATCH /api/services:', error);
    return Response.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}

// Ejemplos de uso:
// GET /api/services - Todos los servicios activos
// GET /api/services?id=abc123 - Un servicio específico
// POST /api/services { "nombre": "Lavado Premium", "precio_sedan": 50000, ... }
// PATCH /api/services { "serviceId": "abc123", "precio_sedan": 55000 }