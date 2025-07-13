// lib/notion-config.js
// Configuración centralizada para las 2 bases de datos principales

export const NOTION_CONFIG = {
  // Token de autenticación
  token: process.env.NOTION_TOKEN,
  
  // IDs de las bases de datos
  databases: {
    availability: process.env.NOTION_DATABASE_AVAILABILITY_ID,
    services: process.env.NOTION_DATABASE_SERVICES_ID,
  }
};

/**
 * Validar que las configuraciones necesarias estén presentes
 */
export function validateNotionConfig(requiredDatabases = []) {
  const errors = [];
  
  // Validar token
  if (!NOTION_CONFIG.token) {
    errors.push('NOTION_TOKEN is required');
  }
  
  // Validar bases de datos requeridas
  requiredDatabases.forEach(dbName => {
    if (!NOTION_CONFIG.databases[dbName]) {
      const envVarName = `NOTION_DATABASE_${dbName.toUpperCase()}_ID`;
      errors.push(`${envVarName} is required`);
    }
  });
  
  if (errors.length > 0) {
    throw new Error(`Missing Notion configuration: ${errors.join(', ')}`);
  }
  
  return true;
}

/**
 * Obtener el ID de una base de datos específica
 */
export function getDatabaseId(databaseName) {
  const dbId = NOTION_CONFIG.databases[databaseName];
  
  if (!dbId) {
    throw new Error(`Database ID for '${databaseName}' not found. Make sure NOTION_DATABASE_${databaseName.toUpperCase()}_ID is set in your environment variables.`);
  }
  
  return dbId;
}