const posts = require("./posts");

const constructorMethod = (app) => {
  app.use("/posts", posts);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
