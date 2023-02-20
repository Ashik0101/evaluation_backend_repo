const express = require("express");
const { UserModel } = require("../Models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userRouter = express.Router();
userRouter.use(express.json());

//register part is here
userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city } = req.body;
  try {
    const data = await UserModel.find({ email });
    if (data.length) {
      res.send({ msg: "User already exist,please login!!" });
    } else {
      bcrypt.hash(password, 5, (err, encrypted) => {
        if (err) {
          res.send({ msg: "Some error in encrypting the password!!" });
          console.log("some error in encrypting the password:", err);
        } else {
          const data = new UserModel({
            name,
            email,
            gender,
            password: encrypted,
            age,
            city,
          });
          data.save();
          res.send({ msg: "User Registered Successfully!!" });
        }
      });
    }
  } catch (err) {
    res.send({ msg: "Some error from register part!!" });
    console.log("some error from register part :", err);
  }
});

//login part is here
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await UserModel.find({ email });
    if (!data.length) {
      res.send({ msg: "Please register first!!" });
    } else {
      bcrypt.compare(password, data[0].password, (err, same) => {
        if (same) {
          const token = jwt.sign(
            { userID: data[0]._id },
            process.env.SECRET_KEY
          );
          res.send({ msg: "User Logged in successfully", token: token });
        } else {
          res.send({ msg: "Wrong Credentials!!" });
          console.log("Wrong credentials :", err);
        }
      });
    }
  } catch (err) {
    res.send({ msg: "Some error from login part!!" });
    console.log("some error from login :", err);
  }
});
module.exports = { userRouter };
