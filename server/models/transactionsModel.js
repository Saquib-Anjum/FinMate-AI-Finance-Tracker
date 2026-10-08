import mongoose from "mongoose";
import { CATEGORY } from "../constant/data.js";
const transactionsSchema =new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Expense", "Income"],
      default: "Expense",
    },
    title: {
      type: String,
    },
    amount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum:CATEGORY,
    default:'Shoping'
      },
    date: {
      type: Date,
    },
  },
  { timestamps: true },
);

const transactionsModel =
  mongoose.models.Transactions ||
  mongoose.model("Transactions", transactionsSchema);

export default transactionsModel;
