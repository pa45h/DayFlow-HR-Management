import express from "express";
const router = express.Router();
import { getPayroll, getPayrollById, getPayrollByUserId, updatePayroll } from "../controllers/payroll.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

router.get("/", protect, getPayroll);
router.get("/:id", protect, getPayrollById);
router.get("/user/:userId", protect, getPayrollByUserId);
router.put("/:id", protect, authorize("admin", "hr"), updatePayroll);

export default router;
