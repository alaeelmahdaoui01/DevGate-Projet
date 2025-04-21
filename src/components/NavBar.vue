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
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    border-bottom: 1px solid #e2e8f0;
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
  
  .brand a {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a365d;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  .brand a:hover {
    color: #3182ce;
  }
  
  .nav-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  
  .nav-links a {
    color: #4a5568;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-size: 1rem;
  }
  
  .nav-links a:hover {
    color: #3182ce;
    background-color: #ebf8ff;
  }
  
  .nav-links a.router-link-exact-active {
    color: #3182ce;
    background-color: #ebf8ff;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    .nav-container {
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