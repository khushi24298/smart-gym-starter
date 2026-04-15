import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['member', 'staff', 'trainer', 'admin'],
    default: 'member'
  },
  membershipStatus: {
    type: String,
    enum: ['active', 'paused', 'expired'],
    default: 'active'
  },
  emergencyContact: { type: String, default: '' },
  specialization: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
