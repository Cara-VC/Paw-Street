const express = require("express");
const app = express();
const configRoutes = require("./routes");
const cors = require("cors");
require("dotenv").config();

// const redis = require("redis");
// const client = redis.createClient();
// client.connect().then(() => {});

app.use(cors());
app.use(express.json());

//Check if character exists in cache. And store data in list.
// app.use("/api/characters/:id", async (req, res, next) => {
//   console.log("character middleware originalUrl: ", req.originalUrl);
//   if (
//     req.params.id &&
//     req.params.id !== "page" &&
//     req.params.id !== "history"
//   ) {
//     const characterId = "character." + req.params.id;
//     let exists = await client.exists(characterId);
//     if (exists) {
//       console.log(`Show ${characterId} from cache`);
//       const jsonDataFromRedis = await client.get(characterId);
//       await marvelData.pushCharacterToList(jsonDataFromRedis);
//       const recomposedData = JSON.parse(jsonDataFromRedis);
//       res.status(200).json(recomposedData);
//       return;
//     }
//   }
//   next();
// });

//Check if character page exists in cache.
// app.use("/api/characters/page/:pagenum", async (req, res, next) => {
//   if (req.params.pagenum) {
//     const characterPage = "charactersPage." + req.params.pagenum;
//     let exists = await client.exists(characterPage);
//     if (exists) {
//       console.log(`Show ${characterPage} from cache`);
//       const jsonDataFromRedis = await client.get(characterPage);
//       const recomposedData = JSON.parse(jsonDataFromRedis);
//       res.status(200).json(recomposedData);
//       return;
//     }
//   }
//   next();
// });

configRoutes(app);
app.listen(4000, async () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:4000");
});
