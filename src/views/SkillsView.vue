<template>
  <div class="skills-container">
    <div class="skills-header">
      <h1 class="skills-title">Skills</h1>
      <button v-if="id === currentUserId" @click="openAddModal" class="add-skill-btn">
        <span>+ Add Skill</span>
      </button>
    </div>
  
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="!isLoading && skills.length === 0" class="empty-state">
      <div class="empty-icon">🧑‍💻</div>
      <p>No skills found.</p> <p v-if="id === currentUserId">Add your first skill to get started!</p>
      <button @click="openAddModal" class="btn-primary" v-if="id === currentUserId">Add skill</button>
    </div>
    
    <div v-else class="skills-grid">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="skill-card"
      >
        <div class="skill-content">
          <div class="skill-header">
            <h3 class="skill-name">{{ skill.name }}</h3>
            <div class="skill-actions">
              <button class="edit-btn" @click.stop="editSkill(skill)" v-if="id === currentUserId">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="delete-btn" @click.stop="deleteSkill(skill.id)" v-if="id === currentUserId">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <p class="skill-description" v-if="skill.description">{{ skill.description }}</p>
          
          <div class="skill-progress">
            <div class="progress-info">
              <span class="progress-level">{{ skill.level }}</span>
              <span class="progress-percent">{{ getPercentage(skill.level) }}%</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: getPercentage(skill.level) + '%' }"
                :class="progressFillClass(skill.level)"
              ></div>
            </div>
          </div>
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
  
    
  </div>
</template>
  
  <script>
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '@/Firebase/config';
  import { getAuth } from 'firebase/auth';

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
        currentUserId: null,
      };
    },
    methods: {
      async fetchCurrentUser() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        this.currentUserId = user.uid;
      }
    },
      progressFillClass(level) {
        const percent = this.getPercentage(level);
        if (percent == 30) return 'progress-beginner';
        if (percent == 50) return 'progress-intermediate';
        if (percent == 80) return 'progress-advanced';
        return 'progress-expert';
      },
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
        Beginner: 30,
        Intermediate: 50,
        Advanced: 80,
        Expert: 100
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
    created() {
    this.fetchCurrentUser(); // Fetch current user ID when component is created
  },
  };
  </script>


<style scoped>
/* Base Container */
.skills-container {
  padding: 1.5rem;
  padding-top: 6rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff, #dbeafe);
}

/* Header Section */
.skills-header {
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

.skills-title {
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

/* Buttons */
.add-skill-btn {
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

.add-skill-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
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

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

/* Skill Cards */
.skill-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  padding: 1.5rem;
  border: 1px solid rgba(203, 213, 225, 0.25);
}

.skill-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  border-color: rgba(59, 130, 246, 0.35);
}

.skill-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.skill-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.skill-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  color: #3b82f6;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  transform: scale(1.1);
}

.skill-description {
  color: #475569;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

/* Progress Bar */
.skill-progress {
  margin-top: auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.progress-level {
  color: #334155;
  font-weight: 500;
}

.progress-percent {
  color: #64748b;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

/* Progress Colors */
.progress-beginner {
  background: linear-gradient(to right, #ef4444, #f97316);
}

.progress-intermediate {
  background: linear-gradient(to right, #f59e0b, #eab308);
}

.progress-advanced {
  background: linear-gradient(to right, #10b981, #3b82f6);
}

.progress-expert {
  background: linear-gradient(to right, #10b981, #22c55e);
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
@media (max-width: 768px) {
  .skills-container {
    padding-top: 5rem;
  }
  
  .skills-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .add-skill-btn {
    width: 100%;
    text-align: center;
  }
}

</style>