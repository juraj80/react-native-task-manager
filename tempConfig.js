// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
