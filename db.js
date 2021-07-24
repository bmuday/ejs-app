const mongoose = require("mongoose");

const dotenv = require("dotenv").config();

const credentials = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

mongoose
  .connect(
    `mongodb+srv://${credentials.user}:${credentials.password}@cluster0.nnbxv.mongodb.net/${credentials.database}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => "Connection to the database has failed!");
