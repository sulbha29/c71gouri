import * as firebase from 'firebase'
require('firebase/firestore')
window.addEventListener = (x) => x;
var firebaseConfig = {
  apiKey: "AIzaSyAfUxQieUgBlY3o4F9S7aP-xUF86_1cZ9w",
  authDomain: "c71db-2ab79.firebaseapp.com",
  databaseURL: "https://c71db-2ab79.firebaseio.com",
  projectId: "c71db-2ab79",
  storageBucket: "c71db-2ab79.appspot.com",
  messagingSenderId: "752526567283",
  appId: "1:752526567283:web:fd02dcdbab025fbdd38706"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()