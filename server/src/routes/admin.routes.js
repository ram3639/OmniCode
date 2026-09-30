import express from 'express';
import { getAdminStats, getSystemHealth, reseedDatabase, clearSubmissions, listUsers, toggleUserRole } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/health', protect, adminOnly, getSystemHealth);
router.post('/reseed', protect, adminOnly, reseedDatabase);
router.delete('/submissions', protect, adminOnly, clearSubmissions);
router.get('/users', protect, adminOnly, listUsers);
router.put('/users/:userId/role', protect, adminOnly, toggleUserRole);

export default router;
