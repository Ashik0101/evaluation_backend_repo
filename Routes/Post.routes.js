const express = require("express");
const { PostModel } = require("../Models/Post.model");
require("dotenv").config();
const postRouter = express.Router();
postRouter.use(express.json());

//create method is here
postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const data = new PostModel(payload);
    await data.save();
    res.send({ msg: "Post Saved to DB!!" });
  } catch (err) {
    res.send({ msg: "Some error in posting the posts!!" });
    console.log("some error in posting the data :", err);
  }
});

//show the posts of the particular user
postRouter.get("/", async (req, res) => {
  const id = req.body.userID;

  let deviceValue = req.query.device;
  let deviceValue1 = req.query.device1;
  let deviceValue2 = req.query.device2;
  let queryObj = {};
  if (req.query.device) {
    queryObj["device"] = deviceValue;
  }
  let obj = {};
  if (req.query.device1 && req.query.device2) {
    obj["$and"] = [
      { device: `${deviceValue1}` },
      { device: `${deviceValue2}` },
    ];
  } else if (req.query.device) {
    obj["$and"] = [{ device: `${deviceValue}` }];
  }

  console.log(queryObj);

  try {
    const data = await PostModel.find({ userID: id, obj });
    res.send(data);
  } catch (err) {
    res.send({ msg: "Some error in data of particular user " });
    console.log("some errro in getting the post of particular usr :", err);
  }
});

//gettin post having maximum of comments
postRouter.get("/top", async (req, res) => {
  const id = req.body.userID;
  try {
    const data = await PostModel.find({ userID: id });
    let max = -Infinity;
    let oneData;
    for (let i = 0; i < data.length; i++) {
      if (data[i].no_of_comments > max) {
        max = data[i].no_of_comments;
        oneData = data[i];
      }
    }
    res.send(oneData);
  } catch (err) {
    res.send({ msg: "Some error in getting data of heighest comment" });
    console.log("Some error in getting data of heighest comment:", err);
  }
});

//updating a particular data
postRouter.put("/update/:id", async (req, res) => {
  let id = req.params.id;
  const payload = req.body;
  try {
    const data = await PostModel.find({ _id: id });
    if (data[0].userID !== req.body.userID) {
      res.send({ msg: "You are not authorized to update this data" });
    } else {
      await PostModel.findByIdAndUpdate({ _id: id }, payload);
      res.send({ msg: `Post having id ${id} got updated!!!` });
    }
  } catch (err) {
    res.send({ msg: "Some error in updataing the data!" });
    console.log("error in updateing the data :", err);
  }
});

//deleting a particular data
postRouter.delete("/delete/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const data = await PostModel.find({ _id: id });
    if (data[0].userID !== req.body.userID) {
      res.send({ msg: "You are not authorized to delete this data" });
    } else {
      await PostModel.findByIdAndDelete({ _id: id });
      res.send({ msg: `Post having id ${id} got deleted!!!` });
    }
  } catch (err) {
    res.send({ msg: "Some error in deleting the data!" });
    console.log("error in deleting the data :", err);
  }
});

module.exports = { postRouter };
