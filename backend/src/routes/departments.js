import express from 'express';
import Department from '../models/Department.js';
import { memoryStore } from '../data/memoryStore.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, allowRoles('admin', 'officer'), async (req, res) => res.json({ departments: Department.db.readyState === 1 ? await Department.find().sort({ name: 1 }) : memoryStore.departments }));
export default router;
