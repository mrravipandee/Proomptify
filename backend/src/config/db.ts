import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB connected successfully");
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:");
    if (error.name === 'MongoNetworkError') {
      console.error("Network error while connecting to MongoDB. Please check your network connection and MongoDB server status.");
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
};