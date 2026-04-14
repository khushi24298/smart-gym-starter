import MembershipPlan from '../models/MembershipPlan.js';
import Booking from '../models/Booking.js';
import CheckIn from '../models/CheckIn.js';

export const getPlans = async (req, res) => {
  const plans = await MembershipPlan.find();
  res.json(plans);
};

export const createPlan = async (req, res) => {
  const plan = await MembershipPlan.create(req.body);
  res.status(201).json(plan);
};

export const getDashboardStats = async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const totalCheckIns = await CheckIn.countDocuments({ status: 'success' });
  const failedCheckIns = await CheckIn.countDocuments({ status: 'failed' });
  res.json({ totalBookings, totalCheckIns, failedCheckIns });
};
