const mongoCollections = require("../config/mongoCollections");
const postsCollections = mongoCollections.posts;
const checker = require("../public/util");
const { ObjectId } = require("mongodb");
const geolib = require("geolib");
const shrinkImage = require("../public/shrinkImage");
const firebase = require("../config/firebase/Firebase");
const auth = firebase.auth;
const bucket = firebase.bucket;
const uuid = require("uuid-v4");
var fs = require("fs");

// const { getPreciseDistance } from 'geolib';
//const { post } = require("../routes/posts");
function checkStatus(singleData, story, lost, found) {
  if (singleData.status == "story" && story == "true") {
    return true;
  }
  if (singleData.status == "lost" && lost == "true") {
    return true;
  }
  if (singleData.status == "found" && found == "true") {
    return true;
  }
  return false;
}

function checkTime(singleData, time) {
  let difference = new Date().getTime() - singleData.time;
  if (time == "all") {
    return true;
  }
  if (difference / 1000 / 60 / 60 / 24 <= 7 && time == "oneWeek") {
    return true;
  }
  if (difference / 1000 / 60 / 60 / 24 <= 30 && time == "oneMonth") {
    return true;
  }
  if (difference / 1000 / 60 / 60 / 24 <= 90 && time == "threeMonths") {
    return true;
  }
  return false;
}

function checkDistance(singleData, curLongitude, curLatitude, distance) {
  let tempDistance =
    geolib.getPreciseDistance(
      { latitude: curLatitude, longitude: curLongitude },
      { latitude: singleData.latitude, longitude: singleData.longitude }
    ) /
    1000 /
    1.6;
  if (distance == "1" && tempDistance <= 1) {
    return true;
  } else if (distance == "2" && tempDistance <= 5) {
    return true;
  } else if (distance == "3" && tempDistance <= 10) {
    return true;
  } else if (distance == "4" && tempDistance <= 50) {
    return true;
  } else if (distance == "5") {
    return true;
  }
  return false;
}

async function processImage(imageName) {
  //console.log("process image");
  //console.log(imageName);
  outputName = Date.now() + imageName;
  shrinkImage.shrinkImage(`public/${imageName}`, `public/${outputName}`);
  const metadata = {
    metadata: {
      firebaseStorageDownloadTokens: uuid(),
    },
    contentType: "image",
    cacheControl: "public, max-age=31536000",
  };
  //console.log(outputName);
  await new Promise((r) => setTimeout(r, 1000));
  await bucket.upload(`public/${outputName}`, {
    gzip: true,
    metadata: metadata,
  });
  //console.log("metadata", metadata);
  const url = `https://firebasestorage.googleapis.com/v0/b/paw-street-cb83d.appspot.com/o/${outputName}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`;
  console.log(url);
  fs.unlinkSync(`public/${imageName}`);
  fs.unlinkSync(`public/${outputName}`);
  return url;
}

