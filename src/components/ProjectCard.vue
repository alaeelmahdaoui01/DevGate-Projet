<template>
  <div class="project-card">
    <div class="image-container">
      <img 
        :src="project.image || fallbackImage" 
        alt="Project Image" 
        class="project-image"
      />
      
      <!-- Edit/Delete buttons overlay -->
      <div class="action-buttons">
        <button @click.stop="editProject" class="edit-btn">
          ✏️
        </button>
        <button @click.stop="deleteProject" class="delete-btn">
          🗑
        </button>
      </div>
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
      fallbackImage: 'https://via.placeholder.com/400x300?text=No+Image',
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
  aspect-ratio: 1/1; /* Makes card square */
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-container:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.action-buttons {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-container:hover .action-buttons {
  opacity: 1;
}

.edit-btn, .delete-btn {
  background: white;
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.edit-btn:hover, .delete-btn:hover {
  transform: scale(1.1);
}

.delete-btn {
  color: #ef4444;
}
</style>