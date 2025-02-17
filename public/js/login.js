import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js"; // Added get

const firebaseConfig = {
    apiKey: "AIzaSyBTfykjKEJFbw4MT0VOpMuBl2vTZqN1a0E",
    authDomain: "zaid-539bb.firebaseapp.com",
    projectId: "zaid-539bb",
    storageBucket: "zaid-539bb.appspot.com",
    messagingSenderId: "493463305652",
    appId: "1:493463305652:web:b346573eb59956f7dd06e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Event listener for Sign Up and Sign In
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signup-btn').addEventListener('click', sign_up);
    document.getElementById('login-btn').addEventListener('click', log_in);
});

// function sign_up() {
//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

    
//     // Create a new user with email and password
//     createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             const user = userCredential.user;
//             const userRef = ref(database, 'users/' + user.uid);

//             // Create user data object
//             const userData = {
//                 password : password,
//                 username: username,
//                 email: email,
//                 last_login: Date.now()
//             };

//             // Save user data to the database under users/{uid}
//             set(userRef, userData)
//                 .then(() => {
//                     alert('User Created Successfully!');
//                 })
//                 .catch((error) => {
//                     alert('Error saving user data: ' + error.message);
//                 });
//         })
//         .catch((error) => {
//             alert('Error creating user: ' + error.message);
//         });
// }

// // Log In function
// function log_in() {
//     const email = document.getElementById('login_email').value;
//     const password = document.getElementById('login_password').value;

//     signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             const user = userCredential.user;
//             alert('Login Successful!');
//             after_login(user); // Call the post-login function
//         })
//         .catch((error) => {
//             alert('Login failed: ' + error.message);
//         });
// }

// // Post-login action
// function after_login(user) {
//     // Example: Redirect to another page or show personalized content
//     window.location.href = "dashboard.html";
// }

function sign_up() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // You can use a select or checkbox input to allow the user to choose a role or set it programmatically
    const userType = "user"; // default user type, change as per your need

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userRef = ref(database, 'users/' + user.uid);

            const userData = {
                username: username,
                email: email,
                password: password,
                last_login: Date.now(),
                user_type: userType // Add user type to the database
            };

            set(userRef, userData)
                .then(() => {
                    alert('User Created Successfully!');
                })
                .catch((error) => {
                    alert('Error saving user data: ' + error.message);
                });
        })
        .catch((error) => {
            alert('Error creating user: ' + error.message);
        });
}

function log_in() {
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Get user data from the database
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    
                    // Check user type and redirect accordingly
                    if (userData.user_type === "admin") {
                        window.open("dashboard.html", "_blank"); // Redirect to dashboard if admin
                    } else {
                        window.location.href = "index.html"; // Redirect to index for normal users
                    }
                } else {
                    alert("No user data found.");
                }
            }).catch((error) => {
                alert('Error fetching user data: ' + error.message);
            });
        })
        .catch((error) => {
            alert('Login error: ' + error.message);
        });
}
