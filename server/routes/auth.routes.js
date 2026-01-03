import express from "express";
<<<<<<< HEAD
import { signup, login, getMe } from "../controllers/auth.controller.js";
=======
import { signin, signup, logout } from "../controllers/auth.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
>>>>>>> 10c093ec571d6bb89bfe070032301ae20e3f1707
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

<<<<<<< HEAD
router.post("/signup", signup);
router.post("/login", login);
// router.post("/logout", logout);
router.get("/me", protect, getMe);
=======
router.post("/signup", protect, authorizeRoles("admin", "hr"), signup);
router.post("/login", signin);
router.post("/logout", protect, logout);
>>>>>>> 10c093ec571d6bb89bfe070032301ae20e3f1707

export default router;
