var admin = require("firebase-admin");
var serviceAccount = require("./paw-street-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://paw-street-cb83d.appspot.com",
});

var bucket = admin.storage().bucket();

module.exports = { bucket };
