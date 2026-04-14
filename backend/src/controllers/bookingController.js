import Booking from '../models/Booking.js';
import GymClass from '../models/GymClass.js';

export const getBookings = async (req, res) => {
  const bookings = await Booking.find().populate('memberId classId');
  res.json(bookings);
};

export const createBooking = async (req, res) => {
  const { memberId, classId } = req.body;
  const gymClass = await GymClass.findById(classId);
  if (!gymClass) return res.status(404).json({ message: 'Class not found' });

  let status = 'booked';
  if (gymClass.bookedCount >= gymClass.capacity) {
    status = 'waitlisted';
    gymClass.waitlistCount += 1;
  } else {
    gymClass.bookedCount += 1;
  }

  await gymClass.save();
  const booking = await Booking.create({ memberId, classId, status });
  res.status(201).json(booking);
};

export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.status = 'cancelled';
  await booking.save();
  res.json(booking);
};
