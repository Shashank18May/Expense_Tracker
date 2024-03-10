import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth,GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-CawdL0jeKqQnb13sr5W7NYidLX-Lmag",
  authDomain: "expense-tracker-js.firebaseapp.com",
  databaseURL: "https://expense-tracker-js-default-rtdb.firebaseio.com",
  projectId: "expense-tracker-js",
  storageBucket: "expense-tracker-js.appspot.com",
  messagingSenderId: "715950733323",
  appId: "1:715950733323:web:a7f5d740f7ebf8e25b6f0e",
  measurementId: "G-XZ9KTKV9BQ"
};
      
const app = initializeApp(firebaseConfig); 
const auth = getAuth();
const firestore = getFirestore();

auth.launguageCode = 'en';
const googleProvider = new GoogleAuthProvider();



const googleLoginButton = document.getElementById("loginGoogle");

console.log(googleLoginButton)

googleLoginButton.addEventListener('click',function () {

    signInWithPopup(auth, googleProvider).then(result => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user)
        window.location.href = "/index.html";

  }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
  });
})
