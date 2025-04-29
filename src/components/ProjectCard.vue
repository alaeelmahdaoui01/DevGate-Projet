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
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        <button @click.stop="editProject" class="action-btn edit-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button @click.stop="deleteProject" class="action-btn delete-btn">
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
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fallbackImage: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
    };
  },
  methods: {
    editProject() {
      this.$emit('edit', this.project);
    },
    deleteProject() {
      this.$emit('delete', this.project.id);
    },
  },
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
  transition: opacity 0.2s ease;
}

.project-card:hover .action-buttons {
  opacity: 1;
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

.github-btn {
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
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 1rem;
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
}

.github-link {
  color: #58a6ff;
  font-size: 0.8rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s ease;
}

.github-link:hover {
  color: #1f6feb;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .action-buttons {
    opacity: 1; /* Always show buttons on mobile */
    background: rgba(255, 255, 255, 0.7);
    border-radius: 999px;
    padding: 0.25rem;
  }
  
  .project-info {
    transform: translateY(0);
    background: rgba(0,0,0,0.7);
  }
}
</style>