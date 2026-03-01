import dotenv from "dotenv";
import mongoose from "mongoose";
import Notification from "./models/Notification.js";

dotenv.config();

const { default: app } = await import("./app.js");

const port = Number(process.env.PORT || 5000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is required in environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in environment variables");
}

const startServer = async () => {
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  // One-time safety migration for old unique index on `notifications.key`
  // that was indexing `null` and causing E11000 duplicate key errors.
  const notificationCollection = mongoose.connection.collection("notifications");
  try {
    const indexes = await notificationCollection.indexes();
    const legacyKeyIndex = indexes.find((index) => index.name === "key_1");
    if (legacyKeyIndex) {
      await notificationCollection.dropIndex("key_1");
    }
  } catch (error) {
    // Ignore when collection/indexes do not exist yet.
    if (error?.codeName !== "NamespaceNotFound") {
      throw error;
    }
  }
  await Notification.syncIndexes();

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
