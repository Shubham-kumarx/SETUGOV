import { citizenRegistry } from '../connectors/citizenRegistry.js';
import { landRecords } from '../connectors/landRecords.js';
import { socialWelfare } from '../connectors/socialWelfare.js';
import { municipalServices } from '../connectors/municipalServices.js';

const connectors = { CITIZEN_REGISTRY: citizenRegistry, LAND_RECORDS: landRecords, SOCIAL_WELFARE: socialWelfare, MUNICIPAL: municipalServices };

export async function callDepartment({ departmentCode, operation, payload = {} }) {
  const connector = connectors[departmentCode];
  if (!connector || typeof connector[operation] !== 'function') throw new Error(`Unsupported interoperability request: ${departmentCode}/${operation}`);
  const data = await connector[operation](payload.reference ? payload : payload);
  return { success: true, source: `${departmentCode} mock API`, receivedAt: new Date().toISOString(), data };
}

export function normalizeDepartmentResponse(response) {
  return { verified: response?.data?.verified ?? true, source: response.source, receivedAt: response.receivedAt, departmentData: response.data };
}
