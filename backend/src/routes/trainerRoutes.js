import express from 'express';
import { getTrainerRoster } from '../controllers/trainerController.js';

const router = express.Router();
router.get('/', getTrainerRoster);
export default router;
