import { openDB } from "https:unpkg.com/idb?module";
import { addRecipeToFirebase, deleteRecipeFromFirebase, getRecipesFromFirebase } from "./firebaseDB.js";


// Sidenav initialization
document.addEventListener("DOMContentLoaded", function(){
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus, { edge: "left" });

    // Load recipes from IndexedDB
    // loadRecipes();
    // syncRecipes();

    // Check storage usage
    checkStorageUsage();
});

// Initialize Recipe Form (modal)
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});

// Register service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/serviceworker.js")
        .then(req => console.log("Service Worker Registered!", req))
        .catch(err => console.log("Service Worker registration failed", err));
}

// create IndexedDB database
async function createDB() {
    const db = await openDB("anonChef", 1, {
        upgrade(db) {
            const store = db.createObjectStore("recipes", {
                keyPath: "id",
                autoIncrement: true,
            });
            store.createIndex("status", "status");
        },
    });
    return db;
}

// Add Recipe
async function addRecipe(recipe) {
    const db = await createDB();
    let recipeId;

    if (navigator.onLine) {
        const savedRecipe = await addRecipeToFirebase(recipe);
        recipeId = savedRecipe.id;
        const tx = db.transaction("recipes", "readwrite");
        const store = tx.objectStore("recipes");
        await store.put({ ...recipe, id: recipeId, synced: true });
        await tx.done;
    } else {
        recipeId = `temp-${Date.now()}`;

        const recipeToStore = { ...recipe, id: recipeId, synced: false };
        if (!recipeToStore.id) {
            console.error("Failed to generate a valid ID for the recipe.");
            return; // Exit if ID is invalid
        }
        // start transaction
        const tx = db.transaction("recipes", "readwrite");
        const store = tx.objectStore("recipes");

        // Add recipe to store
        await store.put(recipeToStore);

        // complete transaction
        await tx.done;
    }

    

    // update storage usage
    checkStorageUsage();

    // return recipe with ID
    return { ...recipe, id: recipeId };
}

// Sync recipes from IndexedDB to Firebase
export async function syncRecipes() {
    const db = await createDB();
    const tx = db.transaction("recipes", "readonly");
    const store = tx.objectStore("recipes");

    // fetch all unsynced recipes
    const recipes = await store.getAll();
    await tx.done;

    for (const recipe of recipes) {
        if (!recipe.synced && navigator.onLine) {
            try {
                const recipeToSync = {
                    title: recipe.title, 
                    description: recipe.description,
                    body: recipe.body,
                    image: recipe.image,
                    status: recipe.status
                };

                // send the recipe to firebase
                const savedRecipe = await addRecipeToFirebase(recipeToSync);

                // Replace temporary ID with firebase Id
                const txUpdate = db.transaction("recipes", "readwrite");
                const storeUpdate = txUpdate.objectStore("recipes");

                await storeUpdate.delete(recipe.id);
                await storeUpdate.put({...recipe, id: savedRecipe.id, synced: true });
                await txUpdate.done;
            } catch (error) {
                console.error("Error syncing recipe: ", error);
            }
        }
    }
}

// Delete Recipe
async function deleteRecipe(id) {
    if (!id) {
        console.error("Invalid id passed to deleteRecipe");
        return;
    }

    const db = await createDB();

    if (navigator.onLine) {
        await deleteRecipeFromFirebase(id);
    }

    // start transaction
    const tx = db.transaction("recipes", "readwrite");
    const store = tx.objectStore("recipes");

    try {
        // Delete recipe by ID
        await store.delete(id);
    } catch (error) {
        console.error("Error deleteing the recipe from IndexedDB: ", error);
    }

    // complete transaction
    await tx.done;

    // remove recipe from UI
    const recipeCard = document.querySelector(`[data-id="${id}"]`);
    if (recipeCard) {
        recipeCard.remove();
    }

    // update storage usage
    checkStorageUsage();
}

// Load Recipes with Transaction
export async function loadRecipes() {
    const db = await createDB();

    const recipeContainer = document.querySelector(".cookbook");
    recipeContainer.innerHTML = ""; // clear current recipes

    if (navigator.onLine) {
        const firebaseRecipes = await getRecipesFromFirebase();

        // start transaction
        const tx = db.transaction("recipes", "readwrite");
        const store = tx.objectStore("recipes");

        for (const recipe of firebaseRecipes) {
            await store.put({...recipe, synced: true});
            displayRecipe(recipe);
        }

        await tx.done;
    } else {
        // start transaction
        const tx = db.transaction("recipes", "readonly");
        const store = tx.objectStore("recipes");

        // Get all Recipes
        const recipes = await store.getAll();

        recipes.forEach((recipe) => {
            displayRecipe(recipe);
        });

        await tx.done;
    }
}

// Display recipe using the existing HTML Structure
function displayRecipe(recipe) {
    const recipeContainer = document.querySelector(".cookbook");
    
    // change to display images from indexedDB
    const html = `
                <div class="col s12 m6 l4">
                    <div class="card" data-id="${recipe.id}">
                        <div class="card-image">
                            <img src="/img/chicken-noodle-soup.jpg" alt="">
                            <span class="card-title">${recipe.title}</span>
                        </div>
                        <div class="card-content">
                            <p>${recipe.description}</p>
                        </div>
                        <div class="card-action">
                            <a href="/pages/individualrecipe.html">View Recipe</a>
                            <a href="#" class="red-text recipe-delete">Remove</a>
                        </div>
                    </div>
                </div>
            `;

    recipeContainer.insertAdjacentHTML("beforeend", html);

    // Attach delete event listener
    const deleteButton = recipeContainer.querySelector(`[data-id="${recipe.id}"] .recipe-delete`);

    deleteButton.addEventListener("click", () => deleteRecipe(recipe.id));
}

// Add Recipe Button listener
document.addEventListener("DOMContentLoaded", () => {
    const addRecipeButton = document.querySelector(".add-recipe-form");
    
    addRecipeButton.addEventListener("submit", async (e) => {
        e.preventDefault();

        const titleInput = document.querySelector("#title");
        const descriptionInput = document.querySelector("#description");
        const bodyInput = document.querySelector("#recipe");
        const imageInput = document.querySelector("#imageUpload");
    
        const recipe = {
            title: titleInput.value,
            description: descriptionInput.value,
            body: bodyInput.value,
            image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : "",
            status: "pending"
        };
    
        const savedRecipe = await addRecipe(recipe);
    
        displayRecipe(savedRecipe);
    
        titleInput.value = "";
        descriptionInput.value = "";
        bodyInput.value = "";
        imageInput.value = "";
    
        // Close the modal
        const modal = M.Modal.getInstance(document.querySelector(".modal"));
        modal.close();
    });
});


async function checkStorageUsage() {
    if (navigator.storage && navigator.storage.estimate) {
        const {usage, quota} = await navigator.storage.estimate();

        const usageInMB = (usage / (1024 * 1024)).toFixed(2);
        const quotaInMB = (quota / (1024 * 1024)).toFixed(2);

        console.log(`Storage used: ${usageInMB} MB of ${quotaInMB} MB`);

        // Update the UI
        const storageInfo = document.querySelector("#storage-info");
        if (storageInfo) {
            storageInfo.textContent = `Storage used: ${usageInMB} MB of ${quotaInMB} MB`;
        }

        if (usage / quota > 0.8) {
            const storageWarning = document.querySelector("#storage-warning");
            if (storageWarning) {
                storageWarning.textContent = "Warning: You are running low on data.";
                storageWarning.style.display = "block";
            } else {
                storageWarning.textContent = "";
                storageWarning.style.display = "none";
            }
        }
    }
}