const router = require("express").Router();
const { userRegister, userLogin, userLogout } = require("../controllers/user");

// Go to the register page
router.get("/register", (req, res) => {
  res.render("register");
});

// register user
router.post("/register", userRegister);

// Go to the login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login user
router.post("/login", userLogin);

// Logout
router.get("/logout", userLogout);

// Private routes

// Go to the posts
router.get("/posts", (req, res) => {
  console.log("user:", res.locals.user);
  res.render("posts");
});

module.exports = router;
