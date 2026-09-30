import express from 'express';
import { getTelemetry, getHealth, getUsers, getSystemStats } from '../controllers/telemetryController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', protect, admin, getTelemetry);
router.get('/health', getHealth);
router.get('/users', protect, admin, getUsers);
router.get('/stats', protect, admin, getSystemStats);

export default router;
