import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { apiLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import academyRoutes from "./routes/academy.routes.js";
import courseRoutes from "./routes/course.routes.js";
import communityRoutes from "./routes/community.routes.js";
import friendRoutes from "./routes/friend.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();

const app = express();

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api/", apiLimiter);

// Health check
app.get("/healthz", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/academy", academyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "요청하신 엔드포인트를 찾을 수 없습니다.",
    code: "NOT_FOUND",
  });
});

// Error handler
app.use(errorHandler);

export default app;
