const mongoose = require("mongoose");

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDb Connected : ${con.connection.host}`);
  } catch (err) {
    console.log(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
