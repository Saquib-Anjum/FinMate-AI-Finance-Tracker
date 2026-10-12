
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB CONNECTED ❤️");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
};

export default connectDB;
