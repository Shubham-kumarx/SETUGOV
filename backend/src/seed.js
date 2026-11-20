import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import Department from './models/Department.js';
import Service from './models/Service.js';
import Application from './models/Application.js';
import Consent from './models/Consent.js';
import Notification from './models/Notification.js';

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([User.deleteMany({}), Department.deleteMany({}), Service.deleteMany({}), Application.deleteMany({}), Consent.deleteMany({}), Notification.deleteMany({})]);
const departments = await Department.insertMany([
  { name: 'Citizen Registry', code: 'CITIZEN_REGISTRY', description: 'Identity and citizen profile verification', connector: 'citizenRegistry' },
  { name: 'Revenue & Land Records', code: 'LAND_RECORDS', description: 'Property ownership and land record checks', connector: 'landRecords' },
  { name: 'Social Welfare Department', code: 'SOCIAL_WELFARE', description: 'Benefits, schemes and eligibility services', connector: 'socialWelfare' },
  { name: 'Municipal Services Department', code: 'MUNICIPAL', description: 'Civic requests and local services', connector: 'municipalServices' }
]);
const serviceData = [
  ['Welfare Scheme Application', 'welfare-scheme', 'Apply for social assistance and education support schemes.', 'SOCIAL_WELFARE', '♡', '7–10 working days'],
  ['Property Record Verification', 'property-verification', 'Verify ownership and basic land record information.', 'LAND_RECORDS', '⌂', '3–5 working days'],
  ['Municipal Service Request', 'municipal-request', 'Raise a civic issue with your local municipal team.', 'MUNICIPAL', '⌁', '48 hours'],
  ['Citizen Profile Verification', 'profile-verification', 'Verify your citizen details against the central registry.', 'CITIZEN_REGISTRY', '✓', '1–2 working days']
];
const services = await Service.insertMany(serviceData.map(([name, slug, description, departmentCode, icon, eta]) => ({ name, slug, description, departmentCode, icon, eta, requiredConsent: departmentCode })));
const password = await bcrypt.hash('Demo@123', 10);
const citizens = await User.insertMany(Array.from({ length: 10 }, (_, index) => ({ name: ['Aarav Mehta', 'Diya Nair', 'Kabir Shah', 'Anaya Iyer', 'Vihaan Rao', 'Sara Khan', 'Ishaan Das', 'Meera Joshi', 'Arjun Pillai', 'Tara Sen'][index], email: index === 0 ? 'citizen@setugov.demo' : `citizen${index + 1}@setugov.demo`, password, role: 'citizen', phone: `+91 98765 43${String(index).padStart(2, '0')}`, address: `${index + 10}, Demo Avenue, Pune` })));
await User.insertMany([{ name: 'Priya Sharma', email: 'officer@setugov.demo', password, role: 'officer' }, { name: 'Rohan Kapoor', email: 'admin@setugov.demo', password, role: 'admin' }]);
await Consent.insertMany(citizens.slice(0, 3).map((citizen) => ({ citizen: citizen._id, departmentCode: 'SOCIAL_WELFARE', departmentName: 'Social Welfare Department', dataScope: ['name', 'address', 'incomeBand'], granted: true })));
const departmentByCode = Object.fromEntries(departments.map((department) => [department.code, department]));
await Promise.all(Array.from({ length: 15 }, (_, index) => {
  const citizen = citizens[index % citizens.length];
  const service = services[index % services.length];
  const department = departmentByCode[service.departmentCode];
  return Application.create({ referenceId: `SG-DEMO-${String(index + 1).padStart(3, '0')}`, citizen: citizen._id, citizenName: citizen.name, service: service._id, serviceName: service.name, departmentCode: service.departmentCode, departmentName: department.name, payload: { scheme: 'Asha Family Support', registryId: 'CIT-1001', description: 'Fictional seeded demonstration application' }, normalizedData: { verified: true, source: 'CITIZEN_REGISTRY mock API' }, status: ['Submitted', 'Under Review', 'Approved', 'Completed', 'Rejected'][index % 5] });
}));
await Notification.create({ citizen: citizens[0]._id, title: 'Welcome to SetuGov', message: 'Your unified government services workspace is ready.', type: 'info' });
console.log(`Seeded ${citizens.length} citizens, ${services.length} services, ${departments.length} departments and 3 sample applications.`);
await mongoose.disconnect();
