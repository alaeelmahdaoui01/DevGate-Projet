<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="profile-section">
        <img
          :src="userProfile?.photoURL || 'https://via.placeholder.com/150'"
          alt="User Avatar"
          class="profile-avatar"
        />
        <h2 class="profile-name">{{ userProfile?.displayName || 'Loading...' }}</h2>
        <p class="profile-bio" v-if="userProfile?.status">{{ userProfile?.status }}</p>
        <ul class="profile-details">
          <li v-if="userProfile?.email"><strong>Email: </strong> {{ userProfile.email }}</li>
          <li><strong>Repositories: </strong> {{ projects.length }}</li>
          <li v-if="userProfile?.location"><strong>Location: </strong> {{ userProfile.location }}</li>
          <li v-if="userProfile?.linkedin"><strong>LinkedIn: </strong> 
            <a v-if="userProfile?.linkedin" :href="userProfile.linkedin" target="_blank">{{ userProfile.linkedin }}</a>
          </li>
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
      <!-- Projects Section -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Projects</h1>
      </div>
      <div>
        <div
          v-for="project in projects"
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
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Objectives Section -->
      <div class="flex justify-between items-center mb-6 mt-10">
        <h1 class="text-2xl font-bold">Objectives</h1>
        <!-- <button v-if="isCurrentUser" class="add-objective-btn" @click="$emit('open-create-objective-modal')">
          Add Objective
        </button> -->
      </div>
      <div>
        <div v-for="objective in objectives" :key="objective.id" class="objective-item">
          <div class="objective-content">
            <h3 class="objective-title">{{ objective.title }}</h3>
            <p class="objective-description">{{ objective.description }}</p>
            <p class="objective-status">Status: {{ objective.status }}</p>
            <p class="objective-progress">Progress: {{ objective.progress }}%</p>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: objective.progress + '%' }"
                :class="{
                  'bg-blue-500': objective.progress < 50,
                  'bg-green-500': objective.progress >= 50 && objective.progress < 80,
                  'bg-purple-500': objective.progress >= 80
                }"
              ></div>
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
      objectives: [],
      userProfile: null,
      currentUser: null,
      showAddObjectiveModal: false,
      showEditObjectiveModal: false,
      selectedObjective: null,
    };
  },
  computed: {
    isCurrentUser() {
      return this.currentUser && this.currentUser.uid === this.userId;
    },
  },
  methods: {
    async fetchUserProfile() {
      try {
        const userDocRef = doc(db, 'users', this.userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          this.userProfile = userData;

          // Fetch user's projects
          const userProjects = userData.projects || [];
          const fetchedProjects = [];
          for (const proj of userProjects) {
            const projDoc = await getDoc(doc(db, 'projects', proj.id));
            if (projDoc.exists()) {
              fetchedProjects.push({ id: proj.id, ...projDoc.data() });
            }
          }
          this.projects = fetchedProjects;

          // Fetch objectives
          const userObjectives = userData.objectives || [];
          const fetchedObjectives = [];
          for (const obj of userObjectives) {
            const objDoc = await getDoc(doc(db, 'objectives', obj.id));
            if (objDoc.exists()) {
              fetchedObjectives.push({ id: obj.id, ...objDoc.data() });
            }
          }
          this.objectives = fetchedObjectives;

        } else {
          console.warn('User document not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user profile or projects:', error);
      }
    },

    async fetchCurrentUser() {
      await waitForAuthInit();
      const user = getUser();
      if (user) {
        this.currentUser = user;
      }
    },

    editProfile() {
      this.$router.push(`/editprofile/${this.userId}`);
    },
  },
  async mounted() {
    await this.fetchCurrentUser();
    await this.fetchUserProfile();
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

.objective-item {
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(203, 213, 225, 0.25);
    padding: 1.25rem;
    border-radius: 0.75rem;
    margin-bottom: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .objective-content {
    flex: 1;
  }

  .objective-title {
    font-weight: 600;
    color: #1e40af;
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .objective-description {
    color: #4b5563;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .objective-status,
  .objective-progress {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .progress-bar {
    background: #e5e7eb;
    height: 0.5rem;
    border-radius: 0.375rem;
    overflow: hidden;
    margin-top: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s ease-in-out;
  }

  .progress-fill.bg-blue-500 {
    background-color: #3b82f6;
  }

  .progress-fill.bg-green-500 {
    background-color: #10b981;
  }

  .progress-fill.bg-purple-500 {
    background-color: #8b5cf6;
  }


  </style>
  