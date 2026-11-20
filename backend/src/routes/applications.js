import express from 'express';
import Application from '../models/Application.js';
import Service from '../models/Service.js';
import Department from '../models/Department.js';
import Consent from '../models/Consent.js';
import Notification from '../models/Notification.js';
import { memoryStore } from '../data/memoryStore.js';
import { makeId } from '../data/bootstrap.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { callDepartment, normalizeDepartmentResponse } from '../services/interoperabilityService.js';

const router = express.Router();
const mongo = () => Application.db.readyState === 1;
const citizenId = (user) => user._id || user.id;

router.get('/', protect, async (req, res) => {
  const query = req.user.role === 'citizen' ? { citizen: citizenId(req.user) } : req.user.role === 'officer' ? { departmentCode: req.user.department || 'SOCIAL_WELFARE' } : {};
  if (mongo()) return res.json({ applications: await Application.find(query).populate('service', 'name slug').sort({ createdAt: -1 }) });
  const applications = memoryStore.applications.filter((item) => Object.entries(query).every(([key, value]) => item[key] === value));
  res.json({ applications });
});

router.post('/', protect, allowRoles('citizen'), async (req, res) => {
  const { serviceId, payload = {} } = req.body;
  const service = mongo() ? await Service.findById(serviceId) : memoryStore.services.find((item) => item.id === serviceId || item._id === serviceId);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  const citizen = citizenId(req.user);
  const consent = mongo() ? await Consent.findOne({ citizen, departmentCode: service.departmentCode, granted: true }) : memoryStore.consents.find((item) => item.citizen === citizen && item.departmentCode === service.departmentCode && item.granted);
  if (!consent) return res.status(403).json({ message: `Grant ${service.departmentCode.replaceAll('_', ' ')} data-sharing consent before applying` });
  const registry = await callDepartment({ departmentCode: 'CITIZEN_REGISTRY', operation: 'getCitizen', payload: { registryId: payload.registryId || 'CIT-1001' } });
  const normalizedData = normalizeDepartmentResponse(registry);
  const department = mongo() ? await Department.findOne({ code: service.departmentCode }) : memoryStore.departments.find((item) => item.code === service.departmentCode);
  const values = { referenceId: makeId('SG'), citizen, citizenName: req.user.name, service: service._id || service.id, serviceName: service.name, departmentCode: service.departmentCode, departmentName: department?.name || service.departmentCode, payload, normalizedData, status: 'Submitted', submittedAt: new Date() };
  if (mongo()) {
    const application = await Application.create(values);
    await Notification.create({ citizen, title: 'Application submitted', message: `${service.name} is now ${application.status}. Reference ${application.referenceId}`, type: 'success' });
    return res.status(201).json({ application });
  }
  const application = { id: values.referenceId, _id: values.referenceId, ...values }; memoryStore.applications.push(application);
  memoryStore.notifications.push({ id: `note-${Date.now()}`, citizen, title: 'Application submitted', message: `${service.name} is now Submitted. Reference ${application.referenceId}`, type: 'success', read: false, createdAt: new Date() });
  res.status(201).json({ application });
});

router.patch('/:id/status', protect, allowRoles('officer', 'admin'), async (req, res) => {
  const { status, notes = '' } = req.body;
  const valid = ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed'];
  if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid application status' });
  const id = req.params.id;
  if (mongo()) {
    const application = await Application.findOneAndUpdate({ $or: [{ _id: id }, { referenceId: id }] }, { status, notes, updatedBy: req.user._id }, { new: true });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    await Notification.create({ citizen: application.citizen, title: 'Application status updated', message: `${application.referenceId} is now ${status}.`, type: status === 'Approved' ? 'success' : 'info' });
    return res.json({ application });
  }
  const application = memoryStore.applications.find((item) => item.referenceId === id || item.id === id);
  if (!application) return res.status(404).json({ message: 'Application not found' });
  application.status = status; application.notes = notes; application.updatedAt = new Date();
  memoryStore.notifications.push({ id: `note-${Date.now()}`, citizen: application.citizen, title: 'Application status updated', message: `${application.referenceId} is now ${status}.`, type: status === 'Approved' ? 'success' : 'info', read: false, createdAt: new Date() });
  res.json({ application });
});

router.get('/:id', protect, async (req, res) => {
  if (mongo()) { const application = await Application.findOne({ $or: [{ _id: req.params.id }, { referenceId: req.params.id }] }).populate('service', 'name'); if (!application) return res.status(404).json({ message: 'Application not found' }); return res.json({ application }); }
  const application = memoryStore.applications.find((item) => item.referenceId === req.params.id || item.id === req.params.id); if (!application) return res.status(404).json({ message: 'Application not found' }); res.json({ application });
});
export default router;
