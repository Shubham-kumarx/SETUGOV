import express from 'express';
import Service from '../models/Service.js';
import { memoryStore } from '../data/memoryStore.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, async (req, res) => res.json({ services: Service.db.readyState === 1 ? await Service.find().sort({ createdAt: 1 }) : memoryStore.services }));
export default router;
