import express from 'express';
import Application from '../models/Application.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import { memoryStore } from '../data/memoryStore.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
router.get('/admin', protect, allowRoles('admin'), async (req, res) => {
  const mongo = Application.db.readyState === 1;
  const applications = mongo ? await Application.find().sort({ createdAt: -1 }).limit(8) : memoryStore.applications.slice().sort((a, b) => new Date(b.createdAt || b.submittedAt) - new Date(a.createdAt || a.submittedAt)).slice(0, 8);
  const [totalCitizens, totalApplications, pendingApplications, approvedApplications, rejectedApplications, totalDepartments] = mongo ? await Promise.all([User.countDocuments({ role: 'citizen' }), Application.countDocuments(), Application.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } }), Application.countDocuments({ status: { $in: ['Approved', 'Completed'] } }), Application.countDocuments({ status: 'Rejected' }), Department.countDocuments()]) : [memoryStore.users.filter((u) => u.role === 'citizen').length, memoryStore.applications.length, memoryStore.applications.filter((a) => ['Submitted', 'Under Review'].includes(a.status)).length, memoryStore.applications.filter((a) => ['Approved', 'Completed'].includes(a.status)).length, memoryStore.applications.filter((a) => a.status === 'Rejected').length, memoryStore.departments.length];
  res.json({ stats: { totalCitizens, totalApplications, pendingApplications, approvedApplications, rejectedApplications, totalDepartments }, applications });
});

router.get('/notifications', protect, async (req, res) => {
  const citizen = req.user._id || req.user.id;
  const notifications = Notification.db.readyState === 1 ? await Notification.find({ citizen }).sort({ createdAt: -1 }).limit(10) : memoryStore.notifications.filter((item) => item.citizen === citizen).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
  res.json({ notifications });
});
export default router;
