<template>
    <div class="navbar-container">
        <nav class="navbar">
            <div class="buttons-container">
                <router-link to="/dashboard" class="button">Dashboard</router-link>
                <router-link to="/#" class="button">Skills Tracker</router-link>
                <router-link to="/projects" class="button">Projects</router-link>
                <router-link to="/objectives" class="button">Objectives</router-link>
                <router-link to="/#" class="button">Timeline</router-link>
                <router-link to="/#" class="button">Stats</router-link>
            </div>

            <div class="search-container">
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    class="search-input"
                    v-model="searchQuery"
                    @keyup.enter="performSearch"
                />
                <button class="search-button" @click="performSearch">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>


            <div class="usermenu">
                <router-link :to="'/profile/' + user.uid" class="username">
                    <img :src="URLimg" class="userphoto">
                </router-link>
                <router-link :to="'/profile/' + user.uid" class="username"></router-link>
                <button class="button" @click="leave">Sign out</button>
            </div>
        </nav>
    </div>
</template>
  
<script>
import signOut from '@/Firebase/Authentification/SignOut';

export default {
name: 'UserInfo',
props: {
    user: {
        type: Object,
        required: true
    }
},
data() {
    return {
        URLimg: "https://th.bing.com/th/id/OIP.DQdhyRifE5tywz-uIlBKUAHaHa?rs=1&pid=ImgDetMain",
        searchQuery: ''  // i should add a method for this search query 
    }
},
methods: {
    leave() {
    signOut();
    this.$router.push('/');
    }
}
}
</script>
  
<style scoped>
.navbar-container {
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

.navbar-container:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.navbar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttons-container {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.search-container {
    flex: 1;
    max-width: 400px;
    position: relative;
    margin: 0 1rem;
}

.search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    transition: all 0.3s ease;
    outline: none;
}

.search-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    background: rgba(255, 255, 255, 0.9);
}

.search-button {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
    transition: color 0.2s ease;
}

.search-button:hover {
    color: #3b82f6;
}

.button {
  position: relative;
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.button::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
}

.button:hover {
  color: #1e293b;
  transform: translateY(-1px);
}

.button:hover::before {
  width: 100%;
}

.button.router-link-exact-active {
  color: #3b82f6;
  font-weight: 600;
}

.button.router-link-exact-active::before {
  width: 100%;
  background: #3b82f6;
}

.usermenu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.userphoto {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.userphoto:hover {
  transform: scale(1.1);
}

.username {
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  transition: color 0.3s ease;
}

.username:hover {
  color: #3b82f6;
}

/* Responsive design */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .buttons-container {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .usermenu {
    gap: 1rem;
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

.navbar-container {
  animation: slideDown 0.5s ease-out forwards;
}
</style>