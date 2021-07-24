const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../routes/middlewares/validation");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
  const { error, value } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { username, email, password } = value;

  // Checking if the user is already in the database
  const emailExists = await User.findOne({ email });
  if (emailExists)
    return res
      .status(400)
      .send("Email already exists. Please log in with your account.");

  const usernameExists = await User.findOne({ username });
  if (usernameExists)
    return res
      .status(400)
      .send("Username already exists. Please choose another one.");

  // Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.status(200).send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
};

const userLogin = async (req, res) => {
  const { error, value } = loginValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = value;

  // Checking if the email is already in the database
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Bad credentials. Try again.");

  //Checking if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Wrong password.");

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "2min",
  });

  /* res.cookie("jwt", token, { httpOnly: true }); */
  res.header("auth-token", token);
  res.send("User logged in!");
};

const userLogout = async (req, res) => {
  /* res.cookie("jwt", "", { maxAge: 1 }); */
};

module.exports = {
  userRegistration,
  userLogin,
  userLogout,
};
