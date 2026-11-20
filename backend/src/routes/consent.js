import express from 'express';
import Consent from '../models/Consent.js';
import Department from '../models/Department.js';
import { memoryStore } from '../data/memoryStore.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
const mongo = () => Consent.db.readyState === 1;
router.get('/', protect, allowRoles('citizen'), async (req, res) => {
  const citizen = req.user._id || req.user.id;
  res.json({ consents: mongo() ? await Consent.find({ citizen }).sort({ departmentName: 1 }) : memoryStore.consents.filter((item) => item.citizen === citizen) });
});
router.put('/:departmentCode', protect, allowRoles('citizen'), async (req, res) => {
  const { departmentCode } = req.params;
  const dataScope = req.body.dataScope || ['name', 'address'];
  const citizen = req.user._id || req.user.id;
  const department = mongo() ? await Department.findOne({ code: departmentCode }) : memoryStore.departments.find((item) => item.code === departmentCode);
  if (!department) return res.status(404).json({ message: 'Department not found' });
  if (mongo()) {
    const consent = await Consent.findOneAndUpdate({ citizen, departmentCode }, { citizen, departmentCode, departmentName: department.name, dataScope, granted: true, grantedAt: new Date(), revokedAt: null }, { upsert: true, new: true });
    return res.json({ consent });
  }
  let consent = memoryStore.consents.find((item) => item.citizen === citizen && item.departmentCode === departmentCode);
  if (consent) Object.assign(consent, { dataScope, granted: true, grantedAt: new Date(), revokedAt: null });
  else { consent = { id: `consent-${Date.now()}`, _id: `consent-${Date.now()}`, citizen, departmentCode, departmentName: department.name, dataScope, granted: true, grantedAt: new Date() }; memoryStore.consents.push(consent); }
  res.json({ consent });
});
router.delete('/:departmentCode', protect, allowRoles('citizen'), async (req, res) => {
  const citizen = req.user._id || req.user.id;
  if (mongo()) { const consent = await Consent.findOneAndUpdate({ citizen, departmentCode: req.params.departmentCode }, { granted: false, revokedAt: new Date() }, { new: true }); return res.json({ consent }); }
  const consent = memoryStore.consents.find((item) => item.citizen === citizen && item.departmentCode === req.params.departmentCode);
  if (!consent) return res.status(404).json({ message: 'Consent not found' });
  consent.granted = false; consent.revokedAt = new Date(); res.json({ consent });
});
export default router;
