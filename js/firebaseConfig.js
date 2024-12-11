import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import { 
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { 
  getAuth
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAfmuVqG3opRDsxF__6ARwL7pmZKHL_fo4",
    authDomain: "anonchef-df4bd.firebaseapp.com",
    projectId: "anonchef-df4bd",
    storageBucket: "anonchef-df4bd.firebasestorage.app",
    messagingSenderId: "619983012072",
    appId: "1:619983012072:web:c81fb0e2a2e7169e84c95d",
    measurementId: "G-XYY7R7FXHQ"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {db, auth};