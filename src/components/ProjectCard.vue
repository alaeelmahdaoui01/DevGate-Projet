<template>
  <div class="project-card">
    <div class="image-container">
      <img 
        :src="project.image || fallbackImage" 
        alt="Project Image" 
        class="project-image"
      />
      
      <div class="action-buttons">
        <a 
          v-if="project.githubLink"
          :href="project.githubLink"
          target="_blank"
          class="action-btn github-btn"
          @click.stop
          aria-label="View on GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        <button 
          v-if="currentUserId && Id === currentUserId" 
          @click.stop="editProject" 
          class="action-btn edit-btn"
          aria-label="Edit project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button 
          v-if="currentUserId && Id === currentUserId" 
          @click.stop="deleteProject" 
          class="action-btn delete-btn"
          aria-label="Delete project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="project-info">
      <h3 class="project-title">{{ project.title }}</h3>
      <a 
        v-if="project.githubLink"
        :href="project.githubLink"
        target="_blank"
        class="github-link"
      >
        View on GitHub
      </a>
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth';

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    Id: {  // This should be the project owner's user ID
      type: String,
      required: true,
    }
  },
  data() {
    return {
      fallbackImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc54qxejSTN5pyBOt5tMp1RgwfrlmW4ONHew&s',
      currentUserId: null
    };
  },
  created() {
    this.fetchCurrentUser();
  },
  methods: {
    async fetchCurrentUser() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        this.currentUserId = user.uid;
      }
    },
    editProject() {
      this.$emit('edit', this.project);
    },
    deleteProject() {
      this.$emit('delete', this.project.id);
    },
  }
};
</script>

<style scoped>
.project-card {
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: #f8fafc; /* subtle background for loading state */
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  background-color: #e2e8f0; /* loading background */
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.action-buttons {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease 0.1s;
}

.project-card:hover .action-buttons {
  opacity: 1;
}

.action-btn {
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  cursor: pointer;
  backdrop-filter: blur(2px);
}

.action-btn:hover {
  transform: scale(1.15);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.action-btn svg {
  width: 18px;
  height: 18px;
  stroke-width: 2.2px; /* make all icons equally bold */
}

.delete-btn {
  color: #ef4444;
}

.github-btn {
  width: 20px;
  height: 20px;
  color: #333;
}

.edit-btn {
  color: #3b82f6;
}

.project-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
  padding: 1.25rem 1rem 1rem;
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-card:hover .project-info {
  transform: translateY(0);
}

.project-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.3;
}

.github-link {
  color: #93c5fd;
  font-size: 0.8rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s ease;
  margin-top: 0.25rem;
}

.github-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .action-buttons {
    opacity: 1;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 999px;
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }

  .action-btn svg {
    width: 16px;
    height: 16px;
  }

  .project-info {
    padding: 1rem 0.75rem;
    background: rgba(0,0,0,0.75);
  }
  
  .project-title {
    font-size: 1rem;
  }
  
  .github-link {
    font-size: 0.75rem;
  }
}
</style>