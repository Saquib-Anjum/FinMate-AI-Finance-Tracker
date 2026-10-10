import goalModel from "../models/goalModel.js";
import userModel from "../models/userModel.js";

// CREATE GOAL
const createGoal = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, targetAmount, savedAmount } = req.body;

    if (
      !title?.trim() ||
      targetAmount === undefined ||
      savedAmount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const target = Number(targetAmount);
    const saved = Number(savedAmount);

    if (
      !Number.isFinite(target) ||
      !Number.isFinite(saved) ||
      target <= 0 ||
      saved < 0 ||
      saved > target
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid target or saved amount",
      });
    }

    const goal = await goalModel.create({
      userId,
      title: title.trim(),
      targetAmount: target,
      savedAmount: saved,
    });

    return res.status(201).json({
      success: true,
      message: "Goal created successfully",
      data: goal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL GOALS
const getGoals = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const goals = await goalModel.find({ userId });

    return res.status(200).json({
      success: true,
      message: goals.length ? "Here are all goals" : "No goals found",
      data: goals,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET GOAL BY ID
const getGoalById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Goal ID is required",
      });
    }

    const goal = await goalModel.findOne({
      _id: id,
      userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Here is the goal",
      data: goal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE GOAL
const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { title, targetAmount, savedAmount } = req.body;

    const goal = await goalModel.findOne({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      goal.title = title.trim();
    }

    if (targetAmount !== undefined) {
      const target = Number(targetAmount);

      if (!Number.isFinite(target) || target <= 0) {
        return res.status(400).json({
          success: false,
          message: "Target amount must be greater than zero",
        });
      }

      if (target < goal.savedAmount) {
        return res.status(400).json({
          success: false,
          message: "Target cannot be less than the amount already saved",
        });
      }

      goal.targetAmount = target;
    }

    if (savedAmount !== undefined) {
      const saved = Number(savedAmount);

      if (
        !Number.isFinite(saved) ||
        saved < 0 ||
        saved >
          (targetAmount !== undefined
            ? Number(targetAmount)
            : goal.targetAmount)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid saved amount",
        });
      }

      goal.savedAmount = saved;
    }

    await goal.save();

    return res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      data: goal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ADD MONEY TO GOAL
const addMoneyToGoal = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Contribution amount must be greater than zero",
      });
    }

    // Atomic update: verifies ownership and prevents exceeding the target.
    const goal = await goalModel.findOneAndUpdate(
      {
        _id: id,
        userId,
        $expr: {
          $lte: [{ $add: ["$savedAmount", amount] }, "$targetAmount"],
        },
      },
      {
        $inc: { savedAmount: amount },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!goal) {
      // Distinguish a missing goal from an amount exceeding its target.
      const existingGoal = await goalModel.exists({
        _id: id,
        userId,
      });

      if (!existingGoal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Contribution exceeds the remaining goal amount",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Money added to goal successfully",
      data: goal,
    });
  } catch (err) {
    console.error("Add money to goal error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to add money to goal",
    });
  }
};

// DELETE GOAL
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const goal = await goalModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
      data: goal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  addMoneyToGoal,
};
