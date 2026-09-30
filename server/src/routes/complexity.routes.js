import express from 'express';
import { protect } from '../middleware/auth.js';
import { analyzeComplexity } from '../controllers/complexityController.js';

const router = express.Router();

router.post('/', protect, analyzeComplexity);

export default router;
