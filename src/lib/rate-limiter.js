const rateLimitStore = new Map();

const RATE_LIMITS = {
  '/api/slots': { window: 60000, max: 15 }, // 10 requests por minuto
  '/api/book-appointment': { window: 300000, max: 3 }, // 3 reservas por 5 minutos
  '/api/booked-slots': { window: 60000, max: 10 }, // 5 requests por minuto
  'global': { window: 60000, max: 20 } // Límite global por IP
};

export function rateLimit(identifier, endpoint = 'global') {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.global;
  const key = `${endpoint}:${identifier}`;
  const now = Date.now();
  
  // Obtener o crear registro
  const record = rateLimitStore.get(key) || { count: 0, resetTime: now + config.window };
  
  // Reset si ha pasado la ventana de tiempo
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + config.window;
  }
  
  // Verificar límite
  if (record.count >= config.max) {
    const timeUntilReset = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      error: 'Rate limit exceeded',
      retryAfter: timeUntilReset,
      limit: config.max,
      remaining: 0
    };
  }
  
  // Incrementar contador
  record.count++;
  rateLimitStore.set(key, record);
  
  return {
    success: true,
    limit: config.max,
    remaining: config.max - record.count,
    resetTime: record.resetTime
  };
}

// Limpiar registros expirados (ejecutar periódicamente)
export function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Función para obtener IP del cliente en Next.js App Router
function getClientIP(request) {
  // Para Next.js App Router, usar el objeto Request nativo
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  // En desarrollo local, usar una IP fija
  return process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'unknown';
}

// Middleware para Next.js App Router
export function withRateLimit(handler, endpoint) {
  return async (request, context) => {
    try {
      // Obtener IP del cliente
      const clientIP = getClientIP(request);
      
      console.log(`🔍 Rate limit check - IP: ${clientIP}, Endpoint: ${endpoint}`);
      
      // Verificar rate limit
      const rateLimitResult = rateLimit(clientIP, endpoint);
      
      if (!rateLimitResult.success) {
        console.warn(`🚨 Rate limit exceeded - IP: ${clientIP}, Endpoint: ${endpoint}`);
        
        return Response.json({
          success: false,
          error: 'Demasiadas solicitudes. Intente nuevamente en unos momentos.',
          retryAfter: rateLimitResult.retryAfter,
          code: 'RATE_LIMIT_EXCEEDED'
        }, { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'Retry-After': rateLimitResult.retryAfter.toString()
          }
        });
      }
      
      // Continuar con el handler original
      const response = await handler(request, context);
      
      // Agregar headers de rate limiting a la respuesta exitosa
      if (response instanceof Response) {
        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      }
      
      return response;
    } catch (error) {
      console.error('Error en rate limiter:', error);
      // Si hay error en el rate limiter, continuar sin bloquear
      return handler(request, context);
    }
  };
}

// Sistema de bloqueo para prevenir race conditions en reservas
const reservationLocks = new Map();

export function withReservationLock(handler) {
  return async (request, context) => {
    try {
      const body = await request.json();
      const slotId = body.slotId;
      
      if (!slotId) {
        return Response.json({
          success: false,
          error: 'slotId es requerido'
        }, { status: 400 });
      }
      
      // Verificar si el slot está siendo procesado
      if (reservationLocks.has(slotId)) {
        console.warn(`Slot ${slotId} ya está siendo procesado`);
        return Response.json({
          success: false,
          error: 'Este horario está siendo procesado por otro usuario. Intente en unos segundos.',
          code: 'SLOT_BEING_PROCESSED'
        }, { status: 409 });
      }
      
      // Bloquear el slot
      reservationLocks.set(slotId, Date.now());
      console.log(`Slot ${slotId} bloqueado para procesamiento`);
      
      try {
        // Recrear el request con el body parseado para el handler
        const newRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(body)
        });
        
        // Ejecutar el handler original
        const result = await handler(newRequest, context);
        return result;
      } finally {
        // Liberar el bloqueo
        reservationLocks.delete(slotId);
        console.log(`Slot ${slotId} liberado`);
      }
    } catch (error) {
      console.error('Error en reservation lock:', error);
      // Si hay error, asegurar que se libere el bloqueo
      if (body?.slotId) {
        reservationLocks.delete(body.slotId);
      }
      throw error;
    }
  };
}

// Limpiar bloqueos antiguos (ejecutar periódicamente)
export function cleanupOldLocks() {
  const now = Date.now();
  const LOCK_TIMEOUT = 30000; // 30 segundos
  
  for (const [slotId, timestamp] of reservationLocks) {
    if (now - timestamp > LOCK_TIMEOUT) {
      reservationLocks.delete(slotId);
    }
  }
}

// Inicializar limpieza automática
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cleanupExpiredRecords();
    cleanupOldLocks();
  }, 60000); // Limpiar cada minuto
}