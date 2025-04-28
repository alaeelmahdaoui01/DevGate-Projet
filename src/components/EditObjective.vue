<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="form-container">
        <h2>Progress Tracking</h2>

        <div class="form-group">
            <label>Progress: {{ progress }}%</label>
            <input type="range" v-model="progress" min="0" max="100" class="slider" />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="description" rows="3" required class="input"></textarea>
        </div>

        <div class="button-group">
          <button @click="$emit('close')" class="btn-secondary">Cancel</button>
          <button @click="updateObjective" class="btn-primary">Update Progress</button>
        </div>

        <p v-if="message" class="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { editObjective } from '@/Firebase/Firestore/editObjective' // Adjust if needed

export default {
  name: "EditObjModal",
  props: {
    selectedObjective: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      title: "",
      description: "",
      status: "",
      progress: 0,
      message: "",
    }
  },
  watch: {
    selectedObjective: {
      immediate: true,
      handler(objective) {
        if (objective) {
          this.title = objective.title || ""
          this.description = objective.description || ""
          this.status = objective.status || ""
          this.progress = objective.progress || 0 // corrected "project" to "objective"
        } else {
          this.resetForm()
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.title = ""
      this.description = ""
      this.status = ""
      this.progress = 0
      this.message = ""
    },
    async updateObjective() {
      this.message = ""

      try {
        const updatedData = {
          title: this.title,
          description: this.description,
          status: this.status,
          progress: this.progress,
        }

        await editObjective(this.selectedObjective.id, updatedData)

        this.message = "Objective updated successfully!"
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error(err)
        this.message = "Error: " + err.message
      }
    },
  },
  mounted() {
    console.log("Selected objective:", this.selectedObjective)
  }
}
</script>

<style scoped>
/* Styles kept the same, no change needed */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-container h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #475569;
}

.input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-primary {
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  border: 1px solid #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #f8fafc;
}

.message {
  text-align: center;
  margin-top: 1rem;
  color: #3b82f6;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(5px);
  }
}

@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 5px;
  outline: none;
  transition: background 0.3s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}
</style>
