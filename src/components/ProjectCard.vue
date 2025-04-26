<template>
  <div class="relative rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-all group">
    <img :src="project.image" alt="Project Image" class="w-full h-48 object-cover" />
    
    <!-- Edit/Delete buttons overlay -->
    <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button 
        @click.stop="editProject" 
        class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 mr-1"
      >
        ✏️
      </button>
      <button 
        @click.stop="deleteProject" 
        class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-red-600"
      >
        🗑
      </button>
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
/* Optional: Add some transition effects */
.transition-all {
  transition: all 0.3s ease;
}
</style>