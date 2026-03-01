import express from "express";
import cors from "cors";
import passport from "passport";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import healthRoutes from "./routes/health.routes.js";
import orgRoutes from "./routes/org.routes.js";
import { configurePassport } from "./config/passport.js";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

configurePassport();
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/api", healthRoutes);
app.use("/api", userRoutes);
app.use("/api", orgRoutes);

app.use((err, _req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ message: "Internal server error" });
});

export default app;
