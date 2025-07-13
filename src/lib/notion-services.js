// lib/notion-services.js
// Funciones para la tabla de servicios

import { Client } from '@notionhq/client';
import { getDatabaseId, validateNotionConfig, NOTION_CONFIG } from './notion-config';

// Inicializar cliente de Notion
const notion = new Client({
  auth: NOTION_CONFIG.token,
});

/**
 * Obtener todos los servicios activos
 */
export async function getActiveServices() {
  try {
    validateNotionConfig(['services']);
    
    const databaseId = getDatabaseId('services');
    
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Activo',
        checkbox: {
          equals: true
        }
      },
      sorts: [
        {
          property: 'Orden',
          direction: 'ascending'
        }
      ]
    });

    const services = response.results.map(page => ({
      id: page.id,
      nombre: page.properties.Nombre?.title?.[0]?.plain_text || '',
      descripcion: page.properties.Descripcion?.rich_text?.[0]?.plain_text || '',
      precio_sedan: page.properties.Precio_Sedan?.number || 0,
      precio_suv: page.properties.Precio_SUV?.number || 0,
      precio_4x4: page.properties.Precio_4x4?.number || 0,
      duracion: page.properties.Duracion?.number || 60,
      categoria: page.properties.Categoria?.select?.name || '',
      activo: page.properties.Activo?.checkbox || false,
      orden: page.properties.Orden?.number || 0,
      // Crear objeto de precios compatible con el frontend
      prices: {
        sedan: page.properties.Precio_Sedan?.number || 0,
        suv: page.properties.Precio_SUV?.number || 0,
        '4x4': page.properties.Precio_4x4?.number || 0
      }
    }));

    return {
      success: true,
      data: services
    };
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtener un servicio específico por ID
 */
export async function getServiceById(serviceId) {
  try {
    validateNotionConfig(['services']);
    
    const response = await notion.pages.retrieve({
      page_id: serviceId
    });
    
    const service = {
      id: response.id,
      nombre: response.properties.Nombre?.title?.[0]?.plain_text || '',
      descripcion: response.properties.Descripcion?.rich_text?.[0]?.plain_text || '',
      precio_sedan: response.properties.Precio_Sedan?.number || 0,
      precio_suv: response.properties.Precio_SUV?.number || 0,
      precio_4x4: response.properties.Precio_4x4?.number || 0,
      duracion: response.properties.Duracion?.number || 60,
      categoria: response.properties.Categoria?.select?.name || '',
      activo: response.properties.Activo?.checkbox || false,
      orden: response.properties.Orden?.number || 0,
      prices: {
        sedan: response.properties.Precio_Sedan?.number || 0,
        suv: response.properties.Precio_SUV?.number || 0,
        '4x4': response.properties.Precio_4x4?.number || 0
      }
    };
    
    return {
      success: true,
      data: service
    };
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Crear un nuevo servicio
 */
export async function createService(serviceData) {
  try {
    validateNotionConfig(['services']);
    
    const databaseId = getDatabaseId('services');
    
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId
      },
      properties: {
        Nombre: {
          title: [
            {
              text: {
                content: serviceData.nombre || ''
              }
            }
          ]
        },
        Descripcion: {
          rich_text: [
            {
              text: {
                content: serviceData.descripcion || ''
              }
            }
          ]
        },
        Precio_Sedan: {
          number: serviceData.precio_sedan || 0
        },
        Precio_SUV: {
          number: serviceData.precio_suv || 0
        },
        Precio_4x4: {
          number: serviceData.precio_4x4 || 0
        },
        Duracion: {
          number: serviceData.duracion || 60
        },
        Categoria: {
          select: {
            name: serviceData.categoria || 'General'
          }
        },
        Activo: {
          checkbox: serviceData.activo !== false
        },
        Orden: {
          number: serviceData.orden || 0
        }
      }
    });

    return {
      success: true,
      data: response,
      serviceId: response.id
    };
  } catch (error) {
    console.error('Error al crear servicio:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Actualizar un servicio existente
 */
export async function updateService(serviceId, serviceData) {
  try {
    validateNotionConfig(['services']);
    
    const updateProperties = {};
    
    if (serviceData.nombre !== undefined) {
      updateProperties.Nombre = {
        title: [{ text: { content: serviceData.nombre } }]
      };
    }
    
    if (serviceData.descripcion !== undefined) {
      updateProperties.Descripcion = {
        rich_text: [{ text: { content: serviceData.descripcion } }]
      };
    }
    
    if (serviceData.precio_sedan !== undefined) {
      updateProperties.Precio_Sedan = { number: serviceData.precio_sedan };
    }
    
    if (serviceData.precio_suv !== undefined) {
      updateProperties.Precio_SUV = { number: serviceData.precio_suv };
    }
    
    if (serviceData.precio_4x4 !== undefined) {
      updateProperties.Precio_4x4 = { number: serviceData.precio_4x4 };
    }
    
    if (serviceData.duracion !== undefined) {
      updateProperties.Duracion = { number: serviceData.duracion };
    }
    
    if (serviceData.categoria !== undefined) {
      updateProperties.Categoria = { select: { name: serviceData.categoria } };
    }
    
    if (serviceData.activo !== undefined) {
      updateProperties.Activo = { checkbox: serviceData.activo };
    }
    
    if (serviceData.orden !== undefined) {
      updateProperties.Orden = { number: serviceData.orden };
    }

    await notion.pages.update({
      page_id: serviceId,
      properties: updateProperties
    });

    return {
      success: true,
      message: 'Servicio actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    return {
      success: false,
      error: error.message
    };
  }
}