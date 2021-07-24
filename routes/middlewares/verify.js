const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    /* console.log(decodedToken); */
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
      res.locals.user = null;
      next();
    } else {
      next();
    }
  } catch {
    res.locals.user = null;
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
