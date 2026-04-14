import express from 'express';
import { createCheckIn, getCheckIns } from '../controllers/checkinController.js';

const router = express.Router();
router.get('/', getCheckIns);
router.post('/', createCheckIn);
export default router;
