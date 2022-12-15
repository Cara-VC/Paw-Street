var admin = require("firebase-admin");
var serviceAccount = require("./paw-street-adminsdk.json");
require("dotenv").config();

var adminConfig = {
  type: process.env.NODE_JS_FBA_TYPE,
  project_id: process.env.NODE_JS_FBA_PROJECT_ID,
  private_key_id: process.env.NODE_JS_FBA_PRIVATE_KEY_ID,
  private_key: process.env.NODE_JS_FBA_PRIVATE_KEY,
  client_email: process.env.NODE_JS_FBA_CLIENT_EMAIL,
  client_id: process.env.NODE_JS_FBA_CLIENT_ID,
  auth_uri: process.env.NODE_JS_FBA_AUTH_URI,
  token_uri: process.env.NODE_JS_FBA_TOKEN_URL,
  auth_provider_x509_cert_url: process.env.NODE_JS_FBA_AUTH_PROVIDER_URL,
  client_x509_cert_url: process.env.NODE_JS_FBA_CLIENT_URL,
};
console.log("adminConfig", adminConfig);

admin.initializeApp({
  credential: admin.credential.cert(adminConfig),
  storageBucket: "gs://paw-street-cb83d.appspot.com",
});

var bucket = admin.storage().bucket();

module.exports = { bucket };
