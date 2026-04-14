import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'GymClass', required: true },
  status: {
    type: String,
    enum: ['booked', 'waitlisted', 'cancelled', 'completed', 'no-show'],
    default: 'booked'
  }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
