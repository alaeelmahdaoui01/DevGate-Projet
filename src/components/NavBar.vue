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
    background: rgba(30, 30, 47, 0.8);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
  }
  
  .brand a {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    text-decoration: none;
    background: linear-gradient(to right, #ffffff, #c9d6ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    transition: all 0.3s ease;
  }
  
  .nav-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .nav-links a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
  }
  
  .nav-links a:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .nav-links a.router-link-exact-active {
    color: white;
    background: linear-gradient(135deg, rgba(255, 94, 125, 0.2), rgba(255, 45, 95, 0.2));
  }
  
  @media (max-width: 768px) {
    nav {
      padding: 1rem;
    }
    
    .brand a {
      font-size: 1.25rem;
    }
    
    .nav-links {
      gap: 0.75rem;
    }
    
    .nav-links a {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
  </style>
  