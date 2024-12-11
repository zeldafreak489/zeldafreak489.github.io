# PWA AnonChef - Iris Perry

This is my expanded PWA Prototype for my INF654VA class. It is a recipe app that allows users to create an anonymous account, share recipes, and save recipes.
It has now been upgraded into a PWA with a web manifest and service worker.

# November 19, 2024 Assignment 4
This app has now been upgraded with IndexedDB and Firebase Firestore. I have integrated them in the MyCookbook section so far.
The user can upload recipes to their cookbook and remove them. I have not yet figured out how I am going to handle storing photos, so at the moment there is just a dummy photo of chicken noodle soup added. I also need to implement users and user authentication before I fully complete the application. The users are integral to recipe sharing, so I just wanted to set up an intermediate version of IndexedDB and Firebase first.

# CRUD Instructions
On the My Cookbook page, you can Create recipes using the add button at the bottom of the page. A modal form will pop up and allow you to input the recipe title, description, body, and an image for it.
The application Reads the recipes from IndexedDB and Firebase Firestore and displays them in your cookbook.
The application Updates the recipes because when it is offline, it uses IndexedDB to store the recipes and syncs them with Firebase DB when it comes back online.
If you press the delete button on a recipe card, it will delete the recipe from both IndexedDB and Firebase.

# Synchronization Process
When the application is offline, if a user adds a recipe, it is stored in IndexedDB. When the application comes back online, on the next refresh, it synchronized with Firebase Firestore and the recipes added offline are added there.

# Service Worker
What is a Service Worker?

A service worker is a script that runs in the background, separate from the web page, enabling capabilities such as offline support, background syncing, and push notifications.

# How It Works in This Project

The service worker in this project is responsible for:

    Intercepting network requests and serving cached content when offline.
    Managing the caching of assets during installation and activation phases.

# Lifecycle Phases

    Installation: Caches specified assets.
    Activation: Cleans up old caches.
    Fetch: Intercepts network requests and returns cached content or fetches new data.

# Caching Strategy

This strategy allows the service worker to respond with cached resources if available, falling back to the network if not. It helps ensure fast load times and offline access.

The chosen strategy offers a balance between speed and freshness, providing users with a responsive experience while still updating assets periodically.

# Cache Management

    Updating Cache: The service worker checks for updates to cache assets during the activation phase.
    Clearing Old Caches: Old caches are removed to prevent excess storage use.

# Manifest File
What is a Manifest File?

The web app manifest is a JSON file that defines the structure of the PWA, making it installable and more app-like on devices.
