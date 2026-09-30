import express from 'express';
import { getMyProgress, getRecommendations, getStats } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, getMyProgress);
router.get('/recommendations', protect, getRecommendations);
router.get('/stats', protect, getStats);

export default router;
