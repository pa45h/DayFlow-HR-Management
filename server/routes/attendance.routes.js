import express from "express";
const router = express.Router();
import { checkIn, checkOut, getAttendance, getAttendanceSummary, updateAttendance } from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/", protect, getAttendance);
router.get("/summary", protect, getAttendanceSummary);
router.put("/:id", protect, authorize("admin", "hr"), updateAttendance);

export default router;
