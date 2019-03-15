import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyCgDGiK-BaJuo3VKeX0O34PKPkcouiP8ZY",
  authDomain: "chat-app-b41d3.firebaseapp.com",
  databaseURL: "https://chat-app-b41d3.firebaseio.com",
  projectId: "chat-app-b41d3",
  storageBucket: "chat-app-b41d3.appspot.com",
  messagingSenderId: "917511296136"
};

firebase.initializeApp(config);

const db = firebase.firestore(); // Cloud Store
const rtdb = firebase.database(); // Access to Realtime Database

export function setupPresence(user) {
  const isOfflineForRTDB = {
    state: 'offline',
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  }

  const isOnlineForRTDB = {
    state: 'online',
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  }

  const isOfflineForFirestore = {
    state: 'offline',
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  }

  const isOnlineForFirestore = {
    state: 'online',
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  }

  const rtdbRef = rtdb.ref(`/status/${user.uid}`);
  const userDoc = db.doc(`/users/${user.uid}`);


  rtdb.ref(".info/connected").on("value", async (snapshot) => {
    if (snapshot.val() === false) {
      userDoc.update({
        status: isOfflineForFirestore
      });
      return;
    }

    await rtdbRef.onDisconnect().set(isOfflineForRTDB);
    // Online
    rtdbRef.set(isOnlineForRTDB);
    userDoc.update({
      status: isOnlineForFirestore
    });
  });
}

export { db, firebase };