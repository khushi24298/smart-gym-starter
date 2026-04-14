import Booking from '../models/Booking.js';
import GymClass from '../models/GymClass.js';
import User from '../models/User.js';

export const getBookings = async (req, res) => {
  const bookings = await Booking.find().populate('memberId classId');
  res.json(bookings);
};

export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ memberId: req.params.userId })
      .populate('classId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { memberId, classId } = req.body;

    if (!memberId || !classId) {
      return res.status(400).json({ message: 'memberId and classId are required' });
    }

    const member = await User.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const gymClass = await GymClass.findById(classId);
    if (!gymClass) return res.status(404).json({ message: 'Class not found' });

    const existingBooking = await Booking.findOne({
      memberId,
      classId,
      status: { $in: ['booked', 'waitlisted'] }
    });
    if (existingBooking) {
      return res.status(409).json({ message: 'You have already booked this class.' });
    }

    let status = 'booked';
    if (gymClass.bookedCount >= gymClass.capacity) {
      status = 'waitlisted';
      gymClass.waitlistCount += 1;
    } else {
      gymClass.bookedCount += 1;
    }

    await gymClass.save();
    const booking = await Booking.create({ memberId, classId, status });
    const populatedBooking = await booking.populate('classId');
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }

    const gymClass = await GymClass.findById(booking.classId);
    if (gymClass) {
      if (booking.status === 'booked' && gymClass.bookedCount > 0) {
        gymClass.bookedCount -= 1;
      } else if (booking.status === 'waitlisted' && gymClass.waitlistCount > 0) {
        gymClass.waitlistCount -= 1;
      }
      await gymClass.save();
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
