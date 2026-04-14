import User from '../models/User.js';

export const getMembers = async (req, res) => {
  const members = await User.find({ role: 'member' });
  res.json(members);
};

export const getMemberProfile = async (req, res) => {
  const member = await User.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  res.json(member);
};

export const updateMemberProfile = async (req, res) => {
  const member = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(member);
};
