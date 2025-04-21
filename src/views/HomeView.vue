<template>
  <div class="home-container">
    <NavBar />
    <main class="content-wrapper">
      <div class="welcome-message">
        <h1>Welcome to DevGate</h1>
        <p>Connect with fellow developers. Share ideas. Build your network!</p>
        <router-link to="/login" class="cta-button">Join the Community</router-link>
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
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #2d3748;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 2rem 2rem;
  width: 100%;
  box-sizing: border-box;
}

.welcome-message {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  position: relative;
}

.welcome-message h1 {
  font-size: 2.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1a365d;
  line-height: 1.2;
}

.welcome-message p {
  font-size: 1.25rem;
  color: #4a5568;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-weight: 400;
}

.cta-button {
  display: inline-block;
  background-color: #3182ce;
  color: white;
  padding: 0.875rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  background-color: #2c5282;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.blur-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(49, 130, 206, 0.1) 0%, transparent 70%);
  filter: blur(40px);
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
    transform: translate(30px, 30px);
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 80px 1.5rem 2rem;
  }
  
  .welcome-message {
    padding: 2rem 1rem;
  }
  
  .welcome-message h1 {
    font-size: 2rem;
  }
  
  .welcome-message p {
    font-size: 1.1rem;
  }
  
  .blur-circle {
    width: 200px;
    height: 200px;
  }
}
</style>