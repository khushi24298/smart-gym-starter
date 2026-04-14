import Booking from '../models/Booking.js';

export const getMemberBookings = async (req, res) => {
  const bookings = await Booking.find({ memberId: req.params.memberId }).populate('classId');
  res.json(bookings);
};
