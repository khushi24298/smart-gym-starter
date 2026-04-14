import GymClass from '../models/GymClass.js';

export const getClasses = async (req, res) => {
  const classes = await GymClass.find().sort({ createdAt: -1 });
  res.json(classes);
};

export const createClass = async (req, res) => {
  const gymClass = await GymClass.create(req.body);
  res.status(201).json(gymClass);
};

export const updateClass = async (req, res) => {
  const gymClass = await GymClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(gymClass);
};

export const deleteClass = async (req, res) => {
  await GymClass.findByIdAndDelete(req.params.id);
  res.json({ message: 'Class deleted' });
};
