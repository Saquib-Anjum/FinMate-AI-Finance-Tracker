import mongoose from "mongoose";
import transactionsModel from "../models/transactionsModel.js";

// Create a transaction
const createTransactions = async (req, res) => {
  try {
    const { type, title, amount, category, date } = req.body;
    const { userId } = req.user;

    if (
      !type ||
      !title ||
      amount === undefined ||
      amount === null ||
      !category ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const transaction = await transactionsModel.create({
      userId,
      type,
      title,
      amount,
      category,
      date,
    });

    return res.status(201).json({
      success: true,
      message: "New transaction added",
      data: transaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const transactions = await transactionsModel
      .find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get transaction by ID
const getTransactionsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    // Find transaction belonging to logged-in user
    const transaction = await transactionsModel.findOne({
      _id: id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update transaction
const updateTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const { type, title, amount, category, date } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    // Check whether ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    // Find transaction and make sure it belongs to logged-in user
    const transaction = await transactionsModel.findOne({
      _id: id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Update only provided fields
    if (type !== undefined) {
      transaction.type = type;
    }

    if (title !== undefined) {
      transaction.title = title;
    }

    if (amount !== undefined) {
      transaction.amount = amount;
    }

    if (category !== undefined) {
      transaction.category = category;
    }

    if (date !== undefined) {
      transaction.date = date;
    }

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete transaction
const deleteTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    const transaction = await transactionsModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  createTransactions,
  getTransactions,
  getTransactionsById,
  updateTransactions,
  deleteTransactions,
};
