import express from 'express';
import {
  getBookings,
  getBookingsByUser,
  createBooking,
  cancelBooking
} from '../controllers/bookingController.js';

const router = express.Router();
router.get('/', getBookings);
router.get('/user/:userId', getBookingsByUser);
router.post('/', createBooking);
router.put('/:id/cancel', cancelBooking);
export default router;
