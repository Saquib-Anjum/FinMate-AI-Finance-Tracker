import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Appearance
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    hideBalances: {
      type: Boolean,
      default: false,
    },

    // Financial preferences
    financialMonthStart: {
      type: Number,
      min: 1,
      max: 28,
      default: 1,
    },
    defaultDashboardPeriod: {
      type: String,
      enum: ["month", "year"],
      default: "month",
    },

    // Notifications
    notifications: {
      budgetAlerts: { type: Boolean, default: true },
      goalAlerts: { type: Boolean, default: true },
      billReminders: { type: Boolean, default: true },
      emailSummaries: { type: Boolean, default: false },
    },

    // AI preferences
    aiInsightsEnabled: {
      type: Boolean,
      default: true,
    },
    aiResponseStyle: {
      type: String,
      enum: ["concise", "detailed"],
      default: "concise",
    },
  },
  { timestamps: true }
);

const settingsModel = mongoose.model("Settings", settingsSchema);

export default settingsModel;