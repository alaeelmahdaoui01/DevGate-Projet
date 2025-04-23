<template>
<form @submit.prevent="handleLogin" class="login">
    <input type="email" required placeholder="Your email" v-model="email">
    <input type="password" required placeholder="Your password" v-model="password">
    <input type="submit" value="Login">
    <button @click.prevent="handleGoogleLogin">Login with Google</button>
    <div class="error">{{ error }}</div>
</form>
</template>

<script>
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../Firebase/config.js";

export default {
  name: "LoginForm",
  data() {
    return {
      email: "", 
      password: "",
      error: ""
    };
  },
  methods: {
    async handleLogin() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        this.error = "";

        // Fetch user role from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {

          // You can check role and redirect accordingly if needed
          this.$router.push("/dashboard");
        } else {
          this.error = "User data not found.";
        }
      } catch (err) {
        this.error = "No account found with this email or Incorrect password.";
        console.error("Login error:", err);
      }
    },
    async handleGoogleLogin() {
        try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            await setDoc(userRef, {
            createdAt: new Date(),
            displayName: user.displayName,
            email: user.email,
            role: "user",
            projects: [],
            certificates: [],
            objectives: [],
            competences: []
            });
        }

        this.$router.push("/dashboard");
        } catch (err) {
        this.error = err.message;
        }
    }
  }
};
</script>



<style scoped>
.login {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login input[type="email"],
.login input[type="password"] {
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #2d3748;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.login input[type="email"]:focus,
.login input[type="password"]:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.login input::placeholder {
  color: #a0aec0;
}

.login input[type="submit"] {
  padding: 0.875rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.login input[type="submit"]:hover {
  background-color: #2c5282;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.error {
  color: #e53e3e;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 0.25rem;
}


.login button {
  padding: 0.875rem;
  background-color: #db4437;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}


.login button:hover {
  background-color: #c23321;
}
</style>