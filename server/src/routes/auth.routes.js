import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetToken.js";

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const buildToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const encodeOAuthState = ({ role, inviteToken }) => {
  const statePayload = {
    role: role === "admin" ? "admin" : "employee",
    inviteToken: inviteToken || null
  };

  return Buffer.from(JSON.stringify(statePayload), "utf8").toString("base64url");
};

const hashResetToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

router.get("/google", (req, res, next) => {
  const role = req.query.role === "admin" ? "admin" : "employee";
  const inviteToken = req.query.inviteToken ? String(req.query.inviteToken) : null;

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: encodeOAuthState({ role, inviteToken })
  })(req, res, next);
});

router.post("/local-login", async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatched = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatched) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json({ token: buildToken(user) });
});

router.post("/forgot-password", async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "If the account exists, a reset link has been generated." });
  }

  await PasswordResetToken.updateMany({ userId: user._id, usedAt: null }, { $set: { usedAt: new Date() } });

  const rawToken = crypto.randomBytes(24).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt
  });

  return res.json({
    message: "Reset link generated",
    resetLink: `${FRONTEND_URL}/reset-password?token=${rawToken}`
  });
});

router.post("/reset-password", async (req, res) => {
  const token = String(req.body.token || "");
  const newPassword = String(req.body.newPassword || "");

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 characters" });
  }

  const tokenHash = hashResetToken(token);
  const resetDoc = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() }
  });

  if (!resetDoc) {
    return res.status(400).json({ message: "Reset token is invalid or expired" });
  }

  const user = await User.findById(resetDoc.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  resetDoc.usedAt = new Date();
  await resetDoc.save();

  return res.json({ message: "Password reset successful" });
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure", session: false }),
  async (req, res) => {
    const token = buildToken(req.user);
    return res.redirect(`${FRONTEND_URL}/auth/success?token=${encodeURIComponent(token)}`);
  }
);

router.get("/failure", (_req, res) => {
  return res.status(401).json({ message: "OAuth login failed. Use a valid invite link for employee signup." });
});

export default router;
