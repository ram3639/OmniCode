import { Router } from 'express';
import { validateCode, runCode } from '../controllers/playgroundController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/validate', protect, validateCode);
router.post('/run', protect, runCode);

export default router;
