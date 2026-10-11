import Groq from "groq-sdk";
import {
  getMonthlySpending,
  getTopSpendingCategory,
  getRecentTransactions,
  getBudgetSummary,
  getBudgetByCategory,
  getHighestBudgetUsage,
  getGoalSummary,
  getAllGoals,
  getGoalByTitle,
} from "../services/aiTools.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Reusable date parameter definitions (nullable strings).
const startDateParam = {
  type: ["string", "null"],
  description:
    "Inclusive start date in ISO format, YYYY-MM-DD. Omit for the current month.",
};

const endDateParam = {
  type: ["string", "null"],
  description:
    "Exclusive end date in ISO format, YYYY-MM-DD. Omit for the current month.",
};

const tools = [
  {
    type: "function",
    function: {
      name: "get_monthly_spending",
      description:
        "Get the user's total expenses and transaction count " +
        "for a date range. Defaults to the current month.",
      parameters: {
        type: "object",
        properties: {
          startDate: startDateParam,
          endDate: endDateParam,
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_top_spending_category",
      description:
        "Find the category with the highest total expenses " +
        "during a date range. Defaults to the current month.",
      parameters: {
        type: "object",
        properties: {
          startDate: startDateParam,
          endDate: endDateParam,
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_recent_transactions",
      description:
        "Get the user's most recent transactions, optionally within a date range.",
      parameters: {
        type: "object",
        properties: {
          startDate: {
            type: ["string", "null"],
            description:
              "Inclusive start date in ISO format, YYYY-MM-DD. Optional.",
          },
          endDate: {
            type: ["string", "null"],
            description:
              "Exclusive end date in ISO format, YYYY-MM-DD. Optional.",
          },
          limit: {
            type: ["integer", "null"],
            description:
              "Maximum number of transactions to return (1-50). Defaults to 10.",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_budget_summary",
      description:
        "Get the user's total budget limit, total spent, " +
        "remaining amount, and number of budget categories.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_budget_by_category",
      description:
        "Get budget limit, spending, remaining amount and " +
        "percentage used for a specified category.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "The budget category to look up.",
          },
        },
        required: ["category"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_highest_budget_usage",
      description: "Find the budget category with the highest percentage used.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_goal_summary",
      description:
        "Get the total number of savings goals, total target, " +
        "total saved, remaining amount and overall progress.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_all_goals",
      description:
        "Get all savings goals, including targets, saved amounts " +
        "and progress percentages.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_goal_by_title",
      description: "Find a savings goal by its title.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The goal title or search phrase.",
          },
        },
        required: ["title"],
        additionalProperties: false,
      },
    },
  },
];

const availableTools = {
  get_monthly_spending: async (args, userId) => {
    const { startDate, endDate } = getDateRange(args);
    return getMonthlySpending(userId, startDate, endDate);
  },

  get_top_spending_category: async (args, userId) => {
    const { startDate, endDate } = getDateRange(args);
    return getTopSpendingCategory(userId, startDate, endDate);
  },

  get_recent_transactions: async (args, userId) => {
    const { startDate, endDate, limit } = args;

    const safeLimit = Number.isInteger(limit)
      ? Math.min(Math.max(limit, 1), 50)
      : 10;

    // NOTE: update getRecentTransactions in services/aiTools.js to accept
    // optional dates and a 4th `limit` argument.
    return getRecentTransactions(
      userId,
      startDate ? parseDate(startDate) : undefined,
      endDate ? parseDate(endDate) : undefined,
      safeLimit,
    );
  },

  get_budget_summary: async (_, userId) => getBudgetSummary(userId),

  get_budget_by_category: async ({ category }, userId) => {
    if (typeof category !== "string" || !category.trim()) {
      throw new Error("A valid category is required.");
    }
    return getBudgetByCategory(userId, category.trim());
  },

  get_highest_budget_usage: async (_, userId) => getHighestBudgetUsage(userId),

  get_goal_summary: async (_, userId) => getGoalSummary(userId),

  get_all_goals: async (_, userId) => getAllGoals(userId),

  get_goal_by_title: async ({ title }, userId) => {
    if (typeof title !== "string" || !title.trim()) {
      throw new Error("A valid goal title is required.");
    }
    return getGoalByTitle(userId, title.trim());
  },
};

// Uses UTC boundaries consistently.
// If your app uses India-local calendar months, adjust to Asia/Kolkata.
function getDateRange({ startDate, endDate } = {}) {
  // Groq may send null for optional dates.
  startDate = startDate || undefined;
  endDate = endDate || undefined;

  // Default to the current UTC calendar month.
  if (!startDate && !endDate) {
    const now = new Date();

    return {
      startDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
      endDate: new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
      ),
    };
  }

  // Require both dates for a custom range.
  if (!startDate || !endDate) {
    throw new Error("Both startDate and endDate are required.");
  }

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (start >= end) {
    throw new Error("Invalid date range: startDate must be before endDate.");
  }

  return { startDate: start, endDate: end };
}

function parseDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Dates must use YYYY-MM-DD format.");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("Invalid date.");
  }

  return date;
}

const askAi = async (req, res) => {
  try {
    const { question } = req.body;

    // Change this property to match your JWT middleware.
    const userId = req.user.userId;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question.",
      });
    }

    const today = new Date().toISOString().slice(0, 10);

    const messages = [
      {
        role: "system",
        content: `
You are FinMate, an AI personal finance assistant.

Today's date is ${today}.

Answer questions about the user's transactions, budgets, and savings goals
using the available tools.

Rules:
- Use tools for factual questions about the user's financial data.
- Never invent totals, balances, transactions, or goal progress.
- Interpret relative dates such as "this month" and "last month" accurately,
  based on today's date.
- Tool date ranges use an inclusive start and exclusive end, in YYYY-MM-DD format.
- If a tool returns an error, fix your arguments and try again if possible.
- Explain results in clear, concise language.
- Format financial amounts in INR (₹).
- If a tool returns no matching records, explain that clearly.
- You cannot access another user's records.
        `.trim(),
      },
      {
        role: "user",
        content: question.trim(),
      },
    ];

    // Limit model/tool interaction rounds.
    for (let round = 0; round < 2; round++) {
      const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL,
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0,
      });

      const message = completion.choices[0].message;

      messages.push(message);

      // The model has produced its final answer.
      if (!message.tool_calls?.length) {
        return res.status(200).json({
          success: true,
          answer: message.content ?? "",
        });
      }

      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name;
        const executeTool = availableTools[toolName];

        let result;

        if (!executeTool) {
          result = { error: `Unsupported tool: ${toolName}` };
        } else {
          try {
            const args = JSON.parse(toolCall.function.arguments || "{}");

            // IMPORTANT: userId always comes from authentication.
            // It is never taken from the model's arguments.
            result = await executeTool(args, userId);
          } catch (err) {
            // Feed errors back so the model can correct itself.
            result = { error: err.message };
          }
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    return res.status(502).json({
      success: false,
      message: "The assistant reached its tool-call limit.",
    });
  } catch (error) {
    console.error("AI assistant error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to answer your question",
    });
  }
};

export { askAi };
