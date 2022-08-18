const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {
    username: "",
    email: "",
    password: "",
  };

  if (err.message === "Incorrect username") {
    errors.username = "That username is not registered";
  } else if (err.message === "Incorrect password") {
    errors.password = "That password is incorrect";
  }

  // Duplicate error code
  if (err.code === 11000) {
    if (err.message.includes("username")) {
      errors.username =
        "That username is already used. Please choose another one.";
    } else if (err.message.includes("email")) {
      errors.email =
        "That email is already registered. Please login or choose another one.";
    }
  }

  // Validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// Create and assign a token
const maxAge = 5 * 60; // in seconds
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// Register
const userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  // Create the user
  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // maxAge in milliseconds
    res.status(201).send({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(401).json({ message: "User not created", errors });
  }
};

// Login
const userLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(username, password);
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // maxAge in milliseconds
    res.status(200).json({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ message: "User not logged in", errors });
  }
};

const userLogout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
};
