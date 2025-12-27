# AnonChef

AnonChef is a Progressive Web Application (PWA) that allows users to anonymously create, browse, and manage recipes with full offline support. The application demonstrates client-side persistence, real-time cloud synchronization, and modern web app features such as service workers and installability.

---

## Overview

AnonChef enables users to interact with the platform without exposing personal identity while still maintaining secure authentication. Recipes can be created, edited, and deleted both online and offline, with data automatically synchronized once connectivity is restored.

---

## Features

- Anonymous user authentication using Firebase Authentication
- Full CRUD functionality for user-created recipes
- Offline-first design with IndexedDB for local storage
- Automatic synchronization with Firebase Firestore when back online
- Progressive Web App support (installable, responsive, offline-capable)
- Asset and data caching via service workers

---

## Tech Stack

- HTML, CSS, JavaScript
- Firebase Authentication
- Firebase Firestore
- IndexedDB
- Service Workers
- Web App Manifest

---

## Application Behavior

### Offline Support
When the application is offline:
- Recipes are stored locally using IndexedDB
- The UI remains fully functional
- Data is queued for synchronization

Once the connection is restored:
- Locally stored recipes are automatically synced to Firestore
- The user experience remains seamless

### Caching Strategy
The service worker caches:
- Core application files (HTML, CSS, JavaScript)
- Images and static assets
- Manifest and service worker scripts

This improves load times and enables offline access.

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/zeldafreak489/AnonChef.git
   cd AnonChef
   ```
2. Configure Firebase:
   * Create a Firebase project
   * Enable Authentication and Firestore
   * Add your Firebase configuration to the application
3. Run the app:
   * Serve the project using a local web server such as live-server or http-server
   * PWA features require HTTPS or localhost
