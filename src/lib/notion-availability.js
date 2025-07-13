// lib/notion-availability.js
// Funciones para la tabla de disponibilidad (ahora maneja toda la info del cliente)

import { Client } from '@notionhq/client';
import { getDatabaseId, validateNotionConfig, NOTION_CONFIG } from './notion-config';

// Inicializar cliente de Notion
const notion = new Client({
  auth: NOTION_CONFIG.token,
});

/**
 * Obtener todas las citas disponibles
 */
export async function getAvailableSlots() {
  try {
    validateNotionConfig(['availability']);
    
    const databaseId = getDatabaseId('availability');
    
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

    const slots = response.results.map(page => ({
      id: page.id,
      fecha: page.properties.Fecha?.date?.start || '',
      hora: page.properties.Hora?.rich_text?.[0]?.plain_text || '',
      dia: page.properties.Dia?.rich_text?.[0]?.plain_text || '',
      estado: page.properties.Estado?.select?.name || ''
    }));

    return {
      success: true,
      data: slots
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
 * Agendar una cita - actualiza el slot con toda la información del cliente y servicio
 */
export async function bookSlot(slotId, clientInfo, serviceInfo) {
  try {
    validateNotionConfig(['availability']);
    
    const updateProperties = {
      Estado: {
        select: {
          name: 'Ocupado'
        }
      },
      // Información del cliente
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
 * Cancelar una cita - liberar el slot
 */
export async function cancelSlot(slotId) {
  try {
    validateNotionConfig(['availability']);
    
    await notion.pages.update({
      page_id: slotId,
      properties: {
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
 * Obtener todas las citas agendadas (con Estado = Ocupado)
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

    const bookedSlots = response.results.map(page => ({
      id: page.id,
      fecha: page.properties.Fecha?.date?.start || '',
      hora: page.properties.Hora?.rich_text?.[0]?.plain_text || '',
      dia: page.properties.Dia?.rich_text?.[0]?.plain_text || '',
      cliente: page.properties.Cliente?.rich_text?.[0]?.plain_text || '',
      telefono: page.properties.Telefono?.rich_text?.[0]?.plain_text || '',
      email: page.properties.Email?.rich_text?.[0]?.plain_text || '',
      paquete: page.properties.Paquete?.rich_text?.[0]?.plain_text || '',
      vehiculo: page.properties.Vehiculo?.select?.name || '',
      precio: page.properties.Precio?.number || 0,
      mensaje: page.properties.Mensaje?.rich_text?.[0]?.plain_text || ''
    }));

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
        Dia: {
          rich_text: [
            {
              text: {
                content: slotData.dia
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
    console.error('Error al crear slot de disponibilidad:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// // lib/notion-availability.js
// // Funciones específicas para la tabla de disponibilidad de citas

// import { Client } from '@notionhq/client';
// import { getDatabaseId, validateNotionConfig, NOTION_CONFIG } from './notion-config';

// // Inicializar cliente de Notion
// const notion = new Client({
//   auth: NOTION_CONFIG.token,
// });

// /**
//  * Obtener todas las citas disponibles desde la tabla de disponibilidad
//  */
// export async function getAvailableSlots() {
//   try {
//     // Validar configuración requerida
//     validateNotionConfig(['availability']);
    
//     const databaseId = getDatabaseId('availability');
    
//     const response = await notion.databases.query({
//       database_id: databaseId,
//       filter: {
//         property: 'Estado',
//         select: {
//           equals: 'Disponible'
//         }
//       },
//       sorts: [
//         {
//           property: 'Fecha',
//           direction: 'ascending'
//         },
//         {
//           property: 'Hora',
//           direction: 'ascending'
//         }
//       ]
//     });

//     const slots = response.results.map(page => ({
//       id: page.id,
//       fecha: page.properties.Fecha?.date?.start || '',
//       hora: page.properties.Hora?.rich_text?.[0]?.plain_text || '',
//       dia: page.properties.Dia?.rich_text?.[0]?.plain_text || '',
//       estado: page.properties.Estado?.select?.name || ''
//     }));

//     return {
//       success: true,
//       data: slots
//     };
//   } catch (error) {
//     console.error('Error al obtener slots de disponibilidad:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

// /**
//  * Actualizar el estado de una cita en la tabla de disponibilidad
//  */
// export async function updateSlotStatus(slotId, status = 'Ocupado', clientInfo = null) {
//   try {
//     validateNotionConfig(['availability']);
    
//     const updateProperties = {
//       Estado: {
//         select: {
//           name: status
//         }
//       }
//     };
    
//     // Si se proporciona información del cliente, agregarla
//     if (clientInfo && status === 'Ocupado') {
//       updateProperties.Cliente = {
//         rich_text: [
//           {
//             text: {
//               content: clientInfo.name || ''
//             }
//           }
//         ]
//       };
      
//       updateProperties.Telefono = {
//         rich_text: [
//           {
//             text: {
//               content: clientInfo.phone || ''
//             }
//           }
//         ]
//       };
      
//       updateProperties.Email = {
//         rich_text: [
//           {
//             text: {
//               content: clientInfo.email || ''
//             }
//           }
//         ]
//       };
//     } else if (status === 'Disponible') {
//       // Limpiar información del cliente si se libera el slot
//       updateProperties.Cliente = { rich_text: [] };
//       updateProperties.Telefono = { rich_text: [] };
//       updateProperties.Email = { rich_text: [] };
//     }

//     await notion.pages.update({
//       page_id: slotId,
//       properties: updateProperties
//     });

//     return {
//       success: true,
//       message: `Slot actualizado a ${status} exitosamente`
//     };
//   } catch (error) {
//     console.error('Error al actualizar slot:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

// /**
//  * Crear un nuevo slot de disponibilidad
//  */
// export async function createAvailabilitySlot(slotData) {
//   try {
//     validateNotionConfig(['availability']);
    
//     const databaseId = getDatabaseId('availability');
    
//     const response = await notion.pages.create({
//       parent: {
//         database_id: databaseId
//       },
//       properties: {
//         Nombre: {
//           title: [
//             {
//               text: {
//                 content: `Cita ${slotData.fecha} ${slotData.hora}`
//               }
//             }
//           ]
//         },
//         Fecha: {
//           date: {
//             start: slotData.fecha
//           }
//         },
//         Hora: {
//           rich_text: [
//             {
//               text: {
//                 content: slotData.hora
//               }
//             }
//           ]
//         },
//         Dia: {
//           rich_text: [
//             {
//               text: {
//                 content: slotData.dia
//               }
//             }
//           ]
//         },
//         Estado: {
//           select: {
//             name: 'Disponible'
//           }
//         }
//       }
//     });

//     return {
//       success: true,
//       data: response
//     };
//   } catch (error) {
//     console.error('Error al crear slot de disponibilidad:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

// /**
//  * Obtener información detallada de un slot específico
//  */
// export async function getSlotDetails(slotId) {
//   try {
//     validateNotionConfig(['availability']);
    
//     const response = await notion.pages.retrieve({
//       page_id: slotId
//     });
    
//     const slot = {
//       id: response.id,
//       fecha: response.properties.Fecha?.date?.start || '',
//       hora: response.properties.Hora?.rich_text?.[0]?.plain_text || '',
//       dia: response.properties.Dia?.rich_text?.[0]?.plain_text || '',
//       estado: response.properties.Estado?.select?.name || '',
//       cliente: response.properties.Cliente?.rich_text?.[0]?.plain_text || '',
//       telefono: response.properties.Telefono?.rich_text?.[0]?.plain_text || '',
//       email: response.properties.Email?.rich_text?.[0]?.plain_text || ''
//     };
    
//     return {
//       success: true,
//       data: slot
//     };
//   } catch (error) {
//     console.error('Error al obtener detalles del slot:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }