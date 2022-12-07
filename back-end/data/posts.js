const mongoCollections = require("../config/mongoCollections");
const postsCollections = mongoCollections.posts;
const checker = require("../public/util");
const { ObjectId } = require("mongodb");
//const { post } = require("../routes/posts");

module.exports = {
  async creatPost(
    userName,
    userId,
    status,
    title,
    content,
    image,
    longtitude,
    latitude
  ) {
    userName = checker.checkUsername(userName);
    userId = checker.checkUserId(userId);
    status = checker.checkStatus(status);
    title = checker.checkTitle(title);
    content = checker.checkContent(content);

    const postsCollection = await postsCollections();

    let newPost = {
      userName: userName,
      userId: userId,
      status: status,
      title: title,
      content: content,
      image: image,
      longtitude: longtitude,
      latitude: latitude,
      comments: [],
      petBreed: null,
      petName: null,
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
    prevPost = await this.getPostById(postId);
    let status = undefined;
    if (!updatedInfo.status) status = prevPost.status;
    else status = updatedInfo.status;
    let title = undefined;
    if (!updatedInfo.title) title = prevPost.title;
    else title = updatedInfo.title;
    let content = undefined;
    if (!updatedInfo.content) content = prevPost.content;
    else content = updatedInfo.content;
    let image = undefined;
    if (!updatedInfo.image) image = prevPost.image;
    else image = updatedInfo.image;
    let longtitude = undefined;
    if (!updatedInfo.longtitude) longtitude = prevPost.longtitude;
    else longtitude = updatedInfo.longtitude;
    let latitude = undefined;
    if (!updatedInfo.latitude) latitude = prevPost.latitude;
    else latitude = updatedInfo.latitude;

    const postsCollection = await postsCollections();
    const updatedPost = await postsCollection.updateOne(
      { _id: ObjectId(postId) },
      {
        $set: {
          status: status,
          title: title,
          content: content,
          image: image,
          longtitude: longtitude,
          latitude: latitude,
        },
      }
    );

    if (updatedPost.modifiedCount == 0) throw "Unable to update post.";

    return await this.getPostById(postId);
  },

  async deleteById(postId) {
    postId = checker.checkPostId(postId);
    const postsCollection = await postsCollections();
    try {
      const result = await postsCollection.deleteOne({ _id: ObjectId(postId) });
      console.log(result);
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      //await postsCollection.close();
    }
  },

  async addComment(userId, userName, comment, postId, toUser) {
    comment = checker.checkComment(comment);
    postId = checker.checkPostId(postId);

    const newComment = {
      _id: ObjectId(),
      userName: userName,
      userId: userId,
      comment: comment,
      toUser: toUser,
    };
    //console.log("newReply", newReply);

    const psotsCollection = await postsCollections();
    const updatedComment = await psotsCollection.updateOne(
      { _id: ObjectId(postId) },
      { $addToSet: { comments: newComment } }
    );

    if (updatedComment.modifiedCount == 0) throw "Unable to comment.";

    return await this.getPostById(postId);
  },

  async deleteComment(commentId, postId) {
    commentId = checker.checkPostId(commentId);
    postId = checker.checkPostId(postId);

    const postsCollection = await postsCollections();
    const deletedInfo = await postsCollection.updateOne(
      { _id: ObjectId(postId) },
      { $pull: { comments: { _id: ObjectId(commentId) } } }
    );

    if (deletedInfo.deletedCount == 0) throw "Unable to deleted comment.";

    return await this.getPostById(postId);
  },
};
