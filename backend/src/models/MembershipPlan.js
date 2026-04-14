import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  durationInDays: { type: Number, required: true },
  premiumAccess: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('MembershipPlan', membershipPlanSchema);
