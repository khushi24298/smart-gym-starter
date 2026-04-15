import GymClass from '../models/GymClass.js';

export const getClasses = async (req, res) => {
  try {
    const classes = await GymClass.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
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
    const gymClass = await GymClass.create(payload);
    res.status(201).json(gymClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateClass = async (req, res) => {
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
    res.json(gymClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    await GymClass.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
