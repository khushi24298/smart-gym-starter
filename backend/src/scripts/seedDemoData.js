import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import GymClass from '../models/GymClass.js';
import Booking from '../models/Booking.js';

dotenv.config();

const demoUsers = [
  {
    name: 'Khushi Member',
    email: 'member1@smartgym.com',
    password: 'member123',
    role: 'member',
    membershipStatus: 'active'
  },
  {
    name: 'Riya Member',
    email: 'member2@smartgym.com',
    password: 'member123',
    role: 'member',
    membershipStatus: 'paused'
  }
];

const demoClasses = [
  {
    title: 'Morning Yoga Flow',
    trainerName: 'Anita Sharma',
    classType: 'Yoga',
    day: 'Monday',
    time: '7:00 AM',
    capacity: 15,
    bookedCount: 0
  },
  {
    title: 'HIIT Burn Session',
    trainerName: 'Rahul Verma',
    classType: 'HIIT',
    day: 'Wednesday',
    time: '6:30 PM',
    capacity: 12,
    bookedCount: 0
  },
  {
    title: 'Strength Fundamentals',
    trainerName: 'Priya Nair',
    classType: 'Strength',
    day: 'Friday',
    time: '5:30 PM',
    capacity: 10,
    bookedCount: 0
  }
];

async function seedDemoData() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in backend/.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for demo seeding.');

    // Keep this idempotent so you can run it many times safely.
    const users = [];
    for (const user of demoUsers) {
      const existing = await User.findOne({ email: user.email });
      if (existing) users.push(existing);
      else users.push(await User.create(user));
    }

    const classes = [];
    for (const gymClass of demoClasses) {
      const existing = await GymClass.findOne({
        title: gymClass.title,
        day: gymClass.day,
        time: gymClass.time
      });
      if (existing) classes.push(existing);
      else classes.push(await GymClass.create(gymClass));
    }

    // Create one booked and one cancelled history item for member1.
    const memberOne = users[0];
    const classOne = classes[0];
    const classTwo = classes[1];

    const existingBooked = await Booking.findOne({
      memberId: memberOne._id,
      classId: classOne._id,
      status: 'booked'
    });
    if (!existingBooked) {
      await Booking.create({
        memberId: memberOne._id,
        classId: classOne._id,
        status: 'booked'
      });
      classOne.bookedCount += 1;
      await classOne.save();
    }

    const existingCancelled = await Booking.findOne({
      memberId: memberOne._id,
      classId: classTwo._id,
      status: 'cancelled'
    });
    if (!existingCancelled) {
      await Booking.create({
        memberId: memberOne._id,
        classId: classTwo._id,
        status: 'cancelled'
      });
    }

    console.log('Demo data ready.');
    console.log('Login Accounts:');
    console.log('- member1@smartgym.com / member123');
    console.log('- member2@smartgym.com / member123');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDemoData();
