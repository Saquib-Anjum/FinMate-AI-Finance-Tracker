
import settingsModel from "../models/settingsModel.js";

// Get settings
const getSetting = async (req, res) => {
  try {
    const { userId } = req.user || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Fetch existing settings or create them with schema defaults
    const settings = await settingsModel.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Settings fetched successfully",
      data: settings,
    });
  } catch (err) {
    console.error("Get settings error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const { userId } = req.user || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const {
      theme,
      hideBalances,
      financialMonthStart,
      defaultDashboardPeriod,
      notifications,
      aiInsightsEnabled,
      aiResponseStyle,
    } = req.body || {};

    const updates = {};

    // Validate and prepare appearance preferences
    if (theme !== undefined) {
      if (!["light", "dark", "system"].includes(theme)) {
        return res.status(400).json({
          success: false,
          message: "Invalid theme",
        });
      }

      updates.theme = theme;
    }

    if (hideBalances !== undefined) {
      if (typeof hideBalances !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "hideBalances must be a boolean",
        });
      }

      updates.hideBalances = hideBalances;
    }

    // Validate financial preferences
    if (financialMonthStart !== undefined) {
      if (
        !Number.isInteger(financialMonthStart) ||
        financialMonthStart < 1 ||
        financialMonthStart > 28
      ) {
        return res.status(400).json({
          success: false,
          message: "Financial month start must be between 1 and 28",
        });
      }

      updates.financialMonthStart = financialMonthStart;
    }

    if (defaultDashboardPeriod !== undefined) {
      if (!["month", "year"].includes(defaultDashboardPeriod)) {
        return res.status(400).json({
          success: false,
          message: "Invalid dashboard period",
        });
      }

      updates.defaultDashboardPeriod = defaultDashboardPeriod;
    }

    // Validate notification preferences
    if (notifications !== undefined) {
      if (
        !notifications ||
        typeof notifications !== "object" ||
        Array.isArray(notifications)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid notifications object",
        });
      }

      const allowedNotifications = [
        "budgetAlerts",
        "goalAlerts",
        "billReminders",
        "emailSummaries",
      ];

      const notificationKeys = Object.keys(notifications);

      if (notificationKeys.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No notification preferences provided",
        });
      }

      for (const key of notificationKeys) {
        if (
          !allowedNotifications.includes(key) ||
          typeof notifications[key] !== "boolean"
        ) {
          return res.status(400).json({
            success: false,
            message: `Invalid notification preference: ${key}`,
          });
        }

        // Update individual nested fields without overwriting other preferences
        updates[`notifications.${key}`] = notifications[key];
      }
    }

    // Validate AI preferences
    if (aiInsightsEnabled !== undefined) {
      if (typeof aiInsightsEnabled !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "aiInsightsEnabled must be a boolean",
        });
      }

      updates.aiInsightsEnabled = aiInsightsEnabled;
    }

    if (aiResponseStyle !== undefined) {
      if (!["concise", "detailed"].includes(aiResponseStyle)) {
        return res.status(400).json({
          success: false,
          message: "Invalid AI response style",
        });
      }

      updates.aiResponseStyle = aiResponseStyle;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid settings provided",
      });
    }

    // Update only the authenticated user's settings
    const settings = await settingsModel.findOneAndUpdate(
      { userId },
      {
        $set: updates,
        $setOnInsert: { userId },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (err) {
    console.error("Update settings error:", err);

    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

export { getSetting, updateSettings };
