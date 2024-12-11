import {auth, db} from "./firebaseConfig.js";

import { 
    onAuthStateChanged,
    signOut
 } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { loadRecipes, syncRecipes } from "./ui.js";

 export let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    const loginBtn = document.getElementById("login-btn");

    logoutBtn.style.display = "none";

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            console.log("UserId: ", user.uid);
            console.log("Email: ", user.email);
            logoutBtn.style.display = "inline-block";
            loginBtn.style.display = "none";
            loadRecipes();
            syncRecipes();
        } else {
            // No user is signed in
            console.log("No user is currently signed in.");
            // if no user signed in, redirect to login page if not already on it
            if (window.location.pathname !== "/pages/login.html") {
                window.location.href = "/pages/login.html";
            }
        }
    });

    // Logout
    logoutBtn.addEventListener("click", async() => {
        try {
            await signOut(auth);
            M.toast({html: "Log Out successful!"});
            logoutBtn.style.display = "none";
            loginBtn.style.display = "inline-block";
            window.location.href = "/";
        } catch(e) {
            M.toast({html: e.message});
        }
    });
});

