import goalModel from "../models/goalModel.js";
import userModel from "../models/userModel.js";

// CREATE GOAL
const createGoal = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, targetAmount, savedAmount } = req.body;

    if (!title || targetAmount === undefined || savedAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const goal = await goalModel.create({
      userId,
      title,
      targetAmount,
      savedAmount,
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

    const goals = await goalModel.find({
      userId,
    });

    if (goals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No goals found",
      });
    }

    return res.json({
      success: true,
      message: "Here are all goals",
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

    return res.json({
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

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Goal ID is required",
      });
    }

    const { title, targetAmount, savedAmount } = req.body;

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

    if (title !== undefined) {
      goal.title = title;
    }

    if (targetAmount !== undefined) {
      goal.targetAmount = targetAmount;
    }

    if (savedAmount !== undefined) {
      goal.savedAmount = savedAmount;
    }

    await goal.save();

    return res.json({
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

// DELETE GOAL
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Goal ID is required",
      });
    }

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

    return res.json({
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

export { createGoal, getGoals, getGoalById, updateGoal, deleteGoal };
