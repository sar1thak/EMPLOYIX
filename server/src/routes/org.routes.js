import { Router } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Invitation from "../models/Invitation.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const parseOrder = (value) => (String(value || "desc").toLowerCase() === "asc" ? 1 : -1);

const createAudit = async ({ actor, action, targetType = "system", targetId = "", metadata = {} }) => {
  await AuditLog.create({
    actor,
    action,
    targetType,
    targetId: String(targetId || ""),
    metadata
  });
};

const createNotification = async ({ userId, type, title, message, key = null, metadata = {} }) => {
  if (key) {
    await Notification.findOneAndUpdate(
      { key },
      {
        $set: {
          userId,
          type,
          title,
          message,
          metadata,
          isRead: false
        }
      },
      { upsert: true, new: true }
    );
    return;
  }

  await Notification.create({ userId, type, title, message, metadata });
};

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

router.get("/employees", authRequired, requireRole("admin"), async (req, res) => {
  const q = String(req.query.q || "").trim();
  const sortBy = ["name", "email", "createdAt"].includes(String(req.query.sortBy))
    ? String(req.query.sortBy)
    : "createdAt";
  const order = parseOrder(req.query.order);

  const filter = { role: "employee" };
  if (q) {
    filter.$or = [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }];
  }

  const employees = await User.find(filter).sort({ [sortBy]: order }).lean();
  const employeeIds = employees.map((employee) => employee._id);

  const taskDocs = await Task.find({ assignedTo: { $in: employeeIds } })
    .select("assignedTo status")
    .lean();

  const taskMap = new Map();
  taskDocs.forEach((task) => {
    const key = String(task.assignedTo);
    const current = taskMap.get(key) || [];
    current.push(task);
    taskMap.set(key, current);
  });

  const payload = employees.map((employee) => {
    const tasks = taskMap.get(String(employee._id)) || [];
    return {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      hasPassword: Boolean(employee.passwordHash),
      taskNumbers: buildTaskNumbers(tasks)
    };
  });

  return res.json(payload);
});

router.post("/invitations", authRequired, requireRole("admin"), async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();

  if (!email) {
    return res.status(400).json({ message: "Employee email is required" });
  }

  const existingEmployee = await User.findOne({ email, role: "employee" }).lean();
  if (existingEmployee) {
    return res.status(409).json({ message: "Employee already exists for this email" });
  }

  await Invitation.updateMany(
    { email, status: "pending" },
    { $set: { status: "expired", expiresAt: new Date() } }
  );

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invite = await Invitation.create({
    email,
    token,
    invitedBy: req.user.sub,
    status: "pending",
    expiresAt
  });

  await createAudit({
    actor: req.user.sub,
    action: "invite_created",
    targetType: "invitation",
    targetId: invite._id,
    metadata: { email }
  });

  return res.status(201).json({
    id: invite._id,
    email: invite.email,
    status: invite.status,
    expiresAt: invite.expiresAt,
    inviteLink: `${FRONTEND_URL}/invite?token=${token}`
  });
});

router.post("/invitations/:id/resend", authRequired, requireRole("admin"), async (req, res) => {
  const inviteId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(inviteId)) {
    return res.status(400).json({ message: "Invalid invitation id" });
  }

  const invite = await Invitation.findById(inviteId);
  if (!invite) {
    return res.status(404).json({ message: "Invitation not found" });
  }

  if (invite.status === "accepted") {
    return res.status(400).json({ message: "Accepted invites cannot be resent" });
  }

  invite.token = crypto.randomBytes(24).toString("hex");
  invite.status = "pending";
  invite.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await invite.save();

  await createAudit({
    actor: req.user.sub,
    action: "invite_resent",
    targetType: "invitation",
    targetId: invite._id,
    metadata: { email: invite.email }
  });

  return res.json({
    id: invite._id,
    email: invite.email,
    status: invite.status,
    expiresAt: invite.expiresAt,
    inviteLink: `${FRONTEND_URL}/invite?token=${invite.token}`
  });
});

router.post("/invitations/:id/revoke", authRequired, requireRole("admin"), async (req, res) => {
  const inviteId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(inviteId)) {
    return res.status(400).json({ message: "Invalid invitation id" });
  }

  const invite = await Invitation.findById(inviteId);
  if (!invite) {
    return res.status(404).json({ message: "Invitation not found" });
  }

  if (invite.status === "accepted") {
    return res.status(400).json({ message: "Accepted invites cannot be revoked" });
  }

  invite.status = "revoked";
  invite.expiresAt = new Date();
  await invite.save();

  await createAudit({
    actor: req.user.sub,
    action: "invite_revoked",
    targetType: "invitation",
    targetId: invite._id,
    metadata: { email: invite.email }
  });

  return res.json({ message: "Invitation revoked" });
});

