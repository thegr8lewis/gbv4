# SafeSpace - Mental Health Support Platform

SafeSpace is a web application designed to connect individuals seeking mental health support with qualified psychologists. The platform provides a safe and confidential environment for users to find psychologists, book appointments, and manage their sessions. It also includes dedicated interfaces for psychologists to manage their profiles and availability, and for administrators to oversee the platform.

**View hosted live webapp**
<a href='https://gbv4-i4rw.onrender.com' style="color:green; padding:10px; cursor:pointer;">View live site</a>
## Features

- **Role-based Access:** Separate interfaces and functionalities for Users, Psychologists, and Administrators.
- **Authentication:** Secure user registration and login system.
- **Psychologist Directory:** A searchable directory of psychologists with detailed profiles.
- **Appointment Booking:** Easy-to-use system for booking, viewing upcoming sessions, and managing past appointments.
- **Availability Calendar:** Psychologists can set and update their availability.
- **Dashboards:** Personalized dashboards for users, psychologists, and administrators.
- **Reporting System:** A feature for users to submit reports or seek immediate support.

## Tech Stack

- **Frontend:**
  - React
  - Vite
  - Tailwind CSS
  - Material-UI
  - FullCalendar
- **Backend:**
  - Firebase (Authentication, Firestore, Cloud Functions)
- **Deployment:**
  - Render

## Prerequisites

- Node.js (v18 or later recommended)
- npm

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd gbv4/my-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    - In your Firebase project, go to **Project settings** and copy your web app's Firebase configuration.
    - Create a file `src/firebase.js` and add your Firebase configuration. It should look something like this:

    ```javascript
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);
    ```
    **Note:** It is highly recommended to use environment variables for your Firebase credentials for security.

## Running the Application

To run the application in a development environment:

```bash
npm run dev
```

This will start the Vite development server, and you can view the application at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production

To create a production-ready build of the application:

```bash
npm run build
```

The production files will be generated in the `dist` directory.

## Hosting

### Deploying on Render

This project includes a `render.yaml` file for easy deployment on [Render](https://render.com/).

1.  Create a new **Static Site** on Render and connect your GitHub repository.
2.  Render will automatically use the `render.yaml` file for the build and start commands.
    - **Build Command:** `cd my-project && npm install && npm run build`
    - **Publish Directory:** `my-project/dist`
3.  Add your Firebase configuration keys (apiKey, authDomain, etc.) as **Environment Variables** in the Render dashboard. You will need to modify the code to use these environment variables instead of hardcoding them in `src/firebase.js`.
4.  The site will be deployed. The `render.yaml` includes a rewrite rule to handle client-side routing correctly.