import express from 'express';
import { getBookings, createBooking, cancelBooking } from '../controllers/bookingController.js';

const router = express.Router();
router.get('/', getBookings);
router.post('/', createBooking);
router.put('/:id/cancel', cancelBooking);
export default router;
