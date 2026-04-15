import express from 'express';
import { getAttendanceByClass, updateAttendanceStatus } from '../controllers/attendanceController.js';

const router = express.Router();
router.get('/class/:classId', getAttendanceByClass);
router.put('/:bookingId', updateAttendanceStatus);
export default router;
