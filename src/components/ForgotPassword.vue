

<template>
<br>
<form @submit.prevent="resetPassword" class="reset">
    <input type="email" required placeholder="Your email" v-model="email"/>
    <input type="submit" value="Reset"/>

    <div class="message" v-show="ismessage">{{ message }}</div>
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
      ismessage : false ,
    };
  },
  methods: {
    async resetPassword() {
      try {
        await sendPasswordResetEmail(auth, this.email);
        this.ismessage=true
        this.message = "If your account exists, you will receive an email.";

      } catch (err) {
        this.ismessage=true
        this.message = err.message;
        
      }
    }
  }
};
</script>

<style scoped>
.reset {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeInUp 0.6s ease-out forwards;
}

.reset input:not([type="submit"]) {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
}

.reset input:not([type="submit"]):focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
}

.reset input[type="submit"] {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.reset input[type="submit"]:hover {
  background: linear-gradient(to right, #db2777, #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.message {
  text-align: center;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>