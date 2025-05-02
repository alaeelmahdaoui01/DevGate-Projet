<template>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Skills</h1>
        <button @click="openAddModal" class="btn-primary">+ Add Skill</button>
      </div>
  
      <div v-if="!isLoading && skills.length === 0" class="text-center text-gray-500 mt-8">
        No skills found. Click "+ Add Skill" to add one!
      </div>
      <div v-else>
        <div
          v-for="skill in skills"
          :key="skill.id"
          class="project-item"
        >
          <div class="project-content">
            <h3 class="project-title">{{ skill.name }}</h3>
            <p class="project-description">{{ skill.description }}</p>
            <div class="project-meta">
              <div v-if="skill.level" class="progress-container">
                <div class="progress-label">{{ skill.level }} ({{ getPercentage(skill.level) }}%)</div>
                <div class="progress-bar">
                    <div
                    class="progress-fill"
                    :style="{ width: getPercentage(skill.level) + '%' }"
                    :class="{
                        'bg-blue-500': getPercentage(skill.level) <= 33,
                        'bg-green-500': getPercentage(skill.level) > 33 && getPercentage(skill.level) <= 66,
                        'bg-purple-500': getPercentage(skill.level) > 66
                    }"
                    ></div>
                </div>
               </div>

            </div>
          </div>
          <div class="project-actions">
            <button class="btn-sm" @click="editSkill(skill)">Edit</button>
            <button @click="deleteSkill(skill.id)" class="action-btn delete-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      <div v-if="showModal" class="modal-overlay">
        <CreateSkillModal @close="closeModal" @saved="onSkillSaved" />
      </div>
  
      <div v-if="showEditModal" class="modal-overlay">
        <EditSkillModal 
          :selectedSkill="selectedSkill"
          @close="closeModal"
          @saved="onSkillSaved"
        />
      </div>
  
      <div v-if="isLoading">Loading...</div>
    </div>
  </template>
  
  <script>
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '@/Firebase/config';
  
  import CreateSkillModal from '@/components/CreateSkillModal.vue';
  import EditSkillModal from '@/components/EditSkillModal.vue';
  import { deleteSkill } from '@/Firebase/Firestore/deleteSkill';
  
  export default {
    name: 'SkillsView',
    components: {
      CreateSkillModal,
      EditSkillModal,
    },
    data() {
      return {
        isLoading: false,
        skills: [],
        showModal: false,
        showEditModal: false,
        selectedSkill: null,
        userId: '',
      };
    },
    methods: {
      async fetchSkills() {
        this.isLoading = true;
        try {
          const userDocRef = doc(db, 'users', this.id);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const userSkills = userData.skills || [];
            const fetchedSkills = [];

            this.userId = userDocSnap.id;
  
            for (const skill of userSkills) {
              const skillDoc = await getDoc(doc(db, 'skills', skill.id));
              if (skillDoc.exists()) {
                fetchedSkills.push({ id: skill.id, ...skillDoc.data() });
              }
            }
  
            this.skills = fetchedSkills;
          }
        } catch (error) {
          console.error('Error fetching skills:', error);
        }
        this.isLoading = false;
      },
      onSkillSaved() {
        this.fetchSkills();
        this.showModal = false;
        this.showEditModal = false;
      },
      openAddModal() {
        this.selectedSkill = null;
        this.showModal = true;
        this.showEditModal = false;
      },
      editSkill(skill) {
        this.showModal = false;
        this.showEditModal = true;
        this.selectedSkill = skill;
      },
      getPercentage(level) {
      const levelMapping = {
        Beginner: 16.5,
        Intermediate: 50,
        Advanced: 83.5,
      };
      return levelMapping[level] || 0; // Default to 0% if level is invalid
    },
      async deleteSkill(id) {
        if (confirm('Are you sure you want to delete this skill?')) {
          try {
            await deleteSkill(id, this.userId);
            this.fetchSkills();
          } catch (error) {
            alert('Error deleting skill');
          }
        }
      },
      closeModal() {
        this.showModal = false;
        this.showEditModal = false;
      },
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    watch: {
      id: {
        immediate: true,
        handler() {
          this.fetchSkills();
        },
      },
    },
  };
  </script>


<style scoped>
  /* Base container styles */
  .p-6 {
    padding: 1.5rem;
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
    top: 0;
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
  transition: width 0.4s ease, background-color 0.3s ease;
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

</style>