// lib/notion-availability.js
// Funciones para la tabla de disponibilidad (SIN campo "Dia")

import { Client } from '@notionhq/client';
import { getDatabaseId, validateNotionConfig, NOTION_CONFIG } from './notion-config';

// Inicializar cliente de Notion
const notion = new Client({
  auth: NOTION_CONFIG.token,
});

/**
 * Función auxiliar para calcular el día de la semana desde una fecha
 */
function calculateDayOfWeek(isoDate) {
  const date = new Date(isoDate + 'T00:00:00');
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[date.getDay()];
}

/**
 * Obtener todas las citas disponibles CON DÍA CALCULADO AUTOMÁTICAMENTE
 */
export async function getAvailableSlots() {
  try {
    validateNotionConfig(['availability']);
    
    const databaseId = getDatabaseId('availability');
    
    // Traer TODAS las citas con estado "Disponible"
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Estado',
        select: {
          equals: 'Disponible'
        }
      },
      sorts: [
        {
          property: 'Fecha',
          direction: 'ascending'
        },
        {
          property: 'Hora',
          direction: 'ascending'
        }
      ]
    });

    // Mapear resultados y CALCULAR el día automáticamente
    const allSlots = response.results.map(page => {
      const fecha = page.properties.Fecha?.date?.start || '';
      
      return {
        id: page.id,
        fecha: fecha,
        hora: page.properties.Hora?.rich_text?.[0]?.plain_text || '',
        dia: fecha ? calculateDayOfWeek(fecha) : '', // CALCULADO AUTOMÁTICAMENTE
        estado: page.properties.Estado?.select?.name || ''
      };
    });

    // FILTRAR SILENCIOSAMENTE: Solo incluir slots con campos obligatorios completos
    const validSlots = allSlots.filter(slot => {
      const hasDate = slot.fecha && slot.fecha.trim() !== '';
      const hasTime = slot.hora && slot.hora.trim() !== '';
      const hasStatus = slot.estado && slot.estado.trim() !== '';
      
      return hasDate && hasTime && hasStatus;
    });

    // Log silencioso para el desarrollador
    const excludedCount = allSlots.length - validSlots.length;
    if (excludedCount > 0) {
      console.log(`🔍 Filtrado automático: ${excludedCount} slots con campos incompletos excluidos silenciosamente`);
    }
    console.log(`✅ Devolviendo ${validSlots.length} slots válidos de ${allSlots.length} total (días calculados automáticamente)`);

    // SIEMPRE devolver éxito, incluso si no hay slots válidos
    return {
      success: true,
      data: validSlots
    };
  } catch (error) {
    console.error('Error al obtener slots de disponibilidad:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Agendar una cita - CON NOMBRE DEL CLIENTE EN EL TÍTULO
 */
export async function bookSlot(slotId, clientInfo, serviceInfo) {
  try {
    validateNotionConfig(['availability']);
    
    const updateProperties = {
      // NUEVO: Actualizar el título con el nombre del cliente
      Nombre: {
        title: [
          {
            text: {
              content: `${clientInfo.name}` // Solo el nombre del cliente
            }
          }
        ]
      },
      Estado: {
        select: {
          name: 'Ocupado'
        }
      },
      // Información básica del cliente
      Cliente: {
        rich_text: [
          {
            text: {
              content: clientInfo.name || ''
            }
          }
        ]
      },
      Telefono: {
        rich_text: [
          {
            text: {
              content: clientInfo.phone || ''
            }
          }
        ]
      },
      Email: {
        rich_text: [
          {
            text: {
              content: clientInfo.email || ''
            }
          }
        ]
      }
    };
    
    // Agregar información del servicio si está disponible
    if (serviceInfo?.selectedPackage) {
      updateProperties.Paquete = {
        rich_text: [
          {
            text: {
              content: serviceInfo.selectedPackage.name || ''
            }
          }
        ]
      };
      
      updateProperties.Precio = {
        number: serviceInfo.selectedPackage.prices?.[serviceInfo.selectedVehicle] || 0
      };
    }
    
    if (serviceInfo?.selectedVehicle) {
      const vehicleNames = {
        sedan: 'Sedán',
        suv: 'SUV',
        '4x4': '4x4'
      };
      
      updateProperties.Vehiculo = {
        select: {
          name: vehicleNames[serviceInfo.selectedVehicle] || 'Sedán'
        }
      };
    }
    
    if (serviceInfo?.additionalMessage) {
      updateProperties.Mensaje = {
        rich_text: [
          {
            text: {
              content: serviceInfo.additionalMessage
            }
          }
        ]
      };
    }

    await notion.pages.update({
      page_id: slotId,
      properties: updateProperties
    });

    return {
      success: true,
      message: 'Cita agendada exitosamente'
    };
  } catch (error) {
    console.error('Error al agendar cita:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Cancelar una cita - RESTAURAR TÍTULO ORIGINAL
 */
export async function cancelSlot(slotId) {
  try {
    validateNotionConfig(['availability']);
    
    // Primero obtener la información del slot para reconstruir el título original
    const slotResponse = await notion.pages.retrieve({
      page_id: slotId
    });
    
    const fecha = slotResponse.properties.Fecha?.date?.start || '';
    const hora = slotResponse.properties.Hora?.rich_text?.[0]?.plain_text || '';
    
    await notion.pages.update({
      page_id: slotId,
      properties: {
        // RESTAURAR título original con fecha y hora
        Nombre: {
          title: [
            {
              text: {
                content: `Cita ${fecha} ${hora}`
              }
            }
          ]
        },
        Estado: {
          select: {
            name: 'Disponible'
          }
        },
        Cliente: { rich_text: [] },
        Telefono: { rich_text: [] },
        Email: { rich_text: [] },
        Paquete: { rich_text: [] },
        Vehiculo: { select: null },
        Mensaje: { rich_text: [] },
        Precio: { number: null }
      }
    });

    return {
      success: true,
      message: 'Cita cancelada exitosamente'
    };
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtener todas las citas agendadas - CON DÍA CALCULADO
 */
export async function getBookedSlots() {
  try {
    validateNotionConfig(['availability']);
    
    const databaseId = getDatabaseId('availability');
    
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Estado',
        select: {
          equals: 'Ocupado'
        }
      },
      sorts: [
        {
          property: 'Fecha',
          direction: 'ascending'
        },
        {
          property: 'Hora',
          direction: 'ascending'
        }
      ]
    });

    const bookedSlots = response.results.map(page => {
      const fecha = page.properties.Fecha?.date?.start || '';
      
      return {
        id: page.id,
        fecha: fecha,
        hora: page.properties.Hora?.rich_text?.[0]?.plain_text || '',
        dia: fecha ? calculateDayOfWeek(fecha) : '', // CALCULADO AUTOMÁTICAMENTE
        cliente: page.properties.Cliente?.rich_text?.[0]?.plain_text || '',
        telefono: page.properties.Telefono?.rich_text?.[0]?.plain_text || '',
        email: page.properties.Email?.rich_text?.[0]?.plain_text || '',
        paquete: page.properties.Paquete?.rich_text?.[0]?.plain_text || '',
        vehiculo: page.properties.Vehiculo?.select?.name || '',
        precio: page.properties.Precio?.number || 0,
        mensaje: page.properties.Mensaje?.rich_text?.[0]?.plain_text || ''
      };
    });

    return {
      success: true,
      data: bookedSlots
    };
  } catch (error) {
    console.error('Error al obtener citas agendadas:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Crear un nuevo slot de disponibilidad - SIN campo "Dia"
 */
export async function createAvailabilitySlot(slotData) {
  try {
    validateNotionConfig(['availability']);
    
    const databaseId = getDatabaseId('availability');
    
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId
      },
      properties: {
        Nombre: {
          title: [
            {
              text: {
                content: `Cita ${slotData.fecha} ${slotData.hora}`
              }
            }
          ]
        },
        Fecha: {
          date: {
            start: slotData.fecha
          }
        },
        Hora: {
          rich_text: [
            {
              text: {
                content: slotData.hora
              }
            }
          ]
        },
        // YA NO incluir campo "Dia" - se calcula automáticamente
        Estado: {
          select: {
            name: 'Disponible'
          }
        }
      }
    });

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Error al crear slot de disponibilidad:', error);
    return {
      success: false,
      error: error.message
    };
  }
}