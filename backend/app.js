import express from "express";
import authRouter from "./routes/auth.routes.js";
import fileRouter from "./routes/file.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ✅ Health and API routes first (so they’re not shadowed)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    Timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({ message: "FileDrop App is running" });
});

app.get("/", (req, res) => {
  res.send("Welcome to Filedrop API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/files", fileRouter);

const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res, next) => {
  if (
    req.path.startsWith("/api/") ||
    req.path.startsWith("/health") ||
    req.path.startsWith("/nonexistent")
  ) {
    return next(); // Let the 404 handler catch it
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
