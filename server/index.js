import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 4000;
const app = express();
 
app.use(express.json());
app.use(cookieParser());
app.use(cors(
));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
