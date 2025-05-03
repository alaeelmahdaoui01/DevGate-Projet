<template>
     <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
  <div class="profile-section">
    <img
      :src="userProfile?.photoURL || userAvatar"
      alt="User Avatar"
      class="profile-avatar"
    />
    <h2 class="profile-name">{{ userProfile?.displayName || 'Loading...' }}</h2>
    <p class="profile-bio" v-if="userProfile?.status">{{ userProfile?.status }}</p>
    <br>
    <ul class="profile-details">
      <li v-if="userProfile?.email" class="b"><strong>Email: </strong> {{ userProfile.email }}</li>
      <li class="a"><strong>  Repositories: </strong> {{ projects.length }}</li>
      <li v-if="userProfile?.location"><strong>Location: </strong> {{ userProfile.location }}</li>
      <li v-if="userProfile?.linkedin"><strong>LinkedIn: </strong> 
        <a :href="userProfile.linkedin" target="_blank">{{ userProfile.linkedin }}</a>
      </li>
    </ul>
    <br>
    <!-- Skills Section -->
    <div v-if="userProfile && userProfile.skills && userProfile.skills.length" class="skills-section" style="position: relative;">
      <div class="skills-header">
      <h3 class="skills-title">Skills</h3>
      <button @click="goToSkills()" class="view-all-btn1">
            View All Skills
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      <ul class="skills-list">
        <li v-for="skill in userProfile.skills" :key="skill" class="skill-item">
          {{ skill.name }}
        </li>
      </ul>
    </div>
  </div>
  <br>
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
        <div class="section-header">
          <h1 class="text-2xl font-bold">Projects</h1>
          <button @click="goToProject()" class="view-all-btn">
            View All Projects
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
        </div>

        <div v-else-if="!isLoading && projects.length === 0" class="empty-state">
          No projects found.
        </div>
        <div v-else class="card-grid">
            <div
            v-for="project in projects.slice(0, 2)"
            :key="project.id"
            class="project-card"
            >
            <div class="card-content">
                <div class="project-header">
                <img 
                    v-if="project.image"
                    :src="project.image" 
                    class="project-image"
                    alt="Project thumbnail"
                >
                <h3>{{ project.title }}</h3>
                </div>
                <div class="card-footer">
                <a
                    v-if="project.githubLink"
                    :href="project.githubLink"
                    target="_blank"
                    class="github-btn"
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
        <br><br>
        <!-- Objectives Section -->
        <div class="section-header">
          <h1 class="text-2xl font-bold">Objectives</h1>
          <button @click="goToObjective()" class="view-all-btn">
            View All Objectives
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
        </div>

        <div v-else-if="!isLoading && objectives.length === 0" class="empty-state">
          No objectives found.
        </div>
        <div v-else class="card-grid">
          <div 
            v-for="objective in objectives.slice(0, 2)" 
            :key="objective.id" 
            class="objective-card"
          >
            <div class="card-content">
              <h3>{{ objective.title }}</h3>
              <div class="progress-container">
                <div class="progress-labels">
                  <span>Progress</span>
                  <span>{{ objective.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    :style="{ width: objective.progress + '%' }"
                    :class="{
                      'low': objective.progress < 30,
                      'medium': objective.progress >= 30 && objective.progress < 70,
                      'high': objective.progress >= 70
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br><br><br><br>
        <div class="visualization-section">
        <div class="c">
        <h1 class="text-2xl font-bold">Visualisation</h1></div>
        <br>
        <div class="visualization-content">
          <ProjectsPerDay :userId="id" />
          <ProgressOverTime :userId="id" />
          <!--SkillsChart :userId="id" /-->
          <br>
          <SkillsChart :id="id" />
        </div>
      </div>

      </main>

      <div v-if="showModal" class="modal-overlay">
        <div v-if="showModal" class="modal-content">
        <EditModal 
          :id="id"
          @close="closeModal"
          @save="updateUserProfile"
        />
      </div></div>

    </div>
</template>


  
<script>
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '@/Firebase/config';
  import { waitForAuthInit, getUser } from '@/Firebase/Authentification/getUser';
  import ProjectsPerDay from '@/components/ProjectPerMonth.vue'
  import ProgressOverTime from '@/components/ProgressOverTime.vue'
    import SkillsChart from '@/components/VisCompskills1.vue'
  import EditModal from '@/views/EditProfile.vue'

  export default {
    name: 'DashboardView',
    components: { ProjectsPerDay, ProgressOverTime, EditModal, SkillsChart},
    props: {
      id: {  
        type: String,
        required: true,
      },
    },
    data() {
      return {
        showModal:false,
        isLoading: false,
        projects: [],
        objectives: [],
        skills: [],
        userProfile: null,
        currentUser: null,
      };
    },
    computed: {
      isCurrentUser() {
        return this.currentUser && this.currentUser.uid === this.id;
      },
      userAvatar() {
    return this.userProfile?.photoURL || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg';
  }
    },
    methods: {
        goToProject() {
  this.$router.push(`/projects/${this.id}`);
},goToObjective() {
  this.$router.push(`/objectives/${this.id}`);
},
goToSkills() {
  this.$router.push(`/skills/${this.id}`);
},
      async fetchUserData() {
        this.isLoading = true;
        try {
          // Fetch current user
          await waitForAuthInit();
          const user = getUser();
          if (user) {
            this.currentUser = user;
          }
  
          // Fetch profile data
          const userDocRef = doc(db, 'users', this.id);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            this.userProfile = userData;
  
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


            const userSkills = userData.skills || [];
            const fetchedSkills = [];
            for (const skill of userSkills) {
              const skillDoc = await getDoc(doc(db, 'skills', skill.id));
              if (skillDoc.exists()) {
                fetchedSkills.push({ id: skill.id, ...skillDoc.data() });
              }
            }
            this.skills = fetchedSkills;

          } else {
            console.warn('User document not found in Firestore');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          this.isLoading = false;
        }
      },
      editProfile() {
        this.showModal= true;
      },
      closeModal(){
        this.showModal= false;
      },
      updateUserProfile(updatedProfile){
        this.userProfile = { ...this.userProfile, ...updatedProfile };
        this.closeModal();
      }
    },
    watch: {
      id: {
        immediate: true,
        handler() {
          this.fetchUserData();
        }
      }
    }
  };
  </script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  /* Account for navbar height */
  top: 60px; /* Adjust this value to match your navbar height */
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: calc(100vh - 200px); /* Adjust based on navbar */
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

 @media (max-width: 768px) {
  .modal-overlay {
    top: 50px; /* Lower the modal less on smaller screens */
  }

  .modal-content {
    max-height: calc(100vh - 100px); /* Adjust for smaller screens */
   }
} 

/* Make sure buttons stay visible */
.profile-edit-container {
  display: flex;
  flex-direction: column;
  min-height: 400px; /* Minimum height to ensure buttons are visible */
}

.form-actions {
  margin-top: auto; /* Pushes buttons to bottom */
  padding-top: 20px;
  position: sticky;
  bottom: 0;
  background: white;
}


  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f4ff, #dbeafe);
    padding: 2rem;
    gap: 2rem;
    position: relative;
    overflow: hidden;
  }
  
  /* Animated background elements */
  .dashboard-container::before,
  .dashboard-container::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.1);
    z-index: 1;
  }
  
  .dashboard-container::before {
    width: 600px;
    height: 600px;
    bottom: -300px;
    left: -300px;
    animation: float 12s ease-in-out infinite;
  }
  
  .dashboard-container::after {
    width: 400px;
    height: 400px;
    top: -150px;
    right: -150px;
    animation: float 8s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(20px, -20px) rotate(5deg);
    }
  }
  
  .sidebar {
    flex: 1;
    max-width: 320px;
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 1.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    height: fit-content;
    position: sticky;
    top: 2rem;
    z-index: 2;
  }
  
  .profile-avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    display: block;
    object-fit: cover;
    border: 4px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 20px -5px rgba(59, 130, 246, 0.3);
  }
  
  .profile-name {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 0.75rem;
    position: relative;
  }
  
  .profile-name::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #6366f1);
    border-radius: 3px;
  }
  
  .profile-bio {
    text-align: center;
    font-size: 0.95rem;
    color: #4b5563;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .profile-details {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;
  }
  
  .profile-details li {
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: #4b5563;
    display: flex;
  }
  
  .profile-details strong {
    color: #1e293b;
    min-width: 100px;
    display: inline-block;
  }
  
  .main-content {
    flex: 3;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 2;
  }
  
  .project-item,
  .objective-item {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(203, 213, 225, 0.3);
    cursor: pointer;
  }
  
  .project-item:hover,
  .objective-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.2);
  }
  
  .project-item:active,
  .objective-item:active {
    transform: translateY(1px);
  }
  
  .project-title,
  .objective-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 0.75rem;
  }
  
  .project-description,
  .objective-description {
    color: #4b5563;
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .project-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .project-stack {
    color: #64748b;
    font-size: 0.9rem;
  }
  
  .github-link {
    color: #3b82f6;
    font-weight: 500;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }
  
  .github-link:hover {
    color: #2563eb;
    transform: translateX(3px);
  }
  
  .objective-status,
  .objective-progress {
    color: #4b5563;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  .edit-profile-btn {
    display: block;
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(to right, #3b82f6, #6366f1);
    color: white;
    font-weight: 500;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1.5rem;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
  }
  
  .edit-profile-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(59, 130, 246, 0.3);
  }
  
  .edit-profile-btn:active {
    transform: translateY(0);
  }
  
  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .dashboard-container {
      flex-direction: column;
    }
    
    .sidebar {
      max-width: 100%;
      position: static;
    }
    
    .profile-avatar {
      width: 150px;
      height: 150px;
    }
  }
  
  @media (max-width: 768px) {
    .dashboard-container {
      padding: 1rem;
    }
    
    .sidebar,
    .main-content {
      padding: 1.5rem;
    }
    
    .dashboard-container::before,
    .dashboard-container::after {
      display: none;
    }
  }
  
  /* Animation for content */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .project-item,
  .objective-item {
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: calc(var(--item-index) * 0.1s);
  }


  /* Base Container */
