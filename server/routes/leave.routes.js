import express from 'express';
const router = express.Router();
import { applyLeave, getLeaves, getLeaveById, updateLeaveStatus, deleteLeave } from '../controllers/leave.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

router.post('/', protect, applyLeave);
router.get('/', protect, getLeaves);
router.get('/:id', protect, getLeaveById);
router.put('/:id', protect, authorize('admin', 'hr'), updateLeaveStatus);
router.delete('/:id', protect, authorize('admin', 'hr'), deleteLeave);

export default router;