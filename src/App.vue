<template>
  <NavBarUser v-if="islogged" :user="user"/>
  <router-view/>
</template>

<script>
import { getUser, isLogged, waitForAuthInit } from '@/Firebase/Authentification/getUser';
//import { ref, onMounted } from 'vue';
import NavBarUser from './components/NavBarUser.vue';

export default {
  name: 'App',
  components: { NavBarUser },
  data() {
    return {
      user: null,
      islogged: false,
    };
  },
  async mounted() {
    // Wait for auth to initialize
    await waitForAuthInit();
    
    // Set initial state
    this.updateAuthState();
    
    this.authWatcher = setInterval(() => {
      this.updateAuthState();
    }, 500);
  },
  beforeUnmount() {
    // Clean up the interval when component unmounts
    if (this.authWatcher) {
      clearInterval(this.authWatcher);
    }
  },
  methods: {
    updateAuthState() {
      const currentUser = getUser();
      if (currentUser !== this.user || !!currentUser !== this.islogged) {
        this.user = currentUser;
        this.islogged = isLogged();
      }
    }
  }
}
</script>


<style>

body {
  font-family: 'Inter', sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

