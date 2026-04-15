import CheckIn from '../models/CheckIn.js';
import User from '../models/User.js';
import MembershipPlan from '../models/MembershipPlan.js';
import mongoose from 'mongoose';

export const createCheckIn = async (req, res) => {
  try {
    const result = await validateAndCreateCheckIn(req.body.memberCode || req.body.memberId);
    const statusCode = result.allowed ? 201 : 200;
    res.status(statusCode).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCheckIns = async (req, res) => {
  try {
    const records = await CheckIn.find().populate('memberId').sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validateCheckIn = async (req, res) => {
  try {
    const result = await validateAndCreateCheckIn(req.body.memberCode || req.body.memberId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const validateAndCreateCheckIn = async (rawCode) => {
  if (!rawCode) throw new Error('Member code or ID is required.');

  const sanitizedCode = String(rawCode).trim();
  const query = [{ email: sanitizedCode }];
  if (mongoose.Types.ObjectId.isValid(sanitizedCode)) {
    query.push({ _id: sanitizedCode });
  }

  const member = await User.findOne({ $or: query });
  if (!member) throw new Error('Member not found for provided code.');

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const existingTodayCheckIn = await CheckIn.findOne({
    memberId: member._id,
    createdAt: { $gte: startOfDay },
    status: 'success'
  });

  let status = 'success';
  let reason = 'Check-in successful';
  let allowed = true;

  if (existingTodayCheckIn) {
    status = 'failed';
    allowed = false;
    reason = 'Member already checked in today';
  } else if (member.membershipStatus === 'expired') {
    status = 'failed';
    allowed = false;
    reason = 'Membership expired';
  } else if (member.membershipStatus === 'paused') {
    status = 'failed';
    allowed = false;
    reason = 'Membership unpaid/paused';
  } else if (member.membershipStatus !== 'active') {
    status = 'failed';
    allowed = false;
    reason = 'Membership not active';
  }

  const record = await CheckIn.create({ memberId: member._id, status, reason });
  const defaultPlan = await MembershipPlan.findOne({ status: 'active' }).sort({ createdAt: -1 });

  return {
    checkInId: record._id,
    allowed,
    reason,
    member: {
      _id: member._id,
      name: member.name,
      email: member.email,
      membershipStatus: member.membershipStatus,
      planName: defaultPlan?.name || 'Not assigned',
      validityInfo: member.membershipStatus === 'active' ? 'Membership valid' : 'Membership requires renewal'
    },
    checkInStatus: status
  };
};
