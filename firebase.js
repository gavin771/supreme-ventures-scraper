const firebase = require("firebase");
require("env-yaml").config();

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

module.exports.save = (gameKey, drawName, date, numbers) => {
  db.ref(`${gameKey}/${date}/${drawName}`).set({ ...numbers });
};

module.exports.retrieveGame = async (gameKey, date, drawName) => {
  const snapshot = await db.ref(`${gameKey}/${date}/${drawName}`).once("value");
  return snapshot.val();
};
