<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="form-container">
        <h2> Edit Project </h2>
        
        <div class="form-group">
          <label>Title:</label>
          <input v-model="title" required class="input" />
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="description" rows="3" required class="input"></textarea>
        </div>
        
        <div class="form-group">
          <label>Stack Used (comma-separated)</label>
          <input 
            v-model="stackInput" 
            placeholder="e.g., Vue, Firebase, Tailwind" 
            class="input" 
          />
        </div>
        
        <div class="form-group">
          <label>GitHub Link</label>
          <input v-model="githubLink" type="url" class="input" />
        </div>


        <div class="form-group">
          <label for="file-upload" class="custom-file-label">
            <span>Choose File</span>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              @change="handleFileChange" 
              class="file-input"
            />
          </label>
          <p v-if="imageFileName" class="file-name">{{ imageFileName }}</p>
        </div>

        <div class="button-group">
          <button @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button @click="updateProject" class="btn-primary">
            Update Project
          </button>
        </div>
        
        <p v-if="message" class="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth'
import { editProject } from '@/Firebase/Firestore/editProject'
import { db } from '@/Firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getUser, waitForAuthInit } from '@/Firebase/Authentification/getUser'

export default {
  name: "EditProjectModal",
  props: {
    selectedProject: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      title: "",
      description: "",
      stackInput: "",
      githubLink: "",
      imageFile: null,
      message: "",
      imageBase64: "",
      user: "",
      imageFileName: ""
    }
  },

  watch: {
    selectedProject: {
      immediate: true,
      handler(project) {
        if (project) {
          this.title = project.title || ""
          this.description = project.description || ""
          this.stackInput = (project.stack || []).join(", ")
          this.githubLink = project.githubLink || ""
          this.imageBase64 = project.image || ""
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
      this.stackInput = ""
      this.githubLink = ""
      this.message = ""
    },

    async updateProject() {
      this.message = ""

      try {
        const updatedData = {
          title: this.title || "Untitled Project",
          description: this.description,
          stack: this.stackInput.split(',').map(s => s.trim()),
          githubLink: this.githubLink,
          image: this.imageBase64
        }

        // 1. Update the project
        await editProject(this.selectedProject.id, updatedData, this.user.uid)

        // 2. Add to timeline ✨
        await this.addEditToTimeline()

        this.message = "Project updated successfully!"
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error(err)
        this.message = "Error: " + err.message
      }
    },

    async addEditToTimeline() {
try {
  const auth = getAuth()
  const currentUser = auth.currentUser
  const userId = this.selectedProject.userId || (currentUser ? currentUser.uid : null)

  if (!userId) {
    console.error('No userId found for timeline entry')
    return
  }

  const timelineRef = collection(db, 'timeline')
  await addDoc(timelineRef, {
    userId: userId,
    type: 'Edited Project',
    title: this.title,
    description: this.description,
    date: serverTimestamp()
  })
} catch (err) {
  console.error('Error adding to timeline:', err)
}
},


handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      this.imageFileName = file.name; // Store the file name
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result; // Convert file to Base64
      };
      reader.readAsDataURL(file);
    }

    
  },
  },
  


  async created() {
  try {
    await waitForAuthInit()
    this.user = getUser()

    if (!this.user) {
      console.warn('User not authenticated')
      this.$router.push('/login')
    }
  } catch (err) {
    console.error('Auth error:', err)
  }
},
mounted() {
  console.log("Selected project:", this.selectedProject)
}
}
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}


/* Hide the default file input */
.file-input {
  display: none;
}

/* Custom file label */
.custom-file-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: black;
  font-weight: bold;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-align: center;
}

.custom-file-label span{
  color: white; 
  font-weight : bold 
}

.custom-file-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

/* Display the selected file name */
.file-name {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  text-align: center;
} 
</style>