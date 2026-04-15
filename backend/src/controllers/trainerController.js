import User from '../models/User.js';
import GymClass from '../models/GymClass.js';

export const getTrainerRoster = async (req, res) => {
  try {
    const trainers = await User.find({ role: { $in: ['trainer', 'staff'] } }).sort({ createdAt: -1 });

    const roster = await Promise.all(
      trainers.map(async (trainer) => {
        const assignedClasses = await GymClass.find({ trainerName: trainer.name });
        return {
          _id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          role: trainer.role,
          specialization: trainer.specialization || 'General Fitness',
          assignedClassesCount: assignedClasses.length,
          scheduleSummary:
            assignedClasses.map((c) => `${c.day} ${c.time}`).slice(0, 3).join(', ') || 'No classes assigned'
        };
      })
    );

    res.json(roster);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
