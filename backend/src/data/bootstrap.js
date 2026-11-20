import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { memoryStore } from './memoryStore.js';

export async function bootstrapMemory() {
  if (memoryStore.users.length) return;
  const departments = [
    { id: 'dept-registry', _id: 'dept-registry', name: 'Citizen Registry', code: 'CITIZEN_REGISTRY', description: 'Identity and citizen profile verification', connector: 'citizenRegistry', status: 'operational', lastSync: new Date() },
    { id: 'dept-land', _id: 'dept-land', name: 'Revenue & Land Records', code: 'LAND_RECORDS', description: 'Property ownership and land record checks', connector: 'landRecords', status: 'operational', lastSync: new Date() },
    { id: 'dept-welfare', _id: 'dept-welfare', name: 'Social Welfare Department', code: 'SOCIAL_WELFARE', description: 'Benefits, schemes and eligibility services', connector: 'socialWelfare', status: 'operational', lastSync: new Date() },
    { id: 'dept-municipal', _id: 'dept-municipal', name: 'Municipal Services Department', code: 'MUNICIPAL', description: 'Civic requests and local services', connector: 'municipalServices', status: 'operational', lastSync: new Date() }
  ];
  memoryStore.departments.push(...departments);
  memoryStore.services.push(
    { id: 'service-welfare', _id: 'service-welfare', name: 'Welfare Scheme Application', slug: 'welfare-scheme', description: 'Apply for social assistance and education support schemes.', departmentCode: 'SOCIAL_WELFARE', icon: '♡', eta: '7–10 working days', requiredConsent: 'SOCIAL_WELFARE' },
    { id: 'service-property', _id: 'service-property', name: 'Property Record Verification', slug: 'property-verification', description: 'Verify ownership and basic land record information.', departmentCode: 'LAND_RECORDS', icon: '⌂', eta: '3–5 working days', requiredConsent: 'LAND_RECORDS' },
    { id: 'service-municipal', _id: 'service-municipal', name: 'Municipal Service Request', slug: 'municipal-request', description: 'Raise a civic issue with your local municipal team.', departmentCode: 'MUNICIPAL', icon: '⌁', eta: '48 hours', requiredConsent: 'MUNICIPAL' },
    { id: 'service-profile', _id: 'service-profile', name: 'Citizen Profile Verification', slug: 'profile-verification', description: 'Verify your citizen details against the central registry.', departmentCode: 'CITIZEN_REGISTRY', icon: '✓', eta: '1–2 working days', requiredConsent: 'CITIZEN_REGISTRY' }
  );
  const password = await bcrypt.hash('Demo@123', 10);
  const users = [
    { id: 'citizen-001', _id: 'citizen-001', name: 'Aarav Mehta', email: 'citizen@setugov.demo', password, role: 'citizen', phone: '+91 98765 43210', address: '12, Lake View Road, Pune' },
    { id: 'officer-001', _id: 'officer-001', name: 'Priya Sharma', email: 'officer@setugov.demo', password, role: 'officer', department: 'SOCIAL_WELFARE' },
    { id: 'admin-001', _id: 'admin-001', name: 'Rohan Kapoor', email: 'admin@setugov.demo', password, role: 'admin' }
  ];
  memoryStore.users.push(...users);
  memoryStore.consents.push({ id: 'consent-001', _id: 'consent-001', citizen: 'citizen-001', departmentCode: 'SOCIAL_WELFARE', departmentName: 'Social Welfare Department', dataScope: ['name', 'address', 'incomeBand'], granted: true, grantedAt: new Date() });
}

export function makeId(prefix) { return `${prefix}-${randomUUID().slice(0, 8).toUpperCase()}`; }
