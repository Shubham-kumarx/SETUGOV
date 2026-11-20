import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { memoryStore } from '../data/memoryStore.js';

export function signToken(user) {
  return jwt.sign({ id: user._id?.toString() || user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET || 'setugov-local-demo-secret-change-me', { expiresIn: '7d' });
}

export async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required' });
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'setugov-local-demo-secret-change-me');
    const user = User.db.readyState === 1 ? await User.findById(decoded.id).select('+password') : memoryStore.users.find((item) => item.id === decoded.id || item._id?.toString() === decoded.id);
    if (!user) return res.status(401).json({ message: 'User session is no longer valid' });
    req.user = user;
    next();
  } catch { return res.status(401).json({ message: 'Invalid or expired token' }); }
}

export const allowRoles = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission for this action' });
