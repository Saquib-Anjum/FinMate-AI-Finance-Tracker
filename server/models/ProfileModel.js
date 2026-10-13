import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    currency: {
      type: String,
      default: "INR",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
  },
  {
    timestamps: true,
  },
);

const profileModel = mongoose.model("Profile", profileSchema);

export default profileModel;
