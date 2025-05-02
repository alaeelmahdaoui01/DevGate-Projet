<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="form-container">
          <h2>Edit Skill</h2>
  
          <div class="form-group">
            <label>Skill:</label>
            <input v-model="name" required class="input" placeholder="Enter skill (e.g., React)" />
          </div>
  
          <div class="form-group">
            <label>Level:</label>
            <select v-model="level" required class="input">
              <option disabled value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
  
          <div class="form-group">
            <label>Date Acquired:</label>
            <input v-model="date" type="date" required class="input" />
          </div>
  
          <div class="form-group">
            <label>Description:</label>
            <textarea
              v-model="description"
              class="input"
              rows="4"
              placeholder="Describe how you improved this skill and how you practice it."
            ></textarea>
          </div>
  
          <div class="button-group">
            <button @click="$emit('close')" class="btn-secondary">Cancel</button>
            <button @click="updateSkill" class="btn-primary">Save Changes</button>
          </div>
  
          <p v-if="message" class="message">{{ message }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '@/Firebase/config';
  import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
  import { getUser, waitForAuthInit } from '@/Firebase/Authentification/getUser';
  import { editSkill } from '@/Firebase/Firestore/editSkill';
  
  export default {
    name: "EditSkillsModal",
    props: {
      selectedSkill: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        name: "",
        level: "",
        date: Date(),
        description: "",
        message: "",
        user: null,
      };
    },
    watch: {
      selectedSkill: {
        immediate: true,
        handler(skill) {
          if (skill) {
            this.name = skill.name;
            this.level = skill.level;
            this.date = skill.date;
            this.description = skill.description;
          } else {
            this.resetForm();
          }
        },
      },
    },
    methods: {
      resetForm() {
        this.name = "";
        this.level = "";
        this.date = Date();
        this.description = "";
        this.message = "";
      },
      async updateSkill() {
        this.message = "";
  
        if (!this.name || !this.level || !this.date || !this.description) {
          this.message = "All fields are required.";
          return;
        }
  
        try {
          const updatedData = {
            name: this.name,
            level: this.level,
            date: this.date,
            description: this.description,
          };
  
          // Pass userId to the editSkill function
          await editSkill(this.selectedSkill.id, updatedData, this.user.uid);
  
          // Add a timeline entry
          await addDoc(collection(db, "timeline"), {
            userId: this.user.uid,
            type: "edited skill",
            title: updatedData.name,
            description: "Updated an existing skill.",
            date: serverTimestamp(),
          });
  
          this.message = "Skill updated successfully!";
          this.$emit("saved");
          this.$emit("close");
        } catch (err) {
          console.error("Error updating skill:", err);
          this.message = "Error: " + err.message;
        }
      },
    },
    async created() {
      try {
        await waitForAuthInit();
        this.user = getUser();
  
        if (!this.user) {
          console.warn("User not authenticated");
          this.$router.push("/login");
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    },
    mounted() {
      console.log("Selected skill:", this.selectedSkill);
    },
  };
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
appearance: none;
width: 100%;
height: 6px;
background: #e2e8f0;
border-radius: 5px;
outline: none;
transition: background 0.3s;
}

.slider::-webkit-slider-thumb {
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