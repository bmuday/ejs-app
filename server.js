// Import files, dependencies and configuration
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
// HTTP Request Logger
const logger = require("morgan");
//Database connection
const db = require("./db");
// Parse Cookies
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");
const userRoute = require("./routes/user");

// Import routes and middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("tiny"));
app.use(cookieParser());
// Static files
app.use(express.static("public"));
// Routes
app.use("/", userRoute);

// Set the view engine to ejs
app.set("view engine", "ejs");

// Authentify all users before accessing views
app.get("*", auth);

// Go to the homepage
app.get("/", (req, res) => {
  res.render("home");
});

// Server
app.listen(PORT, () => {
  console.log(`Server runnning on port ${PORT}...`);
});
