import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const user = auth.currentUser;
  
auth.launguageCode = 'en';
const googleProvider = new GoogleAuthProvider();

const updateUserProfile = (user) => {
    const name = user.displayName;
    const email = user.email;
    const photo = user.photoURL;
  
    document.getElementById("name").textContent += name+"\n";
    document.getElementById("email").textContent += email;
    document.getElementById("profile").src = photo;
    document.getElementById("profile-Big").src = photo;
  }

onAuthStateChanged(auth,(user) => {

    if (user) {
      updateUserProfile(user)
      const uid = user.uid;
      return uid;
    } 
    else {
      alert("Create Account & Login")
      window.location.href = "/login.html"   
    }
  })
  