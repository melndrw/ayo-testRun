import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBzDU1TQBj_aMrMJXp2ecpf8jBuZ76Jc2k',
  authDomain: 'testrun-834d1.firebaseapp.com',
  databaseURL: 'https://testrun-834d1.firebaseio.com',
  projectId: 'testrun-834d1',
  storageBucket: 'testrun-834d1.appspot.com',
  messagingSenderId: '254106625851',
  appId: '1:254106625851:web:35f179b39987cd20eeb91e',
  measurementId: 'G-8F9YNJBDE9',
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

const storage = firebase.storage();

export { storage, firebase as default };
