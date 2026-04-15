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
  getDashboardStats
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
export default router;
