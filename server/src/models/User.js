import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      default: "google",
      enum: ["google"]
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      required: true,
      default: "employee"
    },
    organization: {
      type: String,
      default: "Employix Org"
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    avatar: {
      type: String,
      default: ""
    },
    passwordHash: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
