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
  getStaffAndTrainersList,
  createStaffOrTrainer,
  updateStaffOrTrainer,
  deleteStaffOrTrainer
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

router.get('/staff', getStaffAndTrainersList);
router.post('/staff', createStaffOrTrainer);
router.put('/staff/:id', updateStaffOrTrainer);
router.delete('/staff/:id', deleteStaffOrTrainer);

export default router;
