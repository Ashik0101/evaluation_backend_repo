const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded) {
      req.body.userID = decoded.userID;
      next();
    } else {
      res.send({ msg: "Wrong credentials from authenticate middleware!!" });
      console.log("wrong credentials!!", err);
    }
  } else {
    res.send({ msg: "Wrong credentials!!" });
    console.log("wrong credentials :", err);
  }
};

module.exports = { authenticate };
