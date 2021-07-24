const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

// HTTP Request Logger
const logger = require("morgan");

//Database connection
const db = require("./db");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("tiny"));

// Route middlewares
// Import routes
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

// Server
app.listen(PORT, () => {
  console.log(`Server runnning on port ${PORT}...`);
});
