// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCegFu9Th_gd0kTba-ml7MY5LJTz509mQI",
  authDomain: "paw-street-cb83d.firebaseapp.com",
  projectId: "paw-street-cb83d",
  storageBucket: "paw-street-cb83d.appspot.com",
  messagingSenderId: "914090770925",
  appId: "1:914090770925:web:6427269897b6a8ea51e7e4",
  measurementId: "G-J4G2X27SQW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