router.get("/invitations", authRequired, requireRole("admin"), async (req, res) => {
  const q = String(req.query.q || "").trim();
  const status = String(req.query.status || "all");
  const sortBy = ["createdAt", "expiresAt", "email", "status"].includes(String(req.query.sortBy))
    ? String(req.query.sortBy)
    : "createdAt";
  const order = parseOrder(req.query.order);

  const filter = {};
  if (status !== "all") {
    filter.status = status;
  }
  if (q) {
    filter.email = { $regex: q, $options: "i" };
  }

  const invites = await Invitation.find(filter)
    .sort({ [sortBy]: order })
    .limit(200)
    .populate("invitedBy", "name email")
    .lean();

  return res.json(
    invites.map((invite) => ({
      id: invite._id,
      email: invite.email,
      status: invite.status,
      expiresAt: invite.expiresAt,
      createdAt: invite.createdAt,
      invitedBy: invite.invitedBy
        ? { name: invite.invitedBy.name, email: invite.invitedBy.email }
        : null
    }))
  );
});

router.get("/invitations/validate", async (req, res) => {
  const token = String(req.query.token || "");

  if (!token) {
    return res.status(400).json({ valid: false, message: "Invite token is required" });
  }

  const invite = await Invitation.findOne({ token, status: "pending", expiresAt: { $gt: new Date() } }).lean();

  if (!invite) {
    return res.status(404).json({ valid: false, message: "Invite is invalid or expired" });
  }

  return res.json({ valid: true, email: invite.email, expiresAt: invite.expiresAt });
});

router.post("/tasks", authRequired, requireRole("admin"), async (req, res) => {
  const { assignedToId, taskTitle, taskDescription, taskDate, category } = req.body;

  if (!assignedToId || !taskTitle || !taskDescription || !taskDate || !category) {
    return res.status(400).json({ message: "Missing required task fields" });
  }

  if (!mongoose.Types.ObjectId.isValid(assignedToId)) {
    return res.status(400).json({ message: "Invalid employee id" });
  }

  const employee = await User.findOne({ _id: assignedToId, role: "employee" }).lean();
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const task = await Task.create({
    assignedBy: req.user.sub,
    assignedTo: assignedToId,
    taskTitle,
    taskDescription,
    taskDate,
    category,
    status: "newTask"
  });

  await createNotification({
    userId: assignedToId,
    type: "task_assigned",
    title: "New task assigned",
    message: `${taskTitle} has been assigned to you`,
    metadata: { taskId: String(task._id), category }
  });

  await createAudit({
    actor: req.user.sub,
    action: "task_assigned",
    targetType: "task",
    targetId: task._id,
    metadata: { assignedToId, taskTitle }
  });

  return res.status(201).json({
    id: task._id,
    taskTitle: task.taskTitle,
    taskDescription: task.taskDescription,
    taskDate: task.taskDate,
    category: task.category,
    status: task.status,
    assignedTo: assignedToId
  });
});

router.get("/tasks/team", authRequired, requireRole("admin"), async (req, res) => {
  const q = String(req.query.q || "").trim();
  const status = String(req.query.status || "all");
  const employeeId = String(req.query.employeeId || "");
  const sortBy = ["createdAt", "taskDate", "status", "category"].includes(String(req.query.sortBy))
    ? String(req.query.sortBy)
    : "createdAt";
  const order = parseOrder(req.query.order);

  const filter = {};
  if (status !== "all") {
    filter.status = status;
  }
  if (employeeId && mongoose.Types.ObjectId.isValid(employeeId)) {
    filter.assignedTo = employeeId;
  }
  if (q) {
    filter.$or = [
      { taskTitle: { $regex: q, $options: "i" } },
      { taskDescription: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } }
    ];
  }

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .sort({ [sortBy]: order })
    .lean();

  return res.json(
    tasks.map((task) => ({
      id: task._id,
      taskTitle: task.taskTitle,
      taskDescription: task.taskDescription,
      taskDate: task.taskDate,
      category: task.category,
      status: task.status,
      employee: task.assignedTo
        ? {
            id: task.assignedTo._id,
            name: task.assignedTo.name,
            email: task.assignedTo.email
          }
        : null
    }))
  );
});

router.get("/analytics/admin", authRequired, requireRole("admin"), async (req, res) => {
  const from = String(req.query.from || "");
  const to = String(req.query.to || "");

  const taskFilter = {};
  if (from || to) {
    taskFilter.createdAt = {};
    if (from) {
      taskFilter.createdAt.$gte = new Date(`${from}T00:00:00.000Z`);
    }
    if (to) {
      taskFilter.createdAt.$lte = new Date(`${to}T23:59:59.999Z`);
    }
  }

  const [employeeCount, taskCount, grouped, topEmployees] = await Promise.all([
    User.countDocuments({ role: "employee" }),
    Task.countDocuments(taskFilter),
    Task.aggregate([{ $match: taskFilter }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.aggregate([
      { $match: taskFilter },
      {
        $group: {
          _id: "$assignedTo",
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
            }
          }
        }
      },
      { $sort: { completed: -1, total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" },
      {
        $project: {
          name: "$employee.name",
          email: "$employee.email",
          total: 1,
          completed: 1,
          completionRate: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$completed", "$total"] }, 100] }, 0] }
            ]
          }
        }
      }
    ])
  ]);

  const statusCounts = { newTask: 0, active: 0, completed: 0, failed: 0 };
  grouped.forEach((row) => {
    statusCounts[row._id] = row.count;
  });

  return res.json({ employeeCount, taskCount, statusCounts, topEmployees });
});

