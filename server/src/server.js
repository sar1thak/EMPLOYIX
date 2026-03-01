import dotenv from "dotenv";
import mongoose from "mongoose";
import Notification from "./models/Notification.js";

dotenv.config();

const { default: app } = await import("./app.js");

// 🔥 IMPORTANT: render provides PORT automatically
const port = process.env.PORT || 10000;
const mongoUri = process.env.MONGODB_URI;

// 🔴 ENV DEBUG (will show in render logs)
console.log("ENV CHECK:");
console.log("PORT:", port);
console.log("MONGO URI EXISTS:", mongoUri ? "YES" : "NO");
console.log("JWT EXISTS:", process.env.JWT_SECRET ? "YES" : "NO");

if (!mongoUri) {
  console.error("❌ MONGODB_URI missing");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing");
  process.exit(1);
}

const startServer = async () => {
  try {
    // 🔥 connect mongo
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");

    // ---- optional index fix (keep) ----
    const notificationCollection = mongoose.connection.collection("notifications");
    try {
      const indexes = await notificationCollection.indexes();
      const legacyKeyIndex = indexes.find((index) => index.name === "key_1");
      if (legacyKeyIndex) {
        await notificationCollection.dropIndex("key_1");
      }
    } catch (error) {
      if (error?.codeName !== "NamespaceNotFound") {
        console.log("Index warning:", error.message);
      }
    }

    await Notification.syncIndexes();

    // 🔥 start server
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.error("❌ SERVER START FAILED:", error);
    process.exit(1);
  }
};

startServer();