<template>
    <header class="navbar">
      <div class="nav-container">
        <div class="brand">
          <router-link to="/">Development Gate</router-link>
        </div>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/login">Login/Sign Up</router-link>
        </div>
      </div>
    </header>
  </template>
  
  <style scoped>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .navbar:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .brand a {
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: #3b82f6; /* Chose the first gradient color for a clean look */
  position: relative;
  transition: all 0.3s ease;
}

  
  .brand a:hover {
    transform: translateY(-1px);
  }
  
  .brand a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transition: width 0.3s ease;
  }
  
  .brand a:hover::after {
    width: 100%;
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  
  .nav-links a {
    position: relative;
    text-decoration: none;
    color: #475569;
    font-weight: 500;
    font-size: 1rem;
    padding: 0.5rem 0;
    transition: all 0.3s ease;
  }
  
  .nav-links a::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transition: width 0.3s ease;
  }
  
  .nav-links a:hover {
    color: #1e293b;
    transform: translateY(-1px);
  }
  
  .nav-links a:hover::before {
    width: 100%;
  }
  
  .nav-links a.router-link-exact-active {
    color: #3b82f6;
    font-weight: 600;
  }
  
  .nav-links a.router-link-exact-active::before {
    width: 100%;
    background: #3b82f6;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .nav-container {
      padding: 1rem;
      flex-direction: column;
      gap: 1rem;
    }
  
    .nav-links {
      gap: 1.5rem;
    }
  
    .brand a {
      font-size: 1.3rem;
    }
  }
  
  /* Animation for navbar entry */
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .navbar {
    animation: slideDown 0.5s ease-out forwards;
  }
  </style>