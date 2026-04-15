import MembershipPlan from '../models/MembershipPlan.js';
import Booking from '../models/Booking.js';
import CheckIn from '../models/CheckIn.js';
import User from '../models/User.js';
import GymClass from '../models/GymClass.js';

export const getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPlan = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      price: Number(req.body.price),
      durationInDays: Number(req.body.durationInDays || req.body.duration),
      premiumAccess: Boolean(req.body.premiumAccess),
      description: req.body.description || '',
      status: req.body.status || 'active'
    };
    const plan = await MembershipPlan.create(payload);
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      price: Number(req.body.price),
      durationInDays: Number(req.body.durationInDays || req.body.duration),
      premiumAccess: Boolean(req.body.premiumAccess),
      description: req.body.description || '',
      status: req.body.status || 'active'
    };
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    await MembershipPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminClasses = async (req, res) => {
  try {
    const classes = await GymClass.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdminClass = async (req, res) => {
  try {
    const payload = {
      title: req.body.title || req.body.name,
      trainerName: req.body.trainerName || req.body.trainer,
      classType: req.body.classType || 'General',
      day: req.body.day || req.body.date || 'TBD',
      time: req.body.time,
      capacity: Number(req.body.capacity) || 20,
      description: req.body.description || ''
    };
    if (!payload.title || !payload.trainerName || !payload.time) {
      return res.status(400).json({ message: 'title, trainerName, and time are required' });
    }
    const gymClass = await GymClass.create(payload);
    res.status(201).json(gymClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAdminClass = async (req, res) => {
  try {
    const payload = {
      title: req.body.title || req.body.name,
      trainerName: req.body.trainerName || req.body.trainer,
      classType: req.body.classType || 'General',
      day: req.body.day || req.body.date || 'TBD',
      time: req.body.time,
      capacity: Number(req.body.capacity) || 20,
      description: req.body.description || ''
    };
    const gymClass = await GymClass.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!gymClass) return res.status(404).json({ message: 'Class not found' });
    res.json(gymClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAdminClass = async (req, res) => {
  try {
    await GymClass.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalClasses = await GymClass.countDocuments();
    const totalMembers = await User.countDocuments({ role: 'member' });
    const activeMemberships = await User.countDocuments({ role: 'member', membershipStatus: 'active' });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCheckIns = await CheckIn.countDocuments({
      status: 'success',
      createdAt: { $gte: todayStart }
    });
    const noShowCount = await Booking.countDocuments({ status: 'no-show' });
    const totalCheckIns = await CheckIn.countDocuments({ status: 'success' });
    const failedCheckIns = await CheckIn.countDocuments({ status: 'failed' });

    const membershipDistributionRaw = await User.aggregate([
      { $match: { role: 'member' } },
      { $group: { _id: '$membershipStatus', count: { $sum: 1 } } }
    ]);
    const membershipDistribution = membershipDistributionRaw.map((item) => ({
      label: item._id,
      value: item.count
    }));

    const attendanceTrendRaw = await CheckIn.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 14 },
      {
        $project: {
          dateLabel: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          status: 1
        }
      },
      {
        $group: {
          _id: '$dateLabel',
          success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const attendanceTrend = attendanceTrendRaw.map((item) => ({
      label: item._id,
      success: item.success,
      failed: item.failed
    }));

    const classBookingSummaryRaw = await Booking.aggregate([
      { $group: { _id: '$classId', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);
    const classBookingSummary = await Promise.all(
      classBookingSummaryRaw.map(async (item) => {
        const gc = await GymClass.findById(item._id);
        return { label: gc?.title || 'Unknown Class', value: item.total };
      })
    );

    res.json({
      totalBookings,
      totalClasses,
      totalMembers,
      activeMemberships,
      todayCheckIns,
      noShowCount,
      totalCheckIns,
      failedCheckIns,
      membershipDistribution,
      attendanceTrend,
      classBookingSummary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** List staff + trainer accounts for admin CRUD screen. */
export const getStaffAndTrainersList = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['staff', 'trainer'] } })
      .select('name email role specialization membershipStatus createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Update a staff or trainer (not members/admins). */
export const updateStaffOrTrainer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!['staff', 'trainer'].includes(user.role)) {
      return res.status(403).json({ message: 'Only staff or trainer accounts can be updated here.' });
    }

    const { name, email, role, specialization, membershipStatus, password } = req.body;

    if (role && !['staff', 'trainer'].includes(role)) {
      return res.status(400).json({ message: 'Role must be staff or trainer.' });
    }

    const nextEmail = (email || user.email).trim().toLowerCase();
    if (nextEmail !== user.email) {
      const taken = await User.findOne({ email: nextEmail, _id: { $ne: user._id } });
      if (taken) return res.status(400).json({ message: 'Email already in use.' });
      user.email = nextEmail;
    }

    if (name !== undefined) user.name = String(name).trim();
    if (role) user.role = role;
    if (specialization !== undefined) user.specialization = String(specialization || '').trim();
    if (membershipStatus && ['active', 'paused', 'expired'].includes(membershipStatus)) {
      user.membershipStatus = membershipStatus;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
      }
      user.password = password;
    }

    await user.save();
    res.json({
      message: 'Updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        membershipStatus: user.membershipStatus
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** Delete a staff or trainer account. */
export const deleteStaffOrTrainer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!['staff', 'trainer'].includes(user.role)) {
      return res.status(403).json({ message: 'Only staff or trainer accounts can be deleted here.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Admin-only: create a staff or trainer login (plain password, same style as class demo). */
export const createStaffOrTrainer = async (req, res) => {
  try {
    const { name, email, password, role, specialization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (!['staff', 'trainer'].includes(role)) {
      return res.status(400).json({ message: 'Role must be staff or trainer.' });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      membershipStatus: 'active',
      specialization: (specialization || '').trim()
    });

    res.status(201).json({
      message: 'Account created',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
