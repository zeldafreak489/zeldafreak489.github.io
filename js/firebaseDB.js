import { currentUser } from "./auth.js";
import {db} from "./firebaseConfig.js";

// Import the functions you need from the SDKs you need

import { 
    collection,
    doc,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc, 
    setDoc
 } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Add a Recipe
export async function addRecipeToFirebase(recipe) {
    try {
        if (!currentUser) {
            throw new Error("User is not authenticated.");
        }
        const userId = currentUser.uid;
        console.log("userID: ", userId);
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {email: currentUser.email }, {merge:true});
        const recipesRef = collection(userRef, "recipes");
        const docRef = await addDoc(recipesRef, recipe);
        return { id: docRef.id, ...recipe };
    } catch (error) {
        console.error("Error adding task: ", error);
    }
}

// const recipe = {
//     title: "example recipe",
//     description: "test for firebase", 
//     image: "test",
//     body: "example recipe",
//     status: true
// }

// addRecipeToFirebase(recipe);

// Get Recipes
export async function getRecipesFromFirebase() {
    const recipes = [];
    try {
        if (!currentUser) {
            throw new Error("User is not authenticated.");
        }
        const userId = currentUser.uid;
        const recipesRef = collection(doc(db, "users", userId), "recipes");
        const querySnapshot = await getDocs(recipesRef);
        querySnapshot.forEach((doc) => {
            recipes.push({ id: doc.id, ...doc.data() });
        });
    } catch (error) {
        console.error("Error retrieving recipes: ", error);
    }
    return recipes;
}

// Delete Recipe
export async function deleteRecipeFromFirebase(id) {
    try {
        if (!currentUser) {
            throw new Error("User is not authenticated.");
        }
        const userId = currentUser.uid;
        await deleteDoc(doc(db, "users", userId, "recipes", id));
    } catch (error) {
        console.error("Error deleting recipe: ", error);
    }
}

// Update Recipe
export async function updateRecipeInFirebase(id, updatedData) {
    try {
        if (!currentUser) {
            throw new Error("User is not authenticated.");
        }
        const userId = currentUser.uid;
        const recipeRef = doc(db, "users", userId, "recipes", id);
        await updateDoc(recipeRef, updatedData);
    } catch (error) {
        console.error("Error updating recipe: ", error);
    }
}