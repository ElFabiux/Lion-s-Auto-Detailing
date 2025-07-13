// lib/notion-appointments.js
// Funciones específicas para la tabla de citas agendadas

import { Client } from '@notionhq/client';
import { getDatabaseId, validateNotionConfig, NOTION_CONFIG } from './notion-config';

// Inicializar cliente de Notion
const notion = new Client({
  auth: NOTION_CONFIG.token,
});

/**
 * Crear una nueva cita agendada en la tabla de appointments
 */
export async function createAppointment(appointmentData) {
  try {
    // Validar configuración requerida
    validateNotionConfig(['appointments']);
    
    const databaseId = getDatabaseId('appointments');
    
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId
      },
      properties: {
        // Título de la cita
        Titulo: {
          title: [
            {
              text: {
                content: `Cita - ${appointmentData.personalInfo.name} - ${appointmentData.dateTime.selectedDate}`
              }
            }
          ]
        },
        
        // Información del cliente
        Cliente: {
          rich_text: [
            {
              text: {
                content: appointmentData.personalInfo.name
              }
            }
          ]
        },
        
        Telefono: {
          rich_text: [
            {
              text: {
                content: appointmentData.personalInfo.phone
              }
            }
          ]
        },
        
        Email: {
          rich_text: [
            {
              text: {
                content: appointmentData.personalInfo.email
              }
            }
          ]
        },
        
        // Información de fecha y hora
        Fecha: {
          date: {
            start: convertToISODate(appointmentData.dateTime.selectedDate)
          }
        },
        
        Hora: {
          rich_text: [
            {
              text: {
                content: appointmentData.dateTime.selectedTime
              }
            }
          ]
        },
        
        // Información del servicio
        Paquete: {
          rich_text: [
            {
              text: {
                content: appointmentData.services.selectedPackage?.name || ''
              }
            }
          ]
        },
        
        Vehiculo: {
          select: {
            name: getVehicleName(appointmentData.services.selectedVehicle)
          }
        },
        
        Precio: {
          number: appointmentData.services.selectedPackage?.prices?.[appointmentData.services.selectedVehicle] || 0
        },
        
        // Mensaje adicional
        Mensaje: {
          rich_text: [
            {
              text: {
                content: appointmentData.services.additionalMessage || ''
              }
            }
          ]
        },
        
        // Estado de la cita
        Estado: {
          select: {
            name: 'Confirmada'
          }
        },
        
        // ID del slot de disponibilidad relacionado
        SlotID: {
          rich_text: [
            {
              text: {
                content: appointmentData.dateTime.slotId || ''
              }
            }
          ]
        }
      }
    });

    return {
      success: true,
      data: response,
      appointmentId: response.id
    };
  } catch (error) {
    console.error('Error al crear cita:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtener todas las citas agendadas
 */
export async function getAppointments(filters = {}) {
  try {
    validateNotionConfig(['appointments']);
    
    const databaseId = getDatabaseId('appointments');
    
    let queryOptions = {
      database_id: databaseId,
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
    };
    
    // Agregar filtros si se proporcionan
    if (filters.estado) {
      queryOptions.filter = {
        property: 'Estado',
        select: {
          equals: filters.estado
        }
      };
    }
    
    if (filters.fecha) {
      queryOptions.filter = {
        property: 'Fecha',
        date: {
          equals: filters.fecha
        }
      };
    }
    
    const response = await notion.databases.query(queryOptions);
    
    const appointments = response.results.map(page => ({
      id: page.id,
      cliente: page.properties.Cliente?.rich_text?.[0]?.plain_text || '',
      telefono: page.properties.Telefono?.rich_text?.[0]?.plain_text || '',
      email: page.properties.Email?.rich_text?.[0]?.plain_text || '',
      fecha: page.properties.Fecha?.date?.start || '',
      hora: page.properties.Hora?.rich_text?.[0]?.plain_text || '',
      paquete: page.properties.Paquete?.rich_text?.[0]?.plain_text || '',
      vehiculo: page.properties.Vehiculo?.select?.name || '',
      precio: page.properties.Precio?.number || 0,
      mensaje: page.properties.Mensaje?.rich_text?.[0]?.plain_text || '',
      estado: page.properties.Estado?.select?.name || '',
      slotId: page.properties.SlotID?.rich_text?.[0]?.plain_text || '',
      fechaCreacion: page.created_time
    }));

    return {
      success: true,
      data: appointments
    };
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Actualizar el estado de una cita
 */
export async function updateAppointmentStatus(appointmentId, newStatus) {
  try {
    validateNotionConfig(['appointments']);
    
    await notion.pages.update({
      page_id: appointmentId,
      properties: {
        Estado: {
          select: {
            name: newStatus
          }
        }
      }
    });

    return {
      success: true,
      message: `Cita actualizada a ${newStatus} exitosamente`
    };
  } catch (error) {
    console.error('Error al actualizar estado de cita:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Funciones auxiliares
 */
function convertToISODate(dateString) {
  // Convertir de DD/MM/YYYY a YYYY-MM-DD
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function getVehicleName(vehicleKey) {
  const vehicleNames = {
    sedan: 'Sedán',
    suv: 'SUV',
    '4x4': '4x4'
  };
  return vehicleNames[vehicleKey] || 'Sedán';
}