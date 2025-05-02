<template>
<form @submit.prevent="handleSignUP" class="register">
    <h2></h2>
    <input type="text" required placeholder="Display name" v-model="displayName">
    <input type="email" required placeholder="Your email" v-model="email">
    <input type="password" required placeholder="Your password" v-model="password">
    <input type="submit" value="Sign up">
    <button @click.prevent="handleGoogleSignup">Sign up with Google</button>
    <div class="error" v-show="iserror">{{ error }}</div>
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
      iserror: false ,
      defaultAvatar: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg'

    };
  },
  methods: {
    async handleSignUP() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        this.error = "";
        this.iserror = false;
        let photoURL = this.defaultAvatar;

        const userDocRef = doc(db, "users", user.uid);

        await setDoc(userDocRef, {
          createdAt: new Date(),
          displayName: this.displayName,
          email: this.email,
          projects: [],
          certificates: [],
          objectives: [],
          skills: [],
          photoURL: photoURL,
        });

        this.$router.push("/dashboard/" + user.uid);
      } catch (err) {
        this.error = err.message;
        this.iserror = true;
      }
    },

    async handleGoogleSignup() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        this.iserror=false ; 
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
            skills: []
          });
        }

        this.$router.push("/dashboard/" + user.uid);
      } catch (err) {
        this.iserror=true ; 
        this.error = err.message;
      }
    }
  }
};
</script>


  
<style scoped>
.register {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.register input:not([type="submit"]),
.register button {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
}

.register input:not([type="submit"]):focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.register input[type="submit"] {
  background: linear-gradient(to right, #8b5cf6, #6366f1);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.register input[type="submit"]:hover {
  background: linear-gradient(to right, #7c3aed, #4f46e5);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.register button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: white;
  color: #2d3748;
  font-weight: 500;
  border: 2px solid #e2e8f0;
  cursor: pointer;
}

.register button:hover {
  border-color: #cbd5e0;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.error {
  color: #ef4444;
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

/* Google icon styling */
.register button::before {
  content: '';
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3Cpath fill='%234285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/%3E%3Cpath fill='%2334A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3Cpath fill='none' d='M0 0h48v48H0z'/%3E%3C/svg%3E");
  background-size: contain;
}
</style>