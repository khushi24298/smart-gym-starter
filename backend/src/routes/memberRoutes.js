import express from 'express';
import { getMembers, getMemberProfile, updateMemberProfile } from '../controllers/memberController.js';

const router = express.Router();
router.get('/', getMembers);
router.get('/:id', getMemberProfile);
router.put('/:id', updateMemberProfile);
export default router;
