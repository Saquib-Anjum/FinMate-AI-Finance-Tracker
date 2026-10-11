
import mongoose from "mongoose";
import transactionsModel from "../models/transactionsModel.js";
import budgetModel from "../models/budgetModel.js";
import goalModel from "../models/goalModel.js";

// Calculate percentage change from the previous period.
const getPercentageChange = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : null;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};

// Safely calculate a percentage.
const getPercentage = (value, total) =>
  total > 0 ? Number(((value / total) * 100).toFixed(2)) : 0;

// Return the complete analytics dashboard for the authenticated user.
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user?.userId ?? req.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    const month = req.query.month
      ? Number(req.query.month)
      : now.getUTCMonth() + 1;

    const year = req.query.year
      ? Number(req.query.year)
      : now.getUTCFullYear();

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid month (1-12) and year.",
      });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));
    const previousStartDate = new Date(Date.UTC(year, month - 2, 1));
    const previousEndDate = startDate;
    const sixMonthsStartDate = new Date(Date.UTC(year, month - 6, 1));

    const transactionMatch = {
      userId: userObjectId,
      date: { $gte: startDate, $lt: endDate },
    };

    const previousTransactionMatch = {
      userId: userObjectId,
      date: {
        $gte: previousStartDate,
        $lt: previousEndDate,
      },
    };

    const [
      currentSummaryResult,
      previousSummaryResult,
      categoryResult,
      trendResult,
      budgets,
      goals,
      recentTransactions,
      allTimeResult,
    ] = await Promise.all([
      // Calculate selected-month income and expenses.
      transactionsModel.aggregate([
        { $match: transactionMatch },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: {
                $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0],
              },
            },
            totalExpense: {
              $sum: {
                $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0],
              },
            },
            transactionCount: { $sum: 1 },
          },
        },
      ]),

      // Calculate the previous month's income and expenses.
      transactionsModel.aggregate([
        { $match: previousTransactionMatch },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: {
                $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0],
              },
            },
            totalExpense: {
              $sum: {
                $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0],
              },
            },
          },
        },
      ]),

      // Calculate expense totals grouped by category for the selected month.
      transactionsModel.aggregate([
        {
          $match: {
            ...transactionMatch,
            type: "Expense",
          },
        },
        {
          $group: {
            _id: "$category",
            amount: { $sum: "$amount" },
            transactionCount: { $sum: 1 },
          },
        },
        { $sort: { amount: -1 } },
      ]),

      // Calculate monthly income and expenses for the latest six months.
      transactionsModel.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: {
              $gte: sixMonthsStartDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            income: {
              $sum: {
                $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0],
              },
            },
            expense: {
              $sum: {
                $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0],
              },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // Retrieve the user's budgets.
      budgetModel.find({ userId: userObjectId }).lean(),

      // Retrieve the user's savings goals.
      goalModel.find({ userId: userObjectId })
        .select("title targetAmount savedAmount createdAt")
        .sort({ createdAt: -1 })
        .lean(),

      // Retrieve the latest ten transactions in the selected month.
      transactionsModel.find(transactionMatch)
        .select("title amount type category date")
        .sort({ date: -1, _id: -1 })
        .limit(10)
        .lean(),

      // Calculate all-time income and expenses for the user's transaction history.
      transactionsModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: {
                $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0],
              },
            },
            totalExpense: {
              $sum: {
                $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0],
              },
            },
          },
        },
      ]),
    ]);

    const currentSummary = currentSummaryResult[0] ?? {
      totalIncome: 0,
      totalExpense: 0,
      transactionCount: 0,
    };

    const previousSummary = previousSummaryResult[0] ?? {
      totalIncome: 0,
      totalExpense: 0,
    };

    const totalIncome = currentSummary.totalIncome;
    const totalExpense = currentSummary.totalExpense;
    const netSavings = totalIncome - totalExpense;

    const allTime = allTimeResult[0] ?? {
      totalIncome: 0,
      totalExpense: 0,
    };

    const totalBalance = allTime.totalIncome - allTime.totalExpense;

    const totalCategoryExpense = categoryResult.reduce(
      (total, category) => total + category.amount,
      0
    );

    const monthlySpendingByCategory = categoryResult.map((item) => ({
      category: item._id || "Uncategorized",
      amount: item.amount,
      transactionCount: item.transactionCount,
      percentage: getPercentage(item.amount, totalCategoryExpense),
    }));

    const monthlyTrend = [];

    for (let offset = 5; offset >= 0; offset--) {
      const date = new Date(Date.UTC(year, month - 1 - offset, 1));
      const trendYear = date.getUTCFullYear();
      const trendMonth = date.getUTCMonth() + 1;

      const matchingMonth = trendResult.find(
        (item) =>
          item._id.year === trendYear &&
          item._id.month === trendMonth
      );

      monthlyTrend.push({
        year: trendYear,
        month: trendMonth,
        label: date.toLocaleDateString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
        income: matchingMonth?.income ?? 0,
        expense: matchingMonth?.expense ?? 0,
        savings:
          (matchingMonth?.income ?? 0) - (matchingMonth?.expense ?? 0),
      });
    }

    const budgetAnalytics = budgets.map((budget) => {
      const limit = Number(budget.limit) || 0;
      const spent = Number(budget.spent) || 0;

      return {
        category: budget.category,
        limit,
        spent,
        remaining: limit - spent,
        percentageUsed: getPercentage(spent, limit),
      };
    });

    const totalBudgetLimit = budgetAnalytics.reduce(
      (total, budget) => total + budget.limit,
      0
    );

    const totalBudgetSpent = budgetAnalytics.reduce(
      (total, budget) => total + budget.spent,
      0
    );

    const goalAnalytics = goals.map((goal) => {
      const targetAmount = Number(goal.targetAmount) || 0;
      const savedAmount = Number(goal.savedAmount) || 0;

      return {
        ...goal,
        remainingAmount: Math.max(0, targetAmount - savedAmount),
        progressPercentage: getPercentage(savedAmount, targetAmount),
      };
    });

    const totalGoalTarget = goalAnalytics.reduce(
      (total, goal) => total + (Number(goal.targetAmount) || 0),
      0
    );

    const totalGoalSaved = goalAnalytics.reduce(
      (total, goal) => total + (Number(goal.savedAmount) || 0),
      0
    );

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully.",
      data: {
        period: {
          month,
          year,
          startDate,
          endDate,
        },
        summary: {
          totalBalance,
          totalIncome,
          totalExpense,
          netSavings,
          savingsRate: getPercentage(netSavings, totalIncome),
          transactionCount: currentSummary.transactionCount,
          incomeChange: getPercentageChange(
            totalIncome,
            previousSummary.totalIncome
          ),
          expenseChange: getPercentageChange(
            totalExpense,
            previousSummary.totalExpense
          ),
        },
        monthlySpendingByCategory,
        monthlyTrend,
        budgets: {
          totalCategories: budgetAnalytics.length,
          totalLimit: totalBudgetLimit,
          totalSpent: totalBudgetSpent,
          totalRemaining: totalBudgetLimit - totalBudgetSpent,
          categories: budgetAnalytics,
        },
        goals: {
          totalGoals: goalAnalytics.length,
          totalTarget: totalGoalTarget,
          totalSaved: totalGoalSaved,
          totalRemaining: Math.max(0, totalGoalTarget - totalGoalSaved),
          overallProgress: getPercentage(totalGoalSaved, totalGoalTarget),
          items: goalAnalytics,
        },
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("Analytics controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch analytics.",
    });
  }
};

export { getAnalytics };
