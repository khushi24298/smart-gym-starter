import express from 'express';
import { createCheckIn, getCheckIns, validateCheckIn } from '../controllers/checkinController.js';

const router = express.Router();
router.get('/', getCheckIns);
router.post('/', createCheckIn);
router.post('/validate', validateCheckIn);
export default router;
