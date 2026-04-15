import Booking from '../models/Booking.js';

export const getAttendanceByClass = async (req, res) => {
  try {
    const bookings = await Booking.find({ classId: req.params.classId })
      .populate('memberId classId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAttendanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['completed', 'absent', 'no-show'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid attendance status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status },
      { new: true }
    ).populate('memberId classId');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
