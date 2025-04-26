<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">My Projects</h1>
      <button @click="openAddModal" class="btn-primary">+ Add Project</button>
    </div>

    <div class="flex justify-between items-center mb-4">
      <div>
        <label for="viewToggle" class="mr-2">View:</label>
        <select v-model="viewMode" id="viewToggle" class="select">
          <option value="gallery">Gallery</option>
          <option value="list">List</option>
        </select>
      </div>
      <div>
        <input v-model="searchStack" placeholder="Filter by stack..." class="input" />
      </div>
    </div>

    <!-- Gallery View -->
    <div v-if="viewMode === 'gallery'" class="projects-grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        @edit="editProject"
        @delete="deleteProject"
      />
    </div>

    <!-- List View -->
    <div v-else>
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="border rounded p-4 mb-2 flex justify-between items-center"
      >
        <div>
          <h3 class="font-semibold">{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <p class="text-sm text-gray-500">
            Stack: {{ Array.isArray(project.stack) ? project.stack.join(', ') : 'N/A' }}
          </p>
        </div>
        <div class="flex gap-2">
          <button class="btn-sm" @click="editProject(project)">Edit</button>
          <button class="btn-sm btn-danger" @click="deleteProject(project.id)">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <ProjectModal @close="closeModal" @saved="onProjectSaved" />
    </div>

    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <EditProjectModal 
        :project="selectedProject"
        @close="closeModal"
        @saved="onProjectSaved"
      />
    </div>

  </div>
</template>

<script>
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/Firebase/config'
import { waitForAuthInit, getUser } from '@/Firebase/Authentification/getUser'

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
      viewMode: 'gallery',
      searchStack: '',
      projects: [],
      showModal: false,
      showEditModal: false,
      selectedProject: null,
    }
  },
  computed: {
    filteredProjects() {
      if (!this.searchStack) return this.projects
      const titleFilter = this.searchStack.toLowerCase()
      return this.projects.filter(p =>
        p.title?.toLowerCase().includes(titleFilter)
      )
    }
  },
  methods: {
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
      this.selectedProject = project
      this.showEditModal = true
    },
    async deleteProject(id) {
      try {
        await deleteProject(id);
        this.fetchProjects(); // Refresh list after deletion
      } catch (error) {
        alert('Error deleting project');
      }
    },
    closeModal() {
      this.showModal = false
      this.showEditModal = false
    },
    async fetchProjects() {
      await waitForAuthInit()
      const user = getUser()

      if (!user) {
        console.warn('User not logged in')
        return
      }

      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const userProjects = userData.projects || []
        const fetchedProjects = []

        for (const proj of userProjects) {
          const projDoc = await getDoc(doc(db, 'projects', proj.id))
          if (projDoc.exists()) {
            fetchedProjects.push({ id: proj.id, ...projDoc.data() })
          }
        }

        this.projects = fetchedProjects
      }
    },
  },
  mounted() {
    this.fetchProjects()
  },
}
</script>



<style scoped>

/* Base container styles */
.p-6 {
  padding: 1.5rem;
  padding-top: 6rem; /* Added space for fixed navbar */
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.6s ease-out forwards;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff, #dbeafe);
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
  background-position: right center;
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
.select {
  padding: 0.5rem 1rem 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(203, 213, 225, 0.5);
  background: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.input {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(203, 213, 225, 0.5);
  background: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 200px;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Project views */
.grid {
  display: grid;
  gap: 1.5rem;
}

/* List view styles */
.border.rounded.p-4.mb-2 {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(203, 213, 225, 0.3) !important;
  transition: all 0.3s ease;
}

.border.rounded.p-4.mb-2:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: rgba(59, 130, 246, 0.3) !important;
}

.font-semibold {
  font-weight: 600;
  color: #1e293b;
}

.text-sm.text-gray-500 {
  font-size: 0.875rem;
  color: #64748b;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .p-6 {
    padding-top: 5rem; /* Slightly less padding on mobile */
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
  
  .grid {
    grid-template-columns: 1fr;
  }
}

/* Decorative elements */
.p-6::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
  animation: rainbow 8s linear infinite;
  background-size: 400% 100%;
  border-radius: 4px 4px 0 0;
}

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}


/* Replace your existing .grid styles with these */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Always 3 columns */
  gap: 1.5rem;
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on tablets */
  }
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr; /* 1 column on mobile */
  }
}
</style>