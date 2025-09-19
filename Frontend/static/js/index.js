
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
  import { getAuth,GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC-qpHsdrhqqMG8OawXDqOj5a-cVGd9Hg0",
    authDomain: "flask-backend-52f1f.firebaseapp.com",
    projectId: "flask-backend-52f1f",
    storageBucket: "flask-backend-52f1f.firebasestorage.app",
    messagingSenderId: "921295611495",
    appId: "1:921295611495:web:7d44911069f2ba06e456c2",
    measurementId: "G-E13TSKHV4X"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = 'en';
  const googlelogin = document.getElementById("google-login");
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

googlelogin.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        const res = await fetch("http://127.0.0.1:5000/verify_token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken })
        });

        const data = await res.json();
        console.log("Backend verified:", data);

        if (data.status === "success") {
            window.location.href = "index.html"; // Flask route
        } else {
            alert("Login failed: " + data.message);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login error. Check console for details.");
    }
});

  const analytics = getAnalytics(app);