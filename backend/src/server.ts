import http from "node:http";
import dotenv from "dotenv";
import app from "./app.js";
import { initializeSocketIO } from "./socket/index.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

// Socket.io 초기화
const io = initializeSocketIO(server);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/healthz`);
  console.log(`🔌 Socket.io: enabled`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || "development"}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  io.close();
  server.close(() => {
    console.log("HTTP server closed");
  });
});
