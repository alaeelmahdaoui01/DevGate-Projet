<template>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Objectives</h1>
        <button v-if="id === currentUserId" @click="openAddModal" class="btn-primary">+ Add Objective</button>
      </div>

      <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

      <div v-else-if="!isLoading && objectives.length === 0" class="empty-state">
      <div class="empty-icon">🎯</div>
      <p>No objectives found.</p> <p v-if="id === currentUserId">Add your first objective to get started!</p>
      <button @click="openAddModal" class="btn-primary" v-if="id === currentUserId">Add objective</button>
    </div>
    
        <div v-else>
            <div
                v-for="objective in objectives"
                :key="objective.id"
                class="project-item"
            >
                <div class="project-content">
                <h3 class="project-title">{{ objective.title }}</h3>
                <p class="project-description">{{ objective.description }}</p>
                <div class="project-meta">
                    <p class="project-stack">
                    Status: <span class="status-badge" :class="'status-' + objective.status.toLowerCase().replace(' ', '-')">
                        {{ objective.status }}
                    </span>
                    </p>
                    <!-- Progress bar container -->
                    <div v-if="objective.progress" class="progress-container">
                    <div class="progress-label">{{ objective.progress }}%</div>
                    <div class="progress-bar">
                        <div 
                        class="progress-fill" 
                        :style="{ width: objective.progress + '%' }"
                        :class="{
                            'bg-blue-500': objective.progress < 30,
                            'bg-green-500': objective.progress >= 30 && objective.progress < 70,
                            'bg-purple-500': objective.progress >= 70
                        }"
                        ></div>
                    </div>
                    </div>
                </div>
                </div>
                <div class="project-actions">
                  
                <button v-if="id === currentUserId" class="btn-sm" @click="editObjective(objective)">Track progress</button>
                <button v-if="id === currentUserId" @click="deleteObjective(objective.id)" class="action-btn delete-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
                </div>
            </div>
            </div>
  
      <div v-if="showModal" class="modal-overlay">
        <CreateObjectiveModal @close="closeModal" @saved="onObjectiveSaved" />
      </div>
  
      <div v-if="showEditModal" class="modal-overlay">
        <EditObjectiveModal 
          :selectedObjective="selectedObjective"
          @close="closeModal"
          @saved="onObjectiveSaved"
        />
      </div>
      
    </div>

  </template>
  

  
  <script>
  import { doc, getDoc } from 'firebase/firestore'
  import { db } from '@/Firebase/config'
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import CreateObjectiveModal from '@/components/createObjective.vue';
  import EditObjectiveModal from '@/components/EditObjective.vue';
  import { deleteObjective } from '@/Firebase/Firestore/deleteObjective';
  
  export default {
    name: 'ObjectivesPage',
    components: {
      CreateObjectiveModal,
      EditObjectiveModal
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        isLoading: false,
        objectives: [],
        showModal: false,
        showEditModal: false,
        selectedObjective: null,
        currentUserId: null,
        userId: '',
      }
    },
    created() {
      this.setupAuthListener();
    },
    methods: {
      setupAuthListener() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.currentUserId = user.uid;
            // Now that we have the current user, fetch objectives
            this.fetchObjectives();
          } else {
            this.currentUserId = null;
          }
        });
      },
      onObjectiveSaved() {
        this.fetchObjectives();
        this.showModal = false;
        this.showEditModal = false;
      },
      openAddModal() {
        this.selectedObjective = null;
        this.showModal = true;
        this.showEditModal = false;
      },
      editObjective(objective) {
        this.showModal = false;
        this.showEditModal = true;
        this.selectedObjective = objective;
      },
      async deleteObjective(id) {
        if (confirm('Are you sure you want to delete this objective?')) {
          try {
            await deleteObjective(id, this.userId);
            this.fetchObjectives();
          } catch (error) {
            alert('Error deleting objective');
          }
        }
      },
      closeModal() {
        this.showModal = false;
        this.showEditModal = false;
      },
      async fetchObjectives() {
        this.isLoading = true;
        try {
          const userDocRef = doc(db, 'users', this.id);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const userObjectives = userData.objectives || [];
            const fetchedObjectives = [];
  
            this.userId = userDocSnap.id;
  
            for (const obj of userObjectives) {
              const objDoc = await getDoc(doc(db, 'objectives', obj.id));
              if (objDoc.exists()) {
                fetchedObjectives.push({ id: obj.id, ...objDoc.data() });
              }
            }
            fetchedObjectives.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
            this.objectives = fetchedObjectives;
          }
        } catch (error) {
          console.error("Error fetching objectives:", error);
        }
        this.isLoading = false;
      }
    },
    watch: {
      id: {
        immediate: true,
        handler() {
          if (this.currentUserId) {
            this.fetchObjectives();
          }
        }
      }
    }
  }
  </script>
  
  
  <style scoped>
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
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 60px;
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

  .action-btn {
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  cursor: pointer;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.delete-btn {
  color: #ef4444;
}

/* Progress bar styles */
.progress-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.5rem;
}

.progress-label {
  font-size: 0.75rem;
  color: #64748b;
  min-width: 40px;
  text-align: right;
}

.progress-bar {
  flex-grow: 1;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

/* Color classes for progress (already defined in template) */
.bg-blue-500 {   /*red*/
  background-color: #ef4444;
}

.bg-green-500 {   /* orange */
  background-color: #f59e0b;
}

.bg-purple-500 {  /* green  */
  background-color: #10b981;
}

/* Enhanced project item styling */
.project-item {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(203, 213, 225, 0.25);
  transition: all 0.3s ease;
  padding: 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.project-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: rgba(59, 130, 246, 0.35);
}

.project-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.project-description {
  color: #475569;
  margin-bottom: 0.75rem;
  line-height: 1.5;
  font-size: 0.9375rem;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.project-stack {
  font-size: 0.8125rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Add to your styles */
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-not-started {
  background-color: #f1f5f9;
  color: #64748b;
}

.status-in-progress {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-completed {
  background-color: #dcfce7;
  color: #166534;
}

/* Update your empty state styling */
.text-center.text-gray-500.mt-8 {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  margin-top: 2rem;
  border: 1px dashed #cbd5e1;
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