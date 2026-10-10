import transactionModel from "../models/transactionsModel.js";
import budgetModel from "../models/budgetModel.js";
import goalModel from "../models/goalModel.js";

const dashboardData = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 1. Get selected month and year
    const now = new Date();

    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 9999
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid month or year",
      });
    }

    // 2. Current and previous month date ranges
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const previousMonthStart = new Date(year, month - 2, 1);
    const previousMonthEnd = startDate;

    // 3. Fetch current and previous month transactions
    const [transactions, previousTransactions, budgets, goals] =
      await Promise.all([
        transactionModel
          .find({
            userId,
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          })
          .sort({ date: -1, createdAt: -1 })
          .lean(),

        transactionModel
          .find({
            userId,
            date: {
              $gte: previousMonthStart,
              $lt: previousMonthEnd,
            },
          })
          .lean(),

        budgetModel.find({ userId }).lean(),

        goalModel.find({ userId }).lean(),
      ]);

    // 4. Calculate current month totals
    let totalIncome = 0;
    let totalExpense = 0;

    const categoryTotals = {};

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount) || 0;

      if (transaction.type === "Income") {
        totalIncome += amount;
      } else if (transaction.type === "Expense") {
        totalExpense += amount;

        const category = transaction.category || "Other";

        categoryTotals[category] =
          (categoryTotals[category] || 0) + amount;
      }
    });

    const savings = totalIncome - totalExpense;

    // 5. Calculate previous month totals
    let previousIncome = 0;
    let previousExpense = 0;

    previousTransactions.forEach((transaction) => {
      const amount = Number(transaction.amount) || 0;

      if (transaction.type === "Income") {
        previousIncome += amount;
      } else if (transaction.type === "Expense") {
        previousExpense += amount;
      }
    });

    const previousSavings = previousIncome - previousExpense;

    // 6. Calculate percentage changes
    const getPercentageChange = (current, previous) => {
      if (previous === 0) {
        return current === 0
          ? 0
          : null;
      }

      return Number(
        (
          ((current - previous) / Math.abs(previous)) *
          100
        ).toFixed(1)
      );
    };

    const changes = {
      balance: getPercentageChange(savings, previousSavings),
      income: getPercentageChange(totalIncome, previousIncome),
      expense: getPercentageChange(totalExpense, previousExpense),
      savings: getPercentageChange(savings, previousSavings),
    };

    // 7. Monthly spending by category (top five)
    const monthlySpendingCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          totalExpense > 0
            ? Number(((amount / totalExpense) * 100).toFixed(2))
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const monthlySpendingByCategory = {
      totalExpense,
      categories: monthlySpendingCategories.slice(0, 5),
    };

    // 8. Calculate budget usage
    const budgetData = budgets.map((budget) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.type === "Expense" &&
            transaction.category === budget.category
        )
        .reduce(
          (total, transaction) =>
            total + (Number(transaction.amount) || 0),
          0
        );

      const limit = Number(budget.limit) || 0;
      const remaining = limit - spent;

      const percentage =
        limit > 0 ? (spent / limit) * 100 : 0;

      return {
        category: budget.category,
        limit,
        spent,
        remaining,
        percentage: Number(percentage.toFixed(2)),
      };
    });

    // 9. Calculate savings goal progress
    const goalData = goals.map((goal) => {
      const targetAmount = Number(goal.targetAmount) || 0;
      const savedAmount = Number(goal.savedAmount) || 0;

      const percentage =
        targetAmount > 0
          ? (savedAmount / targetAmount) * 100
          : 0;

      return {
        title: goal.title,
        targetAmount,
        savedAmount,
        remaining: targetAmount - savedAmount,
        percentage: Number(percentage.toFixed(2)),
      };
    });

    // 10. Recent transactions
    const recentTransactions = transactions.slice(0, 5);

    // 11. Dashboard response
    return res.status(200).json({
      success: true,

      period: {
        month,
        year,
      },

      summary: {
        totalBalance: savings,
        totalIncome,
        totalExpense,
        savings,

        changes,

        previousMonth: {
          totalIncome: previousIncome,
          totalExpense: previousExpense,
          savings: previousSavings,
        },
      },

      monthlySpendingByCategory,

      budgets: budgetData,

      goals: goalData,

      recentTransactions,
    });
  } catch (err) {
    console.error("Dashboard error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};

export { dashboardData };