const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    const connection = await mongoose.connect("mongodb://127.0.0.1:27017/IBY?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2", {
    });
    console.log(`MongoDB connected to host: ${connection.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};
