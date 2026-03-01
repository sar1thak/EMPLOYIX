import { Router } from "express";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

const buildTaskNumbers = (tasks) => {
  return tasks.reduce(
    (acc, task) => {
      if (task.status === "newTask") acc.newTask += 1;
      if (task.status === "active") acc.active += 1;
      if (task.status === "completed") acc.completed += 1;
      if (task.status === "failed") acc.failed += 1;
      return acc;
    },
    { newTask: 0, active: 0, completed: 0, failed: 0 }
  );
};

router.get("/me", authRequired, async (req, res) => {
  const user = await User.findById(req.user.sub).lean();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let taskNumbers = { newTask: 0, active: 0, completed: 0, failed: 0 };
  if (user.role === "employee") {
    const tasks = await Task.find({ assignedTo: user._id }).select("status").lean();
    taskNumbers = buildTaskNumbers(tasks);
  }

  return res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
    role: user.role,
    organization: user.organization,
    hasPassword: Boolean(user.passwordHash),
    taskNumbers,
    createdAt: user.createdAt
  });
});

export default router;
