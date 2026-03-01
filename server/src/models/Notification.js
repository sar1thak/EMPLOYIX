import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    key: {
      type: String,
      default: undefined
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

notificationSchema.index(
  { key: 1 },
  {
    unique: true,
    partialFilterExpression: {
      key: { $exists: true, $type: "string" }
    }
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
