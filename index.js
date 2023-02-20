const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connection } = require("./config/db");
const { userRouter } = require("./Routes/Users.routes");
const { postRouter } = require("./Routes/Post.routes");
const { authenticate } = require("./Middlewares/authenticate");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "Hello From Home Page!!!" });
});
app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts", postRouter);
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("<><><> Server is connected to DB <><><>");
    console.log(`<><><> Server is listening on port ${process.env.port}`);
  } catch (err) {
    console.log("Some error in connecting to db!!", err);
  }
});