.dashboard-container {
  display: flex;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f0f4ff, #dbeafe);
  padding: 2rem;
  gap: 2rem;
  margin-top: 80px;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e3a8a;
}

/* View All Buttons */
.view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Shared Card Styles */
.project-card,
.objective-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(203, 213, 225, 0.5);
}

.project-card:hover,
.objective-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1rem;
}

/* Project Card Specific */
.project-card .card-footer {
  display: flex;
  justify-content: flex-end;
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(31, 41, 55, 0.05);
  color: #374151;
  border-radius: 6px;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.github-btn:hover {
  background: rgba(31, 41, 55, 0.1);
}

/* Objective Card Specific */
.progress-container {
  margin-top: 1.5rem;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.progress-bar {
  height: 8px;
  background: rgba(203, 213, 225, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

/* Progress Color Stages */
.progress-fill.low {
  background: #ef4444; /* Red for <30% */
}

.progress-fill.medium {
  background: #f59e0b; /* Amber for 30-70% */
}

.progress-fill.high {
  background: #10b981; /* Emerald for >=70% */
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  background: rgba(241, 245, 249, 0.5);
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    padding: 1rem;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
}


.project-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.project-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Adjust the title to accommodate the image */
.project-card h3 {
  margin: 0;
  flex: 1;
  font-size: 1.1rem;
  line-height: 1.3;
}

/* Make the entire card content clickable */
.project-card {
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .project-image {
    width: 40px;
    height: 40px;
  }
}
.skills-section {
  margin-top: 1.5rem;
}

.skills-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.75rem;
}

.skills-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-item {
  background: #e0f2fe;
  color: #0284c7;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.view-all-btn1 {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn1:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.btn-icon1 {
  width: 0.75rem;
  height: 0.75rem;
}
.a{
  margin-left : 13px
}

.b{
  margin-left : -11px
}

.skills-header {
  display: flex;
  justify-content: space-between; /* Space between title and button */
  align-items: center; /* Align items vertically */
  margin-bottom: 1rem; /* Add spacing below the header */
}

.skills-title {
  text-align:left;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  position: relative;
  margin: 0;
}

.skills-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

.text-2xl.font-bold {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  position: relative;
}

.text-2xl.font-bold::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

.c{
  text-align : left ;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
  </style>