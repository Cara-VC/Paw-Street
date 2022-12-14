const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require("../data");
const posts = data.posts;
const checker = require("../public/util");

router.get("/:uid", async (req, res) => {
  console.log("get /posts/user/:uid", req.params.uid);
  try {
    let userId = checker.checkUserId(req.params.uid);
    const postsByUser = await posts.getPostByUserId(userId);
    res.status(200).json(postsByUser);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: e });
  }
});

module.exports = router;
