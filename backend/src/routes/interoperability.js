import express from 'express';
import { protect, allowRoles } from '../middleware/auth.js';
import { callDepartment, normalizeDepartmentResponse } from '../services/interoperabilityService.js';

const router = express.Router();
router.post('/call', protect, allowRoles('citizen', 'officer', 'admin'), async (req, res) => {
  const { departmentCode, operation, payload } = req.body;
  const response = await callDepartment({ departmentCode, operation, payload });
  res.json({ normalized: normalizeDepartmentResponse(response), raw: response });
});
export default router;
