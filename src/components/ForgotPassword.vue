

<template>
<br>
<form @submit.prevent="resetPassword" class="reset">
    <input type="email" required placeholder="Your email" v-model="email"/>
    <input type="submit" value="Reset"/>

    <div class="message">{{ message }}</div>
</form>
</template>

<script>
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase/config.js";

export default {
  name: "ResetPassword",
  data() {
    return {
      email: "", 
      message: "",
    };
  },
  methods: {
    async resetPassword() {
      try {
        await sendPasswordResetEmail(auth, this.email);
        this.message = "If your account exists, you will receive an email.";
      } catch (err) {
        this.message = err.message;
      }
    }
  }
};
</script>

<style scoped>
.reset {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reset input[type="email"] {
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #2d3748;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.reset input[type="email"]:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.reset input::placeholder {
  color: #a0aec0;
}

.reset input[type="submit"] {
  padding: 0.875rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset input[type="submit"]:hover {
  background-color: #2c5282;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message {
  color: #3182ce;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 0.25rem;
  line-height: 1.4;
}

.error {
  color: #e53e3e;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 0.25rem;
}
</style>