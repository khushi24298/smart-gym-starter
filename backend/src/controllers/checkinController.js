import CheckIn from '../models/CheckIn.js';
import User from '../models/User.js';

export const createCheckIn = async (req, res) => {
  const { memberId } = req.body;
  const member = await User.findById(memberId);
  if (!member) return res.status(404).json({ message: 'Member not found' });

  let status = 'success';
  let reason = 'Check-in successful';

  if (member.membershipStatus !== 'active') {
    status = 'failed';
    reason = 'Membership is not active';
  }

  const record = await CheckIn.create({ memberId, status, reason });
  res.status(201).json(record);
};

export const getCheckIns = async (req, res) => {
  const records = await CheckIn.find().populate('memberId').sort({ createdAt: -1 });
  res.json(records);
};
