import express from 'express';
import { getMemberBookings } from '../controllers/memberBookingController.js';

const router = express.Router();
router.get('/:memberId', getMemberBookings);
export default router;
