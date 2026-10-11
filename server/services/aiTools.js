import mongoose from "mongoose";
import transactionsModel from "../models/transactionsModel.js";
import budgetModel from "../models/budgetModel.js";
import goalModel from "../models/goalModel.js";

const getUserObjectId = (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }
  return new mongoose.Types.ObjectId(userId);
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getDateFilter = (startDate, endDate) => {
  if (startDate == null && endDate == null) return {};
  if (!startDate || !endDate) {
    throw new Error("Both startDate and endDate are required");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start >= end
  ) {
    throw new Error("Invalid date range");
  }

  return { date: { $gte: start, $lt: end } };
};

// Get the user's total expenses and transaction count for a date range.
const getMonthlySpending = async (userId, startDate, endDate) => {
  const userObjectId = getUserObjectId(userId);

  const result = await transactionsModel.aggregate([
    {
      $match: {
        userId: userObjectId,
        type: "Expense",
        ...getDateFilter(startDate, endDate),
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" },
        transactionCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalExpense: 1,
        transactionCount: 1,
      },
    },
  ]);

  return (
    result[0] ?? {
      totalExpense: 0,
      transactionCount: 0,
    }
  );
};

// Find the category with the highest total expenses in a date range.
const getTopSpendingCategory = async (userId, startDate, endDate) => {
  const userObjectId = getUserObjectId(userId);

  const result = await transactionsModel.aggregate([
    {
      $match: {
        userId: userObjectId,
        type: "Expense",
        ...getDateFilter(startDate, endDate),
      },
    },
    {
      $group: {
        _id: "$category",
        totalSpent: { $sum: "$amount" },
        transactionCount: { $sum: 1 },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 1 },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalSpent: 1,
        transactionCount: 1,
      },
    },
  ]);

  return (
    result[0] ?? {
      category: null,
      totalSpent: 0,
      transactionCount: 0,
    }
  );
};

// Get the user's ten most recent transactions, optionally filtered by date.
const getRecentTransactions = async (userId, startDate, endDate) => {
  const userObjectId = getUserObjectId(userId);

  return transactionsModel.aggregate([
    {
      $match: {
        userId: userObjectId,
        ...getDateFilter(startDate, endDate),
      },
    },
    { $sort: { date: -1, _id: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 1,
        title: 1,
        amount: 1,
        type: 1,
        category: 1,
        date: 1,
      },
    },
  ]);
};

// Calculate the user's total budget limit, spending, remaining amount, and category count.
const getBudgetSummary = async (userId) => {
  const userObjectId = getUserObjectId(userId);

  const result = await budgetModel.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: null,
        totalLimit: { $sum: "$limit" },
        totalSpent: { $sum: "$spent" },
        totalCategories: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalLimit: 1,
        totalSpent: 1,
        totalRemaining: { $subtract: ["$totalLimit", "$totalSpent"] },
        totalCategories: 1,
      },
    },
  ]);

  return (
    result[0] ?? {
      totalLimit: 0,
      totalSpent: 0,
      totalRemaining: 0,
      totalCategories: 0,
    }
  );
};

