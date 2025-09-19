
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyCm6-ZYpq5umb38eehnu2-nAcNrNAx5cNo",
    authDomain: "firestore-8a746.firebaseapp.com",
    projectId: "firestore-8a746",
    storageBucket: "firestore-8a746.firebasestorage.app",
    messagingSenderId: "653390996882",
    appId: "1:653390996882:web:7df3b351c1f1432f194d4b",
    measurementId: "G-SWWDCPN18E"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Attach login handler (only once!)
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Save token + user in localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userData", JSON.stringify(data.user));

        // 🔹 Log login event into Firestore
        await addDoc(collection(db, "loginEvents"), {
         email: email,
          role: data.user.role || "unknown",
          timestamp: serverTimestamp()
        });

        // Redirect based on role
        const role = data.user.role;
        if (role === "admin") {
          window.location.href = "adminPanel.html";
        } else if (role === "donor") {
          window.location.href = "donor-dashboard.html";
        } else if (role === "recipient") {
          window.location.href = "recipient-dashboard.html";
        } else {
          window.location.href = "index.html";
        }

      } else {
        alert(data.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Network or server error.");
    }
  });

    