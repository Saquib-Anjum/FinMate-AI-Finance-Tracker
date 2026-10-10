import { Router } from "express";
import {
  createTransactions,
  deleteTransactions,
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
transactionsRouter.delete('/delete/:id',protect,deleteTransactions)
export default transactionsRouter;
