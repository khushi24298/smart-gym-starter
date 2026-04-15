import mongoose from "mongoose";

const gymClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  trainerName: { type: String, required: true },
  classType: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  capacity: { type: Number, default: 20 },
  bookedCount: { type: Number, default: 0 },
  waitlistCount: { type: Number, default: 0 },
  description: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('GymClass', gymClassSchema);
