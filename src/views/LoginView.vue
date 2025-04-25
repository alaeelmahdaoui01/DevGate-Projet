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
    background: linear-gradient(135deg, #f0f4ff, #dbeafe);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
    overflow: hidden;
  }
  
  /* Animated background elements */
  .auth-container::before,
  .auth-container::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.1);
    z-index: 1;
  }
  
  .auth-container::before {
    width: 600px;
    height: 600px;
    top: -300px;
    right: -300px;
    animation: float 12s ease-in-out infinite;
  }
  
  .auth-container::after {
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: -150px;
    animation: float 8s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(-20px, 20px) rotate(5deg);
    }
  }
  
  .auth-content {
    flex: 1;
    display: flex;
    margin-top: 80px;
    position: relative;
    z-index: 2;
  }
  
  .auth-form-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    z-index: 2;
  }
  
  .form-container {
    max-width: 420px;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    padding: 3rem;
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  }
  
  .form-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
    animation: rainbow 8s linear infinite;
    background-size: 400% 100%;
  }
  
  .form-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.2);
  }
  
  @keyframes rainbow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
  
  .form-container h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #6366f1; /* Chose the second gradient color for balance */
  text-align: center;
  position: relative;
}

  
  .form-container h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #6366f1);
    border-radius: 2px;
  }
  
  .auth-side-content {
    flex: 1;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .auth-side-content::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    animation: pulse 15s infinite alternate;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    100% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }
  
  .auth-side-content h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 2;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .auth-side-content p {
    font-size: 1.2rem;
    line-height: 1.7;
    margin-bottom: 1rem;
    color: rgba(255,255,255,0.9);
    position: relative;
    z-index: 2;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .auth-navigation {
    margin-top: 1.5rem;
    font-size: 0.95rem;
    color: #4a5568;
    text-align: center;
  }
  
  .auth-navigation span {
    color: #3b82f6;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .auth-navigation span::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: #3b82f6;
    transition: width 0.3s ease;
  }
  
  .auth-navigation span:hover {
    color: #2563eb;
  }
  
  .auth-navigation span:hover::after {
    width: 100%;
  }
  
  /* Decorative elements */
  .decorative-element {
    position: absolute;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    animation: morph 15s ease-in-out infinite;
    z-index: 1;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .auth-content {
      flex-direction: column;
      margin-top: 60px;
    }
  
    .auth-side-content {
      padding: 2.5rem 1.5rem;
      order: -1;
    }
  
    .form-container {
      padding: 2.5rem 1.5rem;
      margin: 1rem;
    }
  
    .auth-side-content h1 {
      font-size: 2rem;
    }
  
    .auth-side-content p {
      font-size: 1rem;
    }
  
    .auth-container::before,
    .auth-container::after {
      display: none;
    }
  }
  
  /* Animation for form container */
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
  
  .form-container {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  </style>