router.get("/audit-logs", authRequired, requireRole("admin"), async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 200);

  const logs = await AuditLog.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("actor", "name email")
    .lean();

  return res.json(
    logs.map((log) => ({
      id: log._id,
      action: log.action,
      targetType: log.targetType,
      targetId: log.targetId,
      metadata: log.metadata,
      createdAt: log.createdAt,
      actor: log.actor ? { name: log.actor.name, email: log.actor.email } : null
    }))
  );
});

router.get("/tasks/my", authRequired, requireRole("employee"), async (req, res) => {
  const q = String(req.query.q || "").trim();
  const status = String(req.query.status || "all");
  const sortBy = ["createdAt", "taskDate", "status", "category"].includes(String(req.query.sortBy))
    ? String(req.query.sortBy)
    : "createdAt";
  const order = parseOrder(req.query.order);

  const filter = { assignedTo: req.user.sub };
  if (status !== "all") {
    filter.status = status;
  }
  if (q) {
    filter.$or = [
      { taskTitle: { $regex: q, $options: "i" } },
      { taskDescription: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } }
    ];
  }

  const tasks = await Task.find(filter).sort({ [sortBy]: order }).lean();

  // Auto-generate reminder notifications for due-soon tasks (within 24h)
  const now = Date.now();
  await Promise.all(
    tasks
      .filter((task) => ["newTask", "active"].includes(task.status))
      .map(async (task) => {
        const dueTs = Date.parse(task.taskDate);
        if (Number.isNaN(dueTs)) {
          return;
        }
        const diff = dueTs - now;
        if (diff < 0 || diff > 24 * 60 * 60 * 1000) {
          return;
        }

        await createNotification({
          userId: req.user.sub,
          type: "task_due_soon",
          title: "Task due soon",
          message: `${task.taskTitle} is due within 24 hours`,
          key: `due:${task._id}:${task.taskDate}`,
          metadata: { taskId: String(task._id), dueDate: task.taskDate }
        });
      })
  );

  return res.json(
    tasks.map((task) => ({
      id: task._id,
      taskTitle: task.taskTitle,
      taskDescription: task.taskDescription,
      taskDate: task.taskDate,
      category: task.category,
      status: task.status
    }))
  );
});

router.patch("/tasks/:id/status", authRequired, requireRole("employee"), async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  if (!["active", "completed", "failed"].includes(status)) {
    return res.status(400).json({ message: "Invalid task status" });
  }

  const task = await Task.findOne({ _id: taskId, assignedTo: req.user.sub });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.status = status;
  await task.save();

  await createNotification({
    userId: task.assignedBy,
    type: "task_status_updated",
    title: "Task status updated",
    message: `${task.taskTitle} was marked as ${status}`,
    metadata: { taskId: String(task._id), status }
  });

  await createAudit({
    actor: req.user.sub,
    action: "task_status_updated",
    targetType: "task",
    targetId: task._id,
    metadata: { status }
  });

  return res.json({ id: task._id, status: task.status });
});

router.get("/notifications/my", authRequired, async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const notifications = await Notification.find({ userId: req.user.sub })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const unreadCount = await Notification.countDocuments({ userId: req.user.sub, isRead: false });

  return res.json({
    unreadCount,
    items: notifications.map((item) => ({
      id: item._id,
      type: item.type,
      title: item.title,
      message: item.message,
      isRead: item.isRead,
      metadata: item.metadata,
      createdAt: item.createdAt
    }))
  });
});

router.patch("/notifications/:id/read", authRequired, async (req, res) => {
  const notificationId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return res.status(400).json({ message: "Invalid notification id" });
  }

  await Notification.updateOne({ _id: notificationId, userId: req.user.sub }, { $set: { isRead: true } });
  return res.json({ message: "Notification marked as read" });
});

router.patch("/notifications/read-all", authRequired, async (req, res) => {
  await Notification.updateMany({ userId: req.user.sub, isRead: false }, { $set: { isRead: true } });
  return res.json({ message: "All notifications marked as read" });
});

router.put("/account/password", authRequired, async (req, res) => {
  const currentPassword = String(req.body.currentPassword || "");
  const newPassword = String(req.body.newPassword || "");

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 characters" });
  }

  const user = await User.findById(req.user.sub);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.passwordHash) {
    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  await createAudit({
    actor: req.user.sub,
    action: "account_password_updated",
    targetType: "user",
    targetId: user._id,
    metadata: { hasExistingPassword: Boolean(currentPassword) }
  });

  return res.json({ message: "Password updated successfully" });
});

export default router;
