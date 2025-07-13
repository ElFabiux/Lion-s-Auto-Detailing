// lib/notion.js
// Funciones simplificadas para UNA SOLA base de datos

import { Client } from '@notionhq/client';

// Inicializar cliente de Notion
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_AVAILABILITY_ID;

/**
 * Función auxiliar para calcular el día de la semana desde una fecha
 */
function calculateDayOfWeek(isoDate) {
  const date = new Date(isoDate + 'T00:00:00');
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[date.getDay()];
}

/**
 * Obtener todas las citas disponibles
 */
export async function getAvailableSlots() {
  try {
    if (!DATABASE_ID) {
      throw new Error('NOTION_DATABASE_AVAILABILITY_ID no está configurado');
    }
    
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
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

    // Mapear resultados y calcular el día automáticamente
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

    // Filtrar slots con campos completos
    const validSlots = allSlots.filter(slot => {
      const hasDate = slot.fecha && slot.fecha.trim() !== '';
      const hasTime = slot.hora && slot.hora.trim() !== '';
      const hasStatus = slot.estado && slot.estado.trim() !== '';
      
      return hasDate && hasTime && hasStatus;
    });

    console.log(`✅ Devolviendo ${validSlots.length} slots válidos de ${allSlots.length} total`);

    return {
      success: true,
      data: validSlots
    };
  } catch (error) {
    console.error('Error al obtener slots:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Agendar una cita
 */
export async function bookSlot(slotId, clientInfo, serviceInfo) {
  try {
    if (!DATABASE_ID) {
      throw new Error('NOTION_DATABASE_AVAILABILITY_ID no está configurado');
    }
    
    const updateProperties = {
      // Actualizar el título con el nombre del cliente
      Nombre: {
        title: [
          {
            text: {
              content: `${clientInfo.name}`
            }
          }
        ]
      },
      Estado: {
        select: {
          name: 'Ocupado'
        }
      },
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
 * Cancelar una cita
 */
export async function cancelSlot(slotId) {
  try {
    if (!DATABASE_ID) {
      throw new Error('NOTION_DATABASE_AVAILABILITY_ID no está configurado');
    }
    
    // Obtener información del slot para restaurar título
    const slotResponse = await notion.pages.retrieve({
      page_id: slotId
    });
    
    const fecha = slotResponse.properties.Fecha?.date?.start || '';
    const hora = slotResponse.properties.Hora?.rich_text?.[0]?.plain_text || '';
    
    await notion.pages.update({
      page_id: slotId,
      properties: {
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
 * Obtener todas las citas agendadas
 */
export async function getBookedSlots() {
  try {
    if (!DATABASE_ID) {
      throw new Error('NOTION_DATABASE_AVAILABILITY_ID no está configurado');
    }
    
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
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
        dia: fecha ? calculateDayOfWeek(fecha) : '',
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
 * Crear un nuevo slot de disponibilidad
 */
export async function createSlot(slotData) {
  try {
    if (!DATABASE_ID) {
      throw new Error('NOTION_DATABASE_AVAILABILITY_ID no está configurado');
    }
    
    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID
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
    console.error('Error al crear slot:', error);
    return {
      success: false,
      error: error.message
    };
  }
}