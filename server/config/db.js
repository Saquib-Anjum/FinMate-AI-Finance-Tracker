
import mongoose from "mongoose";

let connectionPromise;

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected ❤️");
  });

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .catch((err) => {
        connectionPromise = null;
        console.error("MongoDB connection failed:", err.message);
        throw err;
      });
  }

  return connectionPromise;
};

export default connectDB;
