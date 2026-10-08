import { Router } from "express";
import {
  createTransactions,
  getTransactions,
  getTransactionsById,
  updateTransactions,
} from "../controllers/transactionsController.js";
import { protect } from "../middlewares/auth.js";
const transactionsRouter = Router();
transactionsRouter.post("/create", protect, createTransactions);
transactionsRouter.get("/get", protect, getTransactions);
transactionsRouter.get("/get/:id", protect, getTransactionsById);
transactionsRouter.put("/update/:id", protect, updateTransactions);
export default transactionsRouter;
