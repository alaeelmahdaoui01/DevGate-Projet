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
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <h3>DevGate</h3>
          <p>Where developers connect and grow together</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>Explore</h4>
            <div>
            <router-link to="/">Home</router-link> 
            <router-link to="/login">Login</router-link> 
            <router-link to="/login">Sign Up</router-link></div>
          </div>
          <div class="link-group">
            <h4>Connect</h4>
            <div>
            <a href="#" target="_blank">Twitter</a> 
            <a href="#" target="_blank">GitHub</a> 
            <a href="#" target="_blank">Discord</a></div>
          </div>
          
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 DevGate. All rights reserved.</p>
        <div class="link-group">
            <h4>Legal</h4>
            <div>
            <a href="#">Privacy Policy</a> 
            <a href="#">Terms of Service</a> 
            <a href="#">Cookie Policy</a></div>
          </div>
      </div>
    </footer>
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
  background: linear-gradient(135deg, #f0f4ff, #dbeafe);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  position: relative;
  overflow: hidden;
}

/* Animated background elements */
.home-container::before,
.home-container::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  z-index: 1;
}

.home-container::before {
  width: 600px;
  height: 600px;
  top: -300px;
  right: -300px;
  animation: float 12s ease-in-out infinite;
}

.home-container::after {
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

.content-wrapper {
  width: 100%;
  max-width: 1100px;
  padding: 0 2rem;
  z-index: 2;
  position: relative;
}

.welcome-message {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  padding: 5rem 3rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.welcome-message::before {
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

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.welcome-message:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.2);
}


.welcome-message h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #6366f1; /* You can choose any one of the gradient colors */
  position: relative;
  display: inline-block;
}
.welcome-message h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #6366f1);
  border-radius: 2px;
}

.welcome-message p {
  font-size: 1.35rem;
  color: #475569;
  margin-bottom: 3rem;
  line-height: 1.7;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.welcome-message p::before,
.welcome-message p::after {
  content: '»';
  color: #6366f1;
  font-size: 1.8rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.welcome-message p::before{
  content: '«';
  color: #6366f1;
  font-size: 1.8rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}



.welcome-message p::before {
  left: -40px;
}

.welcome-message p::after {
  right: -40px;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(to right, #3b82f6, #6366f1, #8b5cf6);
  background-size: 200% auto;
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.4s ease;
  box-shadow: 0 8px 25px -5px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, #2563eb, #4f46e5, #7c3aed);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 9999px;
}

.cta-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.4);
  background-position: right center;
}

.cta-button:hover::before {
  opacity: 1;
}

.cta-button:active {
  transform: translateY(1px) scale(0.98);
}

/* Decorative elements */
.decorative-element {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morph 15s ease-in-out infinite;
  z-index: 1;
}

@keyframes morph {
  0% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform: rotate(0deg);
  }
  50% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 1.5rem;
  }

  .welcome-message {
    padding: 3rem 1.5rem;
  }

  .welcome-message h1 {
    font-size: 2.5rem;
  }

  .welcome-message p {
    font-size: 1.15rem;
  }

  .welcome-message p::before,
  .welcome-message p::after {
    display: none;
  }
  
  .home-container::before,
  .home-container::after {
    display: none;
  }
}

/* Animation for the entire container */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-message {
  animation: fadeIn 0.8s ease-out forwards;
}


/* Footer Styles */
.site-footer {
  width : 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 3rem 0 0;
  margin-top: auto;
  z-index: 10;
  position: relative;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.footer-brand h3 {
  margin-left: -260px;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #3b82f6; /* Picked the first gradient color */
}


.footer-brand p {
  color: #475569;
  line-height: 1.6;
  max-width: 300px;
  font-weight: bold;
}

.footer-links {
  display: flex;
  gap: 3rem;
}

.link-group h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
  position: relative;
  display: inline-block;
}

.link-group h4::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #6366f1);
}

.link-group div {
  color: #64748b;
  line-height: 1.8;
}

.link-group a {
  color: #475569;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.link-group a:hover {
  color: #3b82f6;
}

.link-group a::after {
  content: '|';
  margin: 0 8px;
  color: #cbd5e1;
}

.link-group a:last-child::after {
  display: none;
}

.footer-bottom {
  margin-top: 3rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
}

.footer-bottom p {
  color: #64748b;
  margin-bottom: 1rem;
}

.footer-bottom .link-group {
  display: inline-block;
  margin: 0 1rem;
}

.footer-bottom .link-group h4 {
  display: none;
}

.footer-bottom .link-group div {
  display: inline;
}

.footer-bottom .link-group a {
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-brand p {
    max-width: 100%;
  }
  
  .footer-bottom .link-group {
    display: block;
    margin: 0.5rem 0;
  }
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.site-footer {
  animation: fadeIn 0.6s ease-out forwards;
}

.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff, #dbeafe);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  position: relative;
  overflow: hidden;
}

.content-wrapper {
  width: 100%;
  max-width: 1100px;
  padding: 0 2rem;
  z-index: 2;
  position: relative;
  margin: 0 auto;
  flex: 1; /* This makes the content grow to push footer down */
  padding-bottom: 3rem; /* Adds space above footer */
}

.welcome-message {
  margin: 2rem 0 4rem; /* Increased bottom margin */
  /* rest of your welcome-message styles */
}


</style>