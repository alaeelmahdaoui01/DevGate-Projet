<template>
  <div class="profile-edit-container">
    <div class="edit-header">
      <h1 class="edit-title">Edit Profile</h1>
    </div>
    
    <form @submit.prevent="updateProfile" class="profile-edit-form">
      <!-- Display Name -->
      <div class="form-group">
        <label for="displayName">Display Name</label>
        <input
          v-model="updatedName"
          id="displayName"
          type="text"
          placeholder="Enter display name"
          class="form-input"
        />
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="updatedEmail"
          id="email"
          type="email"
          placeholder="Enter email"
          class="form-input"
        />
      </div>

      <!-- Location -->
      <div class="form-group">
        <label for="location">Location</label>
        <input
          v-model="updatedLocation"
          id="location"
          type="text"
          placeholder="Enter location"
          class="form-input"
        />
      </div>

      <!-- Status -->
      <div class="form-group">
        <label for="status">Status</label>
        <input 
          id="status" 
          type="text" 
          v-model="updatedStatus"
          placeholder="E.g. Software Engineer"
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label for="linkedin">LinkedIn</label>
        <input 
          id="linkedin" 
          type="text" 
          v-model="updatedLinkedin"
          placeholder="https://linkedin.com/in/yourprofile"
          class="form-input"
        >
      </div>

      <!-- Profile Picture -->
      <div class="form-group">
        <label>Profile Picture</label>
        <div class="photo-upload">
          <img 
            :src="updatedPhotoBase64 || defaultAvatar" 
            alt="Profile" 
            class="photo-preview"
          />
          <div class="photo-actions">
            <label for="photoInput" class="upload-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <line x1="16" y1="5" x2="22" y2="5"></line>
                <line x1="19" y1="2" x2="19" y2="8"></line>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              Change
            </label>
            <button 
              v-if="updatedPhotoBase64 && updatedPhotoBase64 !== defaultAvatar" 
              @click.prevent="removePhoto" 
              class="remove-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Remove
            </button>
            <input 
              id="photoInput" 
              type="file" 
              accept="image/*" 
              @change="handlePhotoUpload" 
              class="hidden"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button type="submit" class="submit-btn">
          Update Profile
        </button>
        <button 
          type="button" 
          @click="close" 
          class="cancel-btn"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>



<script>
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/Firebase/config';

export default {
name: 'EditProfile',
data() {
  return {
    user: null,
    updatedName: '',
    updatedEmail: '',
    updatedLocation: '',
    updatedStatus: '',
    updatedLinkedin: '',
    updatedPhotoBase64: '',
    defaultAvatar: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg',
    originalPhoto: ''
  };
},
methods: {
  async fetchUserProfile() {
    try {
      const userId = this.$route.params.id;
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        this.user = userDoc.data();
        this.updatedName = this.user.displayName || '';
        this.updatedEmail = this.user.email || '';
        this.updatedLocation = this.user.location || '';
        this.updatedStatus = this.user.status || '';
        this.updatedLinkedin = this.user.linkedin || '';
        this.updatedPhotoBase64 = this.user.photoURL || this.defaultAvatar;
        this.originalPhoto = this.user.photoURL || this.defaultAvatar;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    }
  },

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.updatedPhotoBase64 = reader.result;
    };
    reader.readAsDataURL(file);
  },

  removePhoto() {
    this.updatedPhotoBase64 = this.defaultAvatar;
  },

  close() {
    this.$emit('close');
  },

  async updateProfile() {
    try {
      const userId = this.$route.params.id;
      const userDocRef = doc(db, 'users', userId);

      const updatedProfile = {
      displayName: this.updatedName,
      email: this.updatedEmail,
      location: this.updatedLocation,
      status: this.updatedStatus,
      linkedin: this.updatedLinkedin,
      photoURL: this.updatedPhotoBase64 === this.defaultAvatar ? '' : this.updatedPhotoBase64,
    };

      await updateDoc(userDocRef, updatedProfile);

      this.$router.push(`/dashboard/${userId}`);
      this.$emit('save',updatedProfile );
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please try again.');
    }
  }
},
mounted() {
  this.fetchUserProfile();
},
};
</script>

<style scoped>
.profile-edit-container {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.edit-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(203, 213, 225, 0.5);
}

.edit-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  position: relative;
  text-align:left
}

.edit-title::after {
  content: '';
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

.profile-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #334155;
  font-size: 0.9375rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.photo-upload {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.photo-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.photo-actions {
  display: flex;
  gap: 0.75rem;
}

.upload-btn, .remove-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.upload-btn:hover {
  background: rgba(59, 130, 246, 0.2);
}

.remove-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.hidden {
  display: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(203, 213, 225, 0.5);
}

.submit-btn {
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #64748b;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: 1px solid rgba(203, 213, 225, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: rgba(203, 213, 225, 0.3);
}

@media (max-width: 640px) {
  .profile-edit-container {
    padding: 1.5rem;
  }
  
  .photo-upload {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-btn, .cancel-btn {
    width: 100%;
  }
}


</style>
