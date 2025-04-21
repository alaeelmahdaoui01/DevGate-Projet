<template>
    <div class="auth-container">
      <NavBar />
      <div class="auth-content">
        <div class="auth-form-wrapper">
          <div class="form-container">
            <h2 v-if="resetp">Reset Password</h2>
            <h2 v-else-if="showLogin">Login</h2>
            <h2 v-else>Sign up</h2>
            
            <div v-if="resetp">
              <div class="auth-navigation">
                Back to <span @click="showLogin = true; resetp=false">Login</span>
              </div>
              <ForgotPassword />
            </div>
            <div v-else-if="showLogin">
              <LoginForm />
              <p class="auth-navigation">No account yet? <span @click="showLogin = false">Signup</span> instead.</p>
              <p class="auth-navigation">Forgot Password? <span @click="resetp = true">Reset Password</span></p>
            </div>
            <div v-else>
              <SignupForm />
              <p class="auth-navigation">Already registered? <span @click="showLogin = true">Login</span> instead.</p>
            </div>
          </div>
        </div>
        
        <div class="auth-side-content">
            <h1>Welcome to DevGate</h1>
            <p>Log in to collaborate with developers worldwide.</p>
            <p>Share your projects, learn new skills, and grow your network!</p>
        </div>
      </div>
      <div class="blur-circle"></div>
    </div>
  </template>
  
  <script>
  import NavBar from '../components/NavBar.vue';
  import SignupForm from '../components/SignupForm.vue';
  import LoginForm from '../components/LoginForm.vue';
  import ForgotPassword from '../components/ForgotPassword.vue';
  
  export default {
    components: { NavBar, SignupForm, LoginForm, ForgotPassword },
    data() {
      return {
        showLogin: true,
        resetp: false,
      };
    },
  };
  </script>
  
  <style scoped>
  .auth-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to right, #f7fafc, #edf2f7);
    position: relative;
    overflow: hidden;
  }
  
  .auth-content {
    flex: 1;
    display: flex;
    margin-top: 80px; /* adjust if your navbar height is different */
  }
  
  .auth-form-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background-color: #ffffff;
    z-index: 1;
  }
  
  .form-container {
    max-width: 400px;
    width: 100%;
    background: #f9fafb;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  }
  
  .auth-side-content {
    flex: 1;
    background: linear-gradient(135deg, #3182ce, #2c5282);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem;
    text-align: center;
  }
  
  .auth-side-content h1 {
    font-size: 2.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .auth-side-content p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }
  
  .auth-navigation {
    margin-top: 1rem;
    font-size: 0.95rem;
    color: #4a5568;
  }
  
  .auth-navigation span {
    color: #3182ce;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.2s ease;
  }
  
  .auth-navigation span:hover {
    color: #2c5282;
  }
  
  /* Optional: glowing blur background circle */
  .blur-circle {
    position: absolute;
    top: -150px;
    right: -150px;
    width: 300px;
    height: 300px;
    background: rgba(49, 130, 206, 0.15);
    border-radius: 50%;
    filter: blur(100px);
    z-index: 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .auth-content {
      flex-direction: column;
    }
  
    .auth-side-content {
      padding: 2rem;
      order: -1;
    }
  
    .form-container {
      padding: 1.5rem;
    }
  }
  </style>
  