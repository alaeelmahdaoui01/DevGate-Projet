<template>
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="profile-section">
          <img src="https://sample-videos.com/img/Sample-jpg-image-10mb.jpg" alt="User Avatar" class="profile-avatar" />
          <h2 class="profile-name">{{ currentUser?.displayName || 'Loading...' }}</h2>
          <p class="profile-bio">{{  currentUser?.status || 'Loading...'  }}</p>
          <ul class="profile-details">
            <li><strong>Repositories:</strong> {{ projects.length }}</li>
            <li><strong>Location:</strong>{{ currentUser?.location || 'Loading...'  }}</li>
            <li><strong>LinkedIn:</strong> <a href="https://example.com" target="_blank">{{ currentUser?.linkedin }}</a></li>
          </ul>
        </div>

         <!-- Edit Profile Button -->
         <button 
          v-if="isCurrentUser"
          class="edit-profile-btn"
          @click="editProfile"
        >
          Edit Profile
        </button>

      </aside>
  
      <!-- Main Content -->
      <main class="main-content">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Projects</h1>
        </div>
  
        <!-- List View -->
        <div>
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-item"
          >
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-meta">
                <p class="project-stack">
                  Stack: {{ Array.isArray(project.stack) ? project.stack.join(', ') : 'N/A' }}
                </p>
                <a
                  v-if="project.githubLink"
                  :href="project.githubLink"
                  target="_blank"
                  class="github-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/Firebase/config';
import { waitForAuthInit, getUser } from '@/Firebase/Authentification/getUser';

export default {
  name: 'DashboardView',
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      projects: [],
      currentUser: null,
    };
  },
  computed: {
    filteredProjects() {
      return this.projects; // Display all projects in the dashboard
    },
    isCurrentUser() {
      return this.currentUser && this.currentUser.uid === this.userId;
    },
  },
  methods: {
    async fetchProjects() {
      await waitForAuthInit(); // Wait for authentication initialization
      const user = getUser();

      if (!user) {
        console.warn('User not logged in');
        return;
      }

      this.currentUser = user; // Set current user from `getUser()`

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          // Merge Firestore displayName if available
          if (userData.displayName) {
            this.currentUser.displayName = userData.displayName;
            this.currentUser.status = userData.status;
            this.currentUser.location = userData.location;
          }

          // Fetch projects
          const userProjects = userData.projects || [];
          const fetchedProjects = [];
          for (const proj of userProjects) {
            const projDoc = await getDoc(doc(db, 'projects', proj.id));
            if (projDoc.exists()) {
              fetchedProjects.push({ id: proj.id, ...projDoc.data() });
            }
          }
          this.projects = fetchedProjects;
        } else {
          console.warn('User document not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data or projects:', error);
      }
    },
    editProfile() {
      this.$router.push(`/editprofile/${this.userId}`);
    },
  },
  mounted() {
    this.fetchProjects();
  },
};
</script>


  <style scoped>
  .dashboard-container {
    display: flex;
    margin-top: 50px;
    gap: 2rem;
    padding: 2rem;
    background: #f9fafb;
  }
  
  .sidebar {
    flex: 1;
    max-width: 300px;
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .profile-avatar {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    margin: 0 auto 1rem;
    display: block;
  }
  
  .profile-name {
    text-align: center;
    font-size: 1.25rem;
    font-weight: bold;
    color: #1e3a8a;
    margin-bottom: 0.5rem;
  }
  
  .profile-bio {
    text-align: center;
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 1rem;
  }
  
  .profile-details {
    list-style: none;
    padding: 0;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .profile-details li {
    margin-bottom: 0.5rem;
  }
  
  .main-content {
    flex: 3;
  }
  
  /* Project List */
  .project-item {
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(203, 213, 225, 0.25);
    padding: 1.25rem;
    border-radius: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .project-content {
    flex: 1;
    min-width: 0;
  }
  
  .project-title {
    font-weight: 600;
    color: #1e40af;
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }
  
  .project-description {
    color: #4b5563;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  
  .project-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .github-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8125rem;
    color: #3b82f6;
    text-decoration: none;
  }
  
  .github-link:hover {
    color: #2563eb;
  }
  
  .github-link svg {
    width: 16px;
    height: 16px;
  }
  .edit-profile-btn {
  display: block;
  margin: 1rem auto 0;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.edit-profile-btn:hover {
  background-color: #2563eb;
}
  </style>
  