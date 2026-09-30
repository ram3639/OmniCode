import express from 'express';
import { getChallenges, getChallenge, createChallenge } from '../controllers/challengeController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getChallenges);
router.get('/:slug', getChallenge);
router.post('/', protect, admin, createChallenge);

export default router;
