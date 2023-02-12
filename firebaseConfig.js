import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
//import { getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBw0NeHk41_45kQpsJeY7dtCzh81Nbzb6Y",
  authDomain: "reacttodoapp-865aa.firebaseapp.com",
  projectId: "reacttodoapp-865aa",
  storageBucket: "reacttodoapp-865aa.appspot.com",
  messagingSenderId: "910067550525",
  appId: "1:910067550525:web:333b134b57ed3843ab5d54",
  measurementId: "G-77GHN72RWN",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase
    .firestore()
    .settings({ experimentalForceLongPolling: true, merge: true }); //add this..
} else {
  firebase.app();
}

const auth = firebase.auth();
//const auth = getAuth();

export { auth, firebase };
