import * as admin from 'firebase-admin';

// var serviceAccount = require("../../zattire-vendor-app-firebase-adminsdk-c56y9-2cef91fd53.json");

// const firebase = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://zattire-vendor-app.firebaseio.com"
// });

//var admin = require("firebase-admin");

var serviceAccount = require("../../zattire-vendor-app-firebase-adminsdk-c56y9-2cef91fd53.json");

const firebase=admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zattire-user-app.firebaseio.com"
});

export default firebase


