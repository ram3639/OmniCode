import express from 'express';
import { handleParseAST } from '../controllers/astController.js';

const router = express.Router();

router.post('/parse', handleParseAST);

export default router;