module.exports = {
  async creatPost(
    userName,
    userId,
    status,
    title,
    content,
    imageName,
    longitude,
    latitude,
    petName
  ) {
    userName = checker.checkUsername(userName);
    userId = checker.checkUserId(userId);
    status = checker.checkStatus(status);
    title = checker.checkTitle(title);
    content = checker.checkContent(content);
    const imageUrl = [];
    imageUrl.push(await processImage(imageName));

    const postsCollection = await postsCollections();

    let newPost = {
      userName: userName,
      userId: userId,
      status: status,
      title: title,
      content: content,
      image: imageUrl,
      longitude: longitude,
      latitude: latitude,
      comments: [],
      petName: petName,
      time: Date.now(),
    };

    try {
      const insertInfo = await postsCollection.insertOne(newPost);
      if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Could not create new post";

      const newId = insertInfo.insertedId.toString();
      let post = await postsCollection.findOne({ _id: ObjectId(newId) });
      post._id = newId;
      return post;
    } catch (e) {
      //console.log(e);
      throw e;
    } finally {
      //await postsCollection.closeConnection();
    }
  },

  async getAllPosts() {
    try {
      const postsCollection = await postsCollections();
      const allPosts = await postsCollection.find({}).limit(20).toArray();
      if (!allPosts) throw "Could not get all sweets";
      for (let i = 0; i < allPosts.length; i++) {
        allPosts[i]._id = allPosts[i]._id.toString();
      }
      return allPosts;
    } catch (e) {
      //console.log(e);
      throw e;
    } finally {
      //await postsCollection.closeConnection();
    }
  },

  async getPostByUserId(userId, pageNum) {
    try {
      userId = checker.checkUserId(userId);
      pageNum = checker.checkPageNum(pageNum);
      const postsCollection = await postsCollections();
      const limit = 10;
      const skip = (pageNum - 1) * limit;
      const postsByUserId = await postsCollection
        .find({ userId: userId })
        .skip(skip)
        .limit(limit)
        .toArray();
      if (!postsByUserId) throw `No post by userId ${userId}`;
      //console.log(postsByUserId);
      for (let post of postsByUserId) {
        post._id = post._id.toString();
      }
      // let result = postsByUserId.slice(10 * pagenum - 10, 10 * pagenum);
      return postsByUserId;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  //unfinished
  async getPostsWithParams(
    longitude,
    latitude,
    pagenum,
    story,
    found,
    lost,
    distance,
    time
  ) {
    try {
      const postsCollection = await postsCollections();
      const allPosts = await postsCollection.find({}).toArray();
      if (!allPosts) throw "Could not get all sweets";
      for (let i = 0; i < allPosts.length; i++) {
        allPosts[i]._id = allPosts[i]._id.toString();
      }
      let result = [];
      for (let ele of allPosts) {
        if (
          checkTime(ele, time) &&
          checkStatus(ele, story, lost, found) &&
          checkDistance(ele, longitude, latitude, distance)
        ) {
          result.push(ele);
        }
      }
      result = result.slice(10 * pagenum - 10, 10 * pagenum);
      //console.log(result);
      return result;
    } catch (e) {
      //console.log(e);
      throw e;
    } finally {
      //await postsCollection.closeConnection();
    }
  },

  async getPostById(postId) {
    postId = checker.checkPostId(postId);
    const postsCollection = await postsCollections();
    try {
      const thePost = await postsCollection.findOne({ _id: ObjectId(postId) });
      thePost._id = thePost._id.toString();
      return thePost;
    } catch (e) {
      //console.log(e);
      throw e;
    } finally {
      //await postsCollection.closeConnection();
    }
  },

  //   async getCommentById(id) {
  //     id = checker.checkSweetId(id);
  //     const sweetsCollection = await sweetsCollections();
  //     try {
  //       let theReply = await sweetsCollection.findOne(
  //         { "replies._id": ObjectId(id) },
  //         {
  //           projection: {
  //             _id: 0,
  //             replies: { $elemMatch: { _id: ObjectId(id) } },
  //           },
  //         }
  //       );
  //       //console.log (theReply);
  //       //console.log (theReply.replies);
  //       theReply = theReply.replies[0];
  //       theReply._id = theReply._id.toString();
  //       return theReply;
  //     } catch (e) {
  //       //console.log(e);
  //       return e;
  //     }
  //   },

  async patchById(postId, updatedInfo) {
    if (!updatedInfo) throw "No information to update.";
    postId = checker.checkPostId(postId);
    try {
      let prevPost = await this.getPostById(postId);
      let tokenFromFrontEnd = checker.checkToken(updatedInfo.token);
      const verifyTokenResult = await auth.verifyIdToken(tokenFromFrontEnd);
      if (verifyTokenResult.uid !== prevPost.userId) throw "uid no match";

      let status = undefined;
      if (!updatedInfo.status) status = prevPost.status;
      else status = updatedInfo.status;
      let title = undefined;
      if (!updatedInfo.title) title = prevPost.title;
      else title = updatedInfo.title;
      let content = undefined;
      if (!updatedInfo.content) content = prevPost.content;
      else content = updatedInfo.content;
      // let image = undefined;
      // if (!updatedInfo.image) image = prevPost.image;
      // else image = updatedInfo.image;
      // let longitude = undefined;
      // if (!updatedInfo.longitude) longitude = prevPost.longitude;
      // else longitude = updatedInfo.longitude;
      // let latitude = undefined;
      // if (!updatedInfo.latitude) latitude = prevPost.latitude;
      // else latitude = updatedInfo.latitude;
      let petName = undefined;
      if (!updatedInfo.petName) petName = prevPost.petName;
      else petName = updatedInfo.petName;

      const postsCollection = await postsCollections();
      const updatedPost = await postsCollection.updateOne(
        { _id: ObjectId(postId) },
        {
          $set: {
            status: status,
            title: title,
            content: content,
            //image: image,
            // longitude: longitude,
            // latitude: latitude,
            petName: petName,
          },
        }
      );
      if (updatedPost.modifiedCount == 0) throw "Unable to update post.";
    } catch (e) {
      //console.log(e);
      throw `${e.message}`;
    }

    return await this.getPostById(postId);
  },

  async deleteById(postId, token) {
    postId = checker.checkPostId(postId);
    token = checker.checkToken(token);
    let prevPost = await this.getPostById(postId);
    const verifyTokenResult = await auth.verifyIdToken(token);
    if (verifyTokenResult.uid !== prevPost.userId) throw "uid no match";
    const postsCollection = await postsCollections();
    try {
      const result = await postsCollection.deleteOne({ _id: ObjectId(postId) });
      //console.log(result);
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
      return result;
    } catch (e) {
      //console.log(e);
      throw `${e.message}`;
    } finally {
      //await postsCollection.close();
    }
  },

  async addComment(userId, userName, comment, postId) {
    comment = checker.checkComment(comment);
    postId = checker.checkPostId(postId);
    try {
      const newComment = {
        _id: ObjectId(),
        userName: userName,
        postId: postId,
        userId: userId,
        comment: comment,
        //toUser: toUser,
        time: Date.now(),
      };
      //console.log("newReply", newReply);

      const postsCollection = await postsCollections();
      const updatedComment = await postsCollection.updateOne(
        { _id: ObjectId(postId) },
        { $addToSet: { comments: newComment } }
      );

      if (updatedComment.modifiedCount == 0) throw "Unable to comment.";

      return await this.getPostById(postId);
    } catch (e) {
      `${e.message}`;
    }
  },

  async deleteComment(commentId, postId, token) {
    commentId = checker.checkPostId(commentId);
    postId = checker.checkPostId(postId);
    token = checker.checkToken(token);
    try {
      const postsCollection = await postsCollections();
      //const prevPost = await this.getPostById(postId);
      let prevComment = await postsCollection.findOne(
        {
          //_id: ObjectId(postId),
          "comments._id": ObjectId(commentId),
        },
        {
          projection: {
            _id: 0,
            comments: { $elemMatch: { _id: ObjectId(commentId) } },
          },
        }
      );
      prevComment = prevComment.comments[0];
      //console.log("comment", prevComment);
      const verifyTokenResult = await auth.verifyIdToken(token);
      if (verifyTokenResult.uid !== prevComment.userId) throw "uid no match";

      const deletedInfo = await postsCollection.updateOne(
        { _id: ObjectId(postId) },
        { $pull: { comments: { _id: ObjectId(commentId) } } }
      );

      if (deletedInfo.deletedCount == 0) throw "Unable to deleted comment.";

      return await this.getPostById(postId);
    } catch (e) {
      console.log(e.message);
      throw `${e.message}`;
    }
  },
};
