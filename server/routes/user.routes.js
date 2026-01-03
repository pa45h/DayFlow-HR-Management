import express from "express";
const router = express.Router();
import { getAllUsers, getUserProfile, updateUserProfile, deleteUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

router.get("/", protect, authorize("admin", "hr"), getAllUsers);
router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, updateUserProfile);
router.delete("/:id", protect, authorize("admin", "hr"), deleteUser);

export default router;
