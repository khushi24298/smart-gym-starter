import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  reason: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('CheckIn', checkInSchema);
