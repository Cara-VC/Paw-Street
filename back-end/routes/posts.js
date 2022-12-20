const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require("../data");
const posts = data.posts;
const checker = require("../public/util");
// const firebase = require("../config/firebase/Firebase");
// const auth = firebase.auth;
const { shrinkImage } = require("../public/shrinkImage");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

//get all posts
router.get("/", async (req, res) => {
  console.log("get /posts");
  try {
    const allPosts = await posts.getAllPosts();
    res.json(allPosts);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});

//unfinished
router.get("/:longitude/:latitude", async (req, res) => {
  //console.log("get /:longitude/:latitude");
  try {
    let longitude = req.params.longitude;
    let latitude = req.params.latitude;
    let pagenum = req.query.pagenum;
    let story = req.query.story;
    let found = req.query.found;
    let lost = req.query.lost;
    let distance = req.query.distance;
    let time = req.query.time;

    // console.log(
    //   longitude,
    //   latitude,
    //   pagenum,
    //   story,
    //   found,
    //   lost,
    //   distance,
    //   time
    // )
    const allPosts = await posts.getPostsWithParams(
      longitude,
      latitude,
      pagenum,
      story,
      found,
      lost,
      distance,
      time
    );
    res.json(allPosts);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  console.log("post /posts/");
  try {
    let userName = req.body.userName;
    let userId = req.body.userId;
    let status = req.body.status;
    let title = req.body.title;
    let content = req.body.content;
    let imageName = req.file.originalname;
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    let petName = req.body.petName;
    // let token = req.body.token;
    // auth
    //   .verifyIdToken(token)
    //   .then((decodedToken) => {
    //     const uid = decodedToken.uid;
    //     console.log(uid);
    //     console.log(userId);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    //console.log("token", token);

    const newPost = await posts.creatPost(
      userName,
      userId,
      status,
      title,
      content,
      imageName,
      longitude,
      latitude,
      petName
    );
    res.status(200).json(newPost);
  } catch (e) {
    console.log(e);
    res.status(500).json(`${e.message}`);
  }
});

router.get("/:id", async (req, res) => {
  console.log("get /posts/:id", req.params.id);
  try {
    let postId = req.params.id;
    postId = checker.checkPostId(postId);
    let exists = await client.exists(postId);
    var thePost = undefined;
    if (exists) {
      console.log(`Show posId ${postId} from Redis Cache.`);
      thePost = await JSON.parse(await client.get(postId));
    } else {
      //console.log(`posId ${postId} not in Redis.`);
      thePost = await posts.getPostById(postId);
      await client.set(postId, JSON.stringify(thePost));
    }
    res.status(200).json(thePost);
    //console.log("checkSweetId")
  } catch (e) {
    //console.log(e);
    res.status(500).json({ message: e });

  }
});

router.patch("/:id", async (req, res) => {
  console.log("patch /posts/:id");
  if (!req.body) {
    res.status(400).json({ error: "No information to update." });
    return;
  }
  try {
    const updatedInfo = req.body;
    const postId = checker.checkPostId(req.params.id);
    let updatedPost = await posts.patchById(postId, updatedInfo);
    let exists = await client.exists(postId);
    if (exists) {
      console.log(`Update posId ${postId} in Redis Cache.`);
      await client.set(postId, JSON.stringify(updatedPost));
    }
    res.status(200).json(updatedPost);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});

router.delete("/:id", async (req, res) => {
  console.log("delete /posts/:id", req.params.id);
  //console.log("req.headers", req.headers.token);
  try {
    const postId = checker.checkPostId(req.params.id);
    const token = checker.checkToken(req.headers.token);
    let exists = await client.exists(postId);
    if (exists) {
      console.log(`Delete posId ${postId} in Redis Cache.`);
      await client.del(postId);
    }
    const result = await posts.deleteById(postId, token);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ e });
  }
});

router.post("/:id/comment", async (req, res) => {
  console.log("post /posts/:id/comment");
  const commentInfo = req.body;
  if (!commentInfo)
    return res.status(400).json({ error: "Comment can't be empty." });
  const postId = checker.checkPostId(req.params.id);
  try {
    const comment = checker.checkComment(commentInfo.comment);
    const userId = checker.checkUserId(commentInfo.userId);
    const userName = checker.checkUsername(commentInfo.userName);

    const addComment = await posts.addComment(
      userId,
      userName,
      comment,
      postId
    );
    let exists = await client.exists(postId);
    if (exists) {
      console.log(`Update posId ${postId} in Redis Cache(post comment).`);
      await client.set(postId, JSON.stringify(addComment));
    }
    res.status(200).json(addComment);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});

router.delete("/:postId/:commentId", async (req, res) => {
  console.log("delete /posts/:postid/:commentid");

  try {
    const commentId = checker.checkPostId(req.params.commentId);
    const postId = checker.checkPostId(req.params.postId);
    const token = checker.checkToken(req.headers.token);
    const result = await posts.deleteComment(commentId, postId, token);
    let exists = await client.exists(postId);
    if (exists) {
      console.log(`Update posId ${postId} in Redis Cache(delete comment).`);
      await client.set(postId, JSON.stringify(result));
    }
    res.status(200).json(result);
  } catch (e) {

    console.log(e);
    res.status(500).json({ message: e });
  }
});

module.exports = router;