// Find a budget by category and calculate its remaining amount and percentage used.
const getBudgetByCategory = async (userId, category) => {
  const userObjectId = getUserObjectId(userId);

  if (typeof category !== "string" || !category.trim()) {
    throw new Error("A valid category is required");
  }

  const result = await budgetModel.aggregate([
    {
      $match: {
        userId: userObjectId,
        category: {
          $regex: `^${escapeRegex(category.trim())}$`,
          $options: "i",
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: 1,
        limit: 1,
        spent: 1,
        remaining: { $subtract: ["$limit", "$spent"] },
        percentageUsed: {
          $cond: [
            { $gt: ["$limit", 0] },
            {
              $round: [
                { $multiply: [{ $divide: ["$spent", "$limit"] }, 100] },
                2,
              ],
            },
            0,
          ],
        },
      },
    },
    { $limit: 1 },
  ]);

  return result[0] ?? null;
};

// Find the budget category with the highest percentage of its limit used.
const getHighestBudgetUsage = async (userId) => {
  const userObjectId = getUserObjectId(userId);

  const result = await budgetModel.aggregate([
    {
      $match: {
        userId: userObjectId,
        limit: { $gt: 0 },
      },
    },
    {
      $addFields: {
        percentageUsed: {
          $multiply: [{ $divide: ["$spent", "$limit"] }, 100],
        },
      },
    },
    { $sort: { percentageUsed: -1 } },
    { $limit: 1 },
    {
      $project: {
        _id: 0,
        category: 1,
        limit: 1,
        spent: 1,
        percentageUsed: { $round: ["$percentageUsed", 2] },
      },
    },
  ]);

  return result[0] ?? null;
};

// Calculate total savings goals, target amount, saved amount, remaining amount, and overall progress.
const getGoalSummary = async (userId) => {
  const userObjectId = getUserObjectId(userId);

  const result = await goalModel.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: null,
        totalGoals: { $sum: 1 },
        totalTarget: { $sum: "$targetAmount" },
        totalSaved: { $sum: "$savedAmount" },
      },
    },
    {
      $project: {
        _id: 0,
        totalGoals: 1,
        totalTarget: 1,
        totalSaved: 1,
        totalRemaining: {
          $max: [0, { $subtract: ["$totalTarget", "$totalSaved"] }],
        },
        overallProgress: {
          $cond: [
            { $gt: ["$totalTarget", 0] },
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$totalSaved", "$totalTarget"] },
                    100,
                  ],
                },
                2,
              ],
            },
            0,
          ],
        },
      },
    },
  ]);

  return (
    result[0] ?? {
      totalGoals: 0,
      totalTarget: 0,
      totalSaved: 0,
      totalRemaining: 0,
      overallProgress: 0,
    }
  );
};

// Get all savings goals with their remaining amounts and progress percentages.
const getAllGoals = async (userId) => {
  const userObjectId = getUserObjectId(userId);

  return goalModel.aggregate([
    { $match: { userId: userObjectId } },
    {
      $addFields: {
        remainingAmount: {
          $max: [0, { $subtract: ["$targetAmount", "$savedAmount"] }],
        },
        progressPercentage: {
          $cond: [
            { $gt: ["$targetAmount", 0] },
            {
              $multiply: [{ $divide: ["$savedAmount", "$targetAmount"] }, 100],
            },
            0,
          ],
        },
      },
    },
    { $sort: { progressPercentage: -1 } },
    {
      $project: {
        _id: 1,
        title: 1,
        targetAmount: 1,
        savedAmount: 1,
        remainingAmount: 1,
        progressPercentage: { $round: ["$progressPercentage", 2] },
      },
    },
  ]);
};

// Find a savings goal by its title or a matching phrase.
const getGoalByTitle = async (userId, title) => {
  const userObjectId = getUserObjectId(userId);

  if (typeof title !== "string" || !title.trim()) {
    throw new Error("A valid goal title is required");
  }

  const result = await goalModel.aggregate([
    {
      $match: {
        userId: userObjectId,
        title: {
          $regex: escapeRegex(title.trim()),
          $options: "i",
        },
      },
    },
    {
      $addFields: {
        remainingAmount: {
          $max: [0, { $subtract: ["$targetAmount", "$savedAmount"] }],
        },
        progressPercentage: {
          $cond: [
            { $gt: ["$targetAmount", 0] },
            {
              $multiply: [{ $divide: ["$savedAmount", "$targetAmount"] }, 100],
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        targetAmount: 1,
        savedAmount: 1,
        remainingAmount: 1,
        progressPercentage: { $round: ["$progressPercentage", 2] },
      },
    },
  ]);

  return result;
};

export {
  getMonthlySpending,
  getTopSpendingCategory,
  getRecentTransactions,
  getBudgetSummary,
  getBudgetByCategory,
  getHighestBudgetUsage,
  getGoalSummary,
  getAllGoals,
  getGoalByTitle,
};
