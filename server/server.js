import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import userRouter from "./routes/userRouter.js";
import connectDB from "./config/db.js";
import transactionsRouter from "./routes/transactionsRoute.js";
import budgetRouter from "./routes/budgetRoute.js";
import goalRouter from "./routes/goalRoute.js";
import dashboardRouter from './routes/dashboardRoute.js'
import profileRouter from "./routes/profileRoute.js";
const app = express();
// middleware
app.use(express.json());
app.use(cors());
connectDB();
//routes
app.use("/api/auth", userRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/goal", goalRouter);
app.use('/api/profile',profileRouter)
app.use("/api/dashboard", dashboardRouter);
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
