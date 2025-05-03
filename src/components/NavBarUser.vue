<template>
  <div class="navbar-container">
      <nav class="navbar">
          <div class="buttons-container">
              <router-link :to="'/dashboard/' + user.uid" class="button">Dashboard</router-link>
              <router-link :to="'/projects/' + user.uid" class="button">Projects</router-link>
              <router-link :to="'/objectives/' + user.uid" class="button">Objectives</router-link>
              <router-link :to="'/skills/' + user.uid" class="button">Skills</router-link>
              <router-link to="/timeline" class="button">Timeline</router-link>
          </div>

          <div class="search-container">
              <input 
                  type="text" 
                  placeholder="Search users..." 
                  class="search-input"
                  v-model="searchQuery"
                  @input="searchUsers"
                  @keyup.enter="performSearch"
              />
              <button class="search-button" @click="performSearch">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
              </button>
              <div v-if="searchResults.length > 0 && searchQuery" class="search-results-dropdown">
                  <div 
                      v-for="result in searchResults" 
                      :key="result.id"
                      class="search-result-item"
                      @click="goToUserProfile(result.id)"
                  >
                      <img :src="result.photoURL || userAvatar" class="search-result-avatar">
                      <div class="search-result-info">
                          <div class="search-result-name">{{ result.displayName }}</div>
                          <div class="search-result-email">{{ result.email }}</div>
                      </div>
                  </div>
              </div>
              <div v-else-if="searchResults.length == 0 && searchQuery" class="search-results-dropdown">
                <div class="no-results">No results found</div>
              </div>

          </div>

          <div class="usermenu">
              <button class="button" @click="leave">Sign out</button>
          </div>
      </nav>
  </div>
</template>
  
<script>
import signOut from '@/Firebase/Authentification/SignOut';
import { collection, getDocs, query, orderBy, startAt, endAt } from 'firebase/firestore';

import { db } from '@/Firebase/config';


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
            searchQuery: '',
            searchResults: [],
            searchTimeout: null
        }
    },
    methods: {
        leave() {
            signOut();
            this.$router.push('/');
        },


async searchUsers() {
  clearTimeout(this.searchTimeout);

  if (!this.searchQuery) {
    this.searchResults = [];
    return;
  }

  this.searchTimeout = setTimeout(async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('displayName'),
        startAt(this.searchQuery),
        endAt(this.searchQuery + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      this.searchResults = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error searching users:", error);
      this.searchResults = [];
    }
  }, 300);
}
,
        performSearch() {
            if (this.searchResults.length > 0) {
                this.goToUserProfile(this.searchResults[0].id);
            }
        },
        // goToUserProfile(userId) {
        //     this.searchQuery = '';
        //     this.searchResults = [];
        //     this.$router.push(`/dashboard/${userId}`);
        // }
        goToUserProfile(userId) {
          this.searchQuery = '';
          this.searchResults = [];
          this.$router.push(`/dashboard/${userId}`).then(() => {
              window.location.reload();
          }).catch(err => {
              console.error('Navigation error:', err);
        });
    }
    },
    created() {
        // Pour fermer les résultats de recherche quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)) {
                this.searchResults = [];
            }
        });
    },
    computed:  {userAvatar() {
    return this.userProfile?.photoURL || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg';
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

.search-container {
    position: relative;
}

.search-results-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
}

.search-result-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.search-result-item:hover {
    background-color: #f5f5f5;
}

.search-result-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
}

.search-result-info {
    flex: 1;
}

.search-result-name {
    font-weight: bold;
}

.search-result-email {
    font-size: 0.8em;
    color: #666;
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

.no-results {
  padding: 12px;
  color: #999;
  font-style: italic;
  text-align: center;
  background-color: #fafafa;
  border-top: 1px solid #eee;
}

.search-results-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    transition: all 0.3s ease-in-out;
}

.search-result-item {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    gap: 10px;
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: background 0.2s ease, transform 0.2s ease;
}

.search-result-item:last-child {
    border-bottom: none;
}

.search-result-item:hover {
    background: rgba(59, 130, 246, 0.1);
    transform: translateX(2px);
}

.search-result-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.search-result-item:hover .search-result-avatar {
    transform: scale(1.05);
}

.search-result-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.search-result-name {
    font-weight: 600;
    color: #1e293b;
}

.search-result-email {
    font-size: 0.8rem;
    color: #64748b;
}

</style>