const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true,
      minLength: [6, "Minimum username length is 6 characters"],
      maxLength: [1024, "Maximum username length is 1024 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minLength: [8, "Minimum password length is 8 characters"],
      maxLength: [1024, "Maximum password length is 1024 characters"],
    },
  },
  {
    timestamps: true,
  }
);

/* // Custom Hooks
// Fire a function before doc saved to db
userSchema.pre("save", (next) => {
  console.log(this);
  next();
});

// Fire a function after doc saved to db
userSchema.post("save", (doc, next) => {
  console.log(doc);
  next();
}); */

// Hashing password before saving user
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.log(err);
  }
  next();
});

// Static method to login user
userSchema.statics.login = async function (username, password) {
  console.log("this", this);
  console.log(username, password);
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect username");
};

module.exports = mongoose.model("User", userSchema);
