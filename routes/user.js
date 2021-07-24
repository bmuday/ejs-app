const router = require("express").Router();

const {
  userRegistration,
  userLogin,
  userLogout,
} = require("../controllers/user");

router.get("/", (req, res) => {
  res.send("Welcome to the user api!");
});

// Registration
router.post("/register", userRegistration);

// Login
router.post("/login", userLogin);

// Logout
router.post("/login", userLogout);

// Private routes

module.exports = router;
