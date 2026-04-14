import express from 'express';
import { getPlans, createPlan, getDashboardStats } from '../controllers/adminController.js';

const router = express.Router();
router.get('/plans', getPlans);
router.post('/plans', createPlan);
router.get('/dashboard', getDashboardStats);
export default router;
