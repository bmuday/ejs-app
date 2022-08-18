const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => "Database connection has failed!");
