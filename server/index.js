import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 4000;
const app = express();
 
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
