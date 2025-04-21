<template>
  <div class="home-container">
    <NavBar />
    <main class="content-wrapper">
      <div class="welcome-message">
        <h1>Welcome to DevGate</h1>
        <p>Connect with fellow developers. Share ideas. Build your network!</p>
        <router-link to="/signup" class="cta-button">Join the Community</router-link>
      </div>
    </main>
    <div class="blur-circle"></div>
  </div>
</template>



<script>
import NavBar from "../components/NavBar.vue";

export default {
  name: "HomeView",
  components: { NavBar },
};
</script>

<style scoped>
.home-container {
  position: relative;
  min-height: 100vh;
  background-color: #1e1e2f;
  color: white;
  overflow: hidden;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 2rem 2rem; /* Matches navbar height + padding */
  width: 100%;
  box-sizing: border-box;
}

.welcome-message {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  z-index: 1;
  position: relative;
}

.welcome-message h1 {
  font-size: 2.75rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #ffffff, #c9d6ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.welcome-message p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
  color: white;
  padding: 0.875rem 2rem;
  font-size: 1.125rem;
  font-weight: 500;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
}

.blur-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 108, 255, 0.2), transparent 70%);
  filter: blur(80px);
  top: 20%;
  left: 10%;
  z-index: 0;
  animation: float 15s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(50px, 50px);
  }
}

@media (max-width: 768px) {
  .welcome-message {
    padding: 3rem 1.5rem;
  }
  
  .welcome-message h1 {
    font-size: 2.25rem;
  }
  
  .welcome-message p {
    font-size: 1.1rem;
  }
  
  .blur-circle {
    width: 300px;
    height: 300px;
    filter: blur(60px);
  }
}
</style>
