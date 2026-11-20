import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { memoryStore } from '../data/memoryStore.js';
import { signToken, protect } from '../middleware/auth.js';

const router = express.Router();
const mongo = () => User.db.readyState === 1;

router.post('/register', async (req, res) => {
  const { name, email, password, phone = '', address = '' } = req.body;
  if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: 'Name, email and a password of 6+ characters are required' });
  const normalized = email.toLowerCase().trim();
  if (mongo()) {
    if (await User.findOne({ email: normalized })) return res.status(409).json({ message: 'An account with that email already exists' });
    const user = await User.create({ name, email: normalized, password: await bcrypt.hash(password, 10), phone, address });
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: signToken(user) });
  }
  if (memoryStore.users.some((item) => item.email === normalized)) return res.status(409).json({ message: 'An account with that email already exists' });
  const user = { id: `citizen-${Date.now()}`, _id: `citizen-${Date.now()}`, name, email: normalized, password: await bcrypt.hash(password, 10), phone, address, role: 'citizen' };
  memoryStore.users.push(user);
  return res.status(201).json({ user: { id: user.id, name, email: normalized, role: user.role }, token: signToken(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = mongo() ? await User.findOne({ email: email?.toLowerCase().trim() }).select('+password') : memoryStore.users.find((item) => item.email === email?.toLowerCase().trim());
  if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role, department: user.department }, token: signToken(user) });
});

router.get('/me', protect, (req, res) => res.json({ user: { id: req.user._id || req.user.id, name: req.user.name, email: req.user.email, role: req.user.role, phone: req.user.phone, address: req.user.address, department: req.user.department } }));

export default router;
