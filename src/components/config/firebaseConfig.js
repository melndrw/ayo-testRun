import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDFr2Qsnag57QhFzWfbPh9w-VmKqdN1DF0",
  authDomain: "ayoph-bbceb.firebaseapp.com",
  databaseURL: "https://ayoph-bbceb.firebaseio.com",
  projectId: "ayoph-bbceb",
  storageBucket: "ayoph-bbceb.appspot.com",
  messagingSenderId: "942460282098",
  appId: "1:942460282098:web:039ab515d4f356097c9c6b",
  measurementId: "G-5935TJKHZN",
}

firebase.initializeApp(firebaseConfig)
firebase.firestore()

const storage = firebase.storage()

export { storage, firebase as default }
