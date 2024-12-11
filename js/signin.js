import {auth} from "./firebaseConfig.js";

// JS for Firebase User Authentication
// Import the functions you need from the SDKs you need
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
 } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

 import { 
    doc,
    setDoc
 } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.getElementById("sign-in-form");
    const signUpForm = document.getElementById("sign-up-form");
    const showSignUp = document.getElementById("show-signup");
    const showSignIn = document.getElementById("show-signin");
    const signInBtn = document.getElementById("sign-in-btn");
    const signUpBtn = document.getElementById("sign-up-btn");
    
    showSignUp.addEventListener("click", (event) => {
        event.preventDefault();
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
    });
    
    showSignIn.addEventListener("click", (event) => {
        event.preventDefault();
        signUpForm.style.display = "none";
        signInForm.style.display = "block";
    });
    
    signUpBtn.addEventListener("click", async(event) => {
        const email = document.getElementById("sign-up-email").value;
        const password = document.getElementById("sign-up-password").value;

        event.preventDefault();

        try {
            const authCredential = await createUserWithEmailAndPassword(auth, email, password);
            const docRef = doc(db, "users", authCredential.user.uid);
            await setDoc(docRef, {email: email});
            M.toast({html: "Sign up successful!"});
            signUpForm.style.display = "none";
            signInForm.style.display = "block";
        } catch(e) {
            M.toast({html: e.message});
        }
    });
    
    signInBtn.addEventListener("click", async(event) => {
        const email = document.getElementById("sign-in-email").value;
        const password = document.getElementById("sign-in-password").value;

        event.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            M.toast({html: "Sign in successful!"});
            window.location.href = "/";
        } catch(e) {
            M.toast({html: e.message});
        }
    });
});