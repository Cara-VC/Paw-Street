const { ObjectID } = require("bson");

function checkUsername(username) {
  if (!username || typeof username !== "string") throw "Invalid username.";
  username = username.trim();
  if (username.length === 0) throw "Empty username.";
  return username;
}

function checkUserId(userId) {
  return userId;
}

function checkStatus(status) {
  const allStatus = new Set(["story", "lost", "found"]);
  if (!allStatus.has(status)) throw "Invalid status.";
  return status;
}

function checkTitle(title) {
  if (!title || typeof title !== "string") throw "Invalid title.";
  title = title.trim();
  if (title.length === 0) throw "Empty title.";
  return title;
}

function checkContent(content) {
  if (!content || typeof content !== "string") throw "Invalid content.";
  content = content.trim();
  if (content.length === 0) throw "Empty content.";
  return content;
}

function checkPostId(postId) {
  if (!ObjectID.isValid(postId)) throw "Invalid postId.";
  return postId;
}

function checkUserId(userId) {
  if (!userId) throw "Empty userId.";
  return userId;
}

function checkComment(comment) {
  if (typeof comment != "string") throw "comment must be a string.";
  if (comment.trim().length == 0)
    throw "comment can't be empty or only including spaces.";
  return comment;
}

function checkPageNum(pageNum) {
  if (!pageNum) pageNum = "1";
  //console.log(pageNum, typeof pageNum);
  if (pageNum <= 0) pageNum = "1";
  return pageNum;
}

function checkToken(token) {
  if (!token || typeof token !== "string") throw "Empty token.";
  return token;
}

module.exports = {
  checkUsername,
  checkUserId,
  checkStatus,
  checkTitle,
  checkContent,
  checkPostId,
  checkComment,
  checkUserId,
  checkPageNum,
  checkToken,
};
