<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Projects</h1>
      <button v-show="id === currentUserId" @click="openAddModal" class="btn-primary">+ Add Project</button>
    </div>

    <div class="flex justify-between items-center mb-4">
      <div>
        <label for="viewToggle" class="mr-2">View:   </label>
        <select v-model="viewMode" id="viewToggle" class="select">
          <option value="gallery">Gallery</option>
          <option value="list">List</option>
        </select>
      </div>
      <div>
        <input v-model="searchStack" placeholder="Filter by stack or title..." class="input" />
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="!isLoading && projects.length === 0" class="empty-state">
      <div class="empty-icon">📂</div>
      <p>No projects found.</p> <p v-if="id === currentUserId">Add your first project to get started!</p>
      <button @click="openAddModal" class="btn-primary" v-if="id === currentUserId">Add project</button>
    </div>

    <div v-else>
    <!-- Gallery View -->
    <div v-if="viewMode === 'gallery'" class="projects-grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        :Id="id"
        @edit="editProject"
        @delete="deleteProject"
      />
    </div>

    <!-- List View -->
    <div v-else>
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
        <div class="project-actions">
          <button v-if="id === currentUserId" class="btn-sm" @click="editProject(project)">Edit</button>
          <button v-if="id === currentUserId" class="btn-sm btn-danger" @click="deleteProject(project.id)">Delete</button>
        </div>
      </div>
    </div> </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
    <ProjectModal @close="closeModal" @saved="onProjectSaved" />
  </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay">

      <div class="modal-content">
    <EditProjectModal 
      :selectedProject="selectedProject"
      @close="closeModal"
      @saved="onProjectSaved"
    />
  </div>
    
    </div>

    

  </div>
</template>




<script>
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/Firebase/config'
import { getAuth } from 'firebase/auth';

import ProjectCard from '@/components/ProjectCard.vue'
import ProjectModal from '@/components/CreateProjectModal.vue'
import EditProjectModal from '@/components/EditProjetModal.vue'

import { deleteProject } from '@/Firebase/Firestore/deleteProject';

export default {
  name: 'ProjectsPage',
  components: {
    ProjectCard,
    ProjectModal,
    EditProjectModal
  },
  data() {
    return {
      isLoading: false,
      viewMode: 'gallery',
      searchStack: '',
      projects: [],
      showModal: false,
      showEditModal: false,
      selectedProject: null,
      currentUserId: null,
      userId: '',
    }
  },
  computed: {
    filteredProjects() {
      if (!this.searchStack) return this.projects
      const filterText = this.searchStack.toLowerCase()
      
      return this.projects.filter(p => {
        const matchesTitle = p.title?.toLowerCase().includes(filterText)
        const matchesStack = p.stack?.some(stackItem =>
          stackItem.toLowerCase().includes(filterText)
        )
        return matchesTitle || matchesStack
      })
    }
  },
  methods: {
    async fetchCurrentUser() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        this.currentUserId = user.uid;
      }
    },
    onProjectSaved() {
      this.fetchProjects() // Refresh the projects list
      this.showModal = false
      this.showEditModal = false
    },
    openAddModal() {
      this.selectedProject = null
      this.showModal = true
      this.showEditModal = false
    },
    editProject(project) {
      console.log(project); // Debugging
      this.showModal = false
      this.showEditModal = true
      this.selectedProject = project
    },
    async deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
          try {
            await deleteProject(id, this.userId);
            this.fetchProjects();
          } catch (error) {
            alert('Error deleting project');
          }
        }
      },
    closeModal() {
      this.showModal = false
      this.showEditModal = false
    },
    async fetchProjects() {
            this.isLoading = true;
            try {
                const userDocRef = doc(db, 'users', this.id);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const userProjects = userData.projects || [];
                    const fetchedProjects = [];

                    this.userId = userDocSnap.id;

                    for (const proj of userProjects) {
                        const projDoc = await getDoc(doc(db, 'projects', proj.id));
                        if (projDoc.exists()) {
                            fetchedProjects.push({ id: proj.id, ...projDoc.data() });
                        }
                    }

                    this.projects = fetchedProjects;
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
            this.isLoading = false;
        },
  },
  mounted() {
  this.fetchCurrentUser();
},

  //mounted() {
    //this.fetchProjects()
  //},

  props: {
        id: {
            type: String,
            required: true
        }
    },
    watch: {
        id: {
            immediate: true,
            handler() {
                this.fetchProjects();
            }
        }
    }
}
</script>


<style scoped>

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
.btn-primary {
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
  border: 1px dashed rgba(203, 213, 225, 0.5);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}
/* Base container styles */
.p-6 {
  padding: 4rem;
  padding-top: 6rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff, #dbeafe);
  position: relative;
    overflow: hidden;
    /* min-height: 100vh; */
}

/* Header section */
.flex.justify-between.items-center.mb-6 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

/* Filter controls */
.flex.justify-between.items-center.mb-4 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.03);
}

/* Buttons */
.btn-primary {
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-sm {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.8);
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sm:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.btn-danger {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Form elements */
.select, .input {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(203, 213, 225, 0.5);
  background: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.select:focus, .input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.input {
  width: 200px;
}

/* Gallery View */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
}

/* List View Styles */
.project-item {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(203, 213, 225, 0.25);
  transition: all 0.3s ease;
  padding: 1.25rem;
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.project-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.35);
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

.project-stack {
  font-size: 0.8125rem;
  color: #64748b;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s ease;
}

.github-link:hover {
  color: #2563eb;
}

.github-link svg {
  width: 16px;
  height: 16px;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1.5rem;
}


.modal-overlay {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}




/* Responsive Design */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .p-6 {
    padding-top: 5rem;
  }
  
  .flex.justify-between.items-center.mb-6,
  .flex.justify-between.items-center.mb-4 {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .input {
    width: 100%;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .project-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}

</style>