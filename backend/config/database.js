const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    const connection = await mongoose.connect("mongodb+srv://ashwinaj4545:Ashwin4545%23@cluster0.fnnoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    });
    console.log(`MongoDB connected to host: ${connection.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};
