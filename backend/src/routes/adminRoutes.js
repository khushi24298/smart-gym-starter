import express from 'express';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getAdminClasses,
  createAdminClass,
  updateAdminClass,
  deleteAdminClass,
  getDashboardStats,
  getAdminStaff,
  createAdminStaff,
  updateAdminStaff,
  deleteAdminStaff
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/classes', getAdminClasses);
router.post('/classes', createAdminClass);
router.put('/classes/:id', updateAdminClass);
router.delete('/classes/:id', deleteAdminClass);

router.get('/plans', getPlans);
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

router.get('/dashboard', getDashboardStats);

router.get('/staff', getAdminStaff);
router.post('/staff', createAdminStaff);
router.put('/staff/:id', updateAdminStaff);
router.delete('/staff/:id', deleteAdminStaff);

export default router;
