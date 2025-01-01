const express = require("express");
const connectDB = require('./config/database');
const app = express();

const authRouter = require("./routes/authRouter");

app.use("/", authRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error(err.message,"Database cannot be connected!!");
  });

  