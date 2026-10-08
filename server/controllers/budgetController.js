import budgetModel from "../models/budgetModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

//Create budget
const createBudget = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "authorization failed",
      });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(409).json({
        success: false,
        message: "User Not Found",
      });
    }

    const { category, limit, spent } = req.body;

    const budget = await budgetModel.create({
      userId: user._id,
      category,
      limit,
      spent,
    });
    res.json({
      success: true,
      message: "budget created",
      data: budget,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// get all budget
const getBudgets = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Not Authorize",
      });
    }

    const budgets = await budgetModel.find({ userId: userId });
    if (!budgets) {
      return res.json({
        success: false,
        message: "budget not found for this user specific user",
      });
    }
    res.json({
      success: true,
      data: budgets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// get budget by Id
const getBudgetId = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User is not authorized",
      });
    }
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "budget id is required",
      });
    }

    const budget = await budgetModel.findById(id);
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "budget not found",
      });
    }

    res.json({
      success: true,
      data: budget,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// update budget
const updateBudget = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User is not authorized",
      });
    }
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "budget id is required",
      });
    }

    const { category, limit, spent } = req.body;

    const budget = await budgetModel.findById(id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    if (category !== undefined) {
      budget.category = category;
    }
    if (limit !== undefined) {
      budget.limit = limit;
    }
    if (spent !== undefined) {
      budget.spent = spent;
    }

    await budget.save();
    res.json({
      success: true,
      message: "Budget updated",
      data: budget,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// delete budget
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Budget ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget ID",
      });
    }
    const budget = await budgetModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }
    res.json({
      success: true,
      message: "Budget deleted sucessfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { createBudget, getBudgets, getBudgetId, updateBudget, deleteBudget };
