import express from 'express';
import { handleTranslateCode } from '../controllers/translationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, handleTranslateCode);

export default router;
