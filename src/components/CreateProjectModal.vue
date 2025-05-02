<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="form-container">
        <h2>{{ selectedProject ? 'Edit Project' : 'Create Project' }}</h2>
        
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
          <label>Project Image</label>
          <input type="file" accept="image/*" @change="handleFileChange" />
        </div>

        <div class="button-group">
          <button @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button @click="createProject" class="btn-primary">
            {{ selectedProject ? 'Update Project' : 'Create Project' }}
          </button>
        </div>
        
        <p v-if="message" class="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, doc, addDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore'
import { db } from '@/Firebase/config.js'
import { getUser, waitForAuthInit } from '@/Firebase/Authentification/getUser'



export default {
  name: "ProjectModal",
  props: {
    selectedProject: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      user: "",
      title: "",
      description: "",
      stackInput: "",
      githubLink: "",
      message: "",
      imageFile: null,
      imageBase64:""
    }
  },

 
  async created() {
    try {
      await waitForAuthInit()
      this.user = getUser()

      if (!this.user) {
        console.warn('User not authenticated')
        this.$router.push('/login')
      }
    } catch (error) {
      console.error('Error in ProjectModal created hook:', error)
    }
  },

  methods: {
    resetForm() {
      this.title = ""
      this.description = ""
      this.stackInput = ""
      this.githubLink = ""
      this.message = ""
      this.stackInput = ""
    },

    async createProject() {
      this.message = ""

      try {
        const user = getUser()
        if (!user) {
          this.message = "You must be logged in."
          return
        }

        const userRef = doc(db, "users", user.uid)


        let imageUrl = ""
          
          const project = {
            title: this.title || "Untitled Project",
            description: this.description,
            stack: this.stackInput.split(',').map(s => s.trim()),
            githubLink: this.githubLink,
            email: user.email,
            createdBy: user.uid,
            createdAt: serverTimestamp(),
            image: this.imageBase64 // ← store image directly as Base64
          }

        if (this.selectedProject) {
          // Update existing project
          await updateDoc(doc(db, "projects", this.selectedProject.id), project)
          this.message = "Project updated successfully!"
        } else {
          // Create new project
          const projectRef = await addDoc(collection(db, "projects"), project)
          
          await updateDoc(userRef, {
            projects: arrayUnion({
              id: projectRef.id,
              title: project.title,
              stack: project.stack,
              githubLink: project.githubLink,
              //createdAt: serverTimestamp(),
              imageUrl,
            })
          })
          await addDoc(collection(db, "timeline"), {
            userId: user.uid,
            type: "Created Project", // Type indicates new project creation
            title: project.title,
            description: project.description,
            date: serverTimestamp(), // Use serverTimestamp for consistency
          });
          this.message = "Project created successfully!"
        }

        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error(err)
        this.message = "Error: " + err.message
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      
      reader.onload = () => {
          this.imageBase64 = reader.result // This is the Base64 string
      }
      if (file) {
          reader.readAsDataURL(file)
      }
    }
    
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
</style>