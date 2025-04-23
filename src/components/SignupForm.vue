<template>
<form @submit.prevent="handleSignUP" class="register">
    <h2></h2>
    <input type="text" required placeholder="Display name" v-model="displayName">
    <input type="email" required placeholder="Your email" v-model="email">
    <input type="password" required placeholder="Your password" v-model="password">
    <input type="submit" value="Sign up">
    <button @click.prevent="handleGoogleSignup">Sign up with Google</button>
    <div class="error">{{ error }}</div>
</form>
</template>

<script>
import { auth, db } from "../Firebase/config.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default {
  name: "SignupForm",
  data() {
    return {
      displayName: "",
      email: "", 
      password: "",
      error: "",
    };
  },
  methods: {
    async handleSignUP() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        this.error = "";

        const userDocRef = doc(db, "users", user.uid);

        await setDoc(userDocRef, {
          createdAt: new Date(),
          displayName: this.displayName,
          email: this.email,
          projects: [],
          certificates: [],
          objectives: [],
          competences: []
        });

        this.$router.push("/dashboard");
      } catch (err) {
        this.error = err.message;
      }
    },

    async handleGoogleSignup() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        this.error = "";

        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        // Only set data if user doesn't already exist
        if (!docSnap.exists()) {
          await setDoc(userDocRef, {
            createdAt: new Date(),
            displayName: user.displayName || "",
            email: user.email,
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
.register {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.register h2 {
  color: #1a365d;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.register input[type="text"],
.register input[type="email"],
.register input[type="password"] {
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #2d3748;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.register input:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.register input::placeholder {
  color: #a0aec0;
}

.register input[type="submit"] {
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

.register input[type="submit"]:hover {
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

.register button {
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


.register button:hover {
  background-color: #c23321;
}
</style>