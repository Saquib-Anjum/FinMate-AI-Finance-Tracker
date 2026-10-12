import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import userRouter from "./routes/userRouter.js";
import connectDB from "./config/db.js";
import transactionsRouter from "./routes/transactionsRoute.js";
import budgetRouter from "./routes/budgetRoute.js";
import goalRouter from "./routes/goalRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";
import profileRouter from "./routes/profileRoute.js";
import aiRouter from "./routes/aiAssistantRoute.js";
import analyticsRouter from "./routes/analyticsRoute.js";
import accountRouter from "./routes/accountRoute.js";
import settingsRouter from "./routes/settingRout.js";
const app = express();
// middleware
app.use(express.json());
app.use(cors());
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database unavailable:", err.message);
    res.status(503).json({
      success: false,
      message: "Database temporarily unavailable",
    });
  }
});
//routes
app.use("/api/auth", userRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/goal", goalRouter);
app.use("/api/profile", profileRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/ai", aiRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/account", accountRouter);

app.use("/api/settings", settingsRouter);
app.use("/", (req, res) => {
  res.json({
    message: "server is running",
  });
});
//listening app
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running PORT: ${PORT}| http://localhost:${PORT}`);
});
