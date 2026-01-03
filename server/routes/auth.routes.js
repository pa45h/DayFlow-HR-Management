import express from "express";
import { signin, signup, logout } from "../controllers/auth.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", protect, authorizeRoles("admin", "hr"), signup);
router.post("/login", signin);
router.post("/logout", protect, logout);

export default router;

