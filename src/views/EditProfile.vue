<template>
    <div class="profile-edit-container">
      <h1 class="text-xl font-bold mb-4">Edit Profile</h1>
      <form @submit.prevent="updateProfile" class="profile-edit-form">
        <!-- Display Name -->
        <div class="form-group">
          <label for="displayName">Display Name</label>
          <input
            v-model="updatedName"
            id="displayName"
            type="text"
            placeholder="Enter display name"
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
          />
        </div>
  
        <!-- Status -->
        <div class="form-group">
          <label for="status">Status</label>
          <input id="status" type="text" v-model="updatedStatus">
        </div>

        <div class="form-group">
          <label for="linkedin">LinkedIn</label>
          <input id="linkedin" type="text" v-model="updatedLinkedin">
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn">Update Profile</button>
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
      user: null, // Holds the current user data
      updatedName: '',
      updatedEmail: '',
      updatedLocation: '',
      updatedStatus: '',
      updatedLinkedin: '',
    };
  },
  methods: {
    async fetchUserProfile() {
      try {
        const userId = this.$route.params.id; // Retrieve userId from route
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          this.user = userDoc.data();
          this.updatedName = this.user.displayName || '';
          this.updatedEmail = this.user.email || '';
          this.updatedLocation = this.user.location || '';
          this.updatedStatus = this.user.status || '';
          this.updatedLinkedin = this.user.linkedin || '';
        } else {
          console.warn('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    },
    async updateProfile() {
      try {
        const userId = this.$route.params.id; // Assumes route param contains the userId
        const userDocRef = doc(db, 'users', userId);

        // Update Firestore with new profile data
        await updateDoc(userDocRef, {
          displayName: this.updatedName,
          email: this.updatedEmail,
          location: this.updatedLocation,
          status: this.updatedStatus,
          linkedin: this.updatedLinkedin,
        });

        // Update local state
        this.user.displayName = this.updatedName;
        this.user.email = this.updatedEmail;
        this.user.location = this.updatedLocation;
        this.user.status = this.updatedStatus;
        this.user.linkedin = this.updatedLinkedin;

        alert('Profile updated successfully!');
        this.$router.push(`/profile/${userId}`);
      } catch (error) {
        console.error('Error updating profile:', error.message);
        alert('Failed to update profile. Please try again.');
      }
    },
  },
  mounted() {
    this.fetchUserProfile();
  },
};
</script>

<style scoped>
.profile-edit-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input,
select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus,
select:focus {
  border-color: #3b82f6;
  outline: none;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #2563eb;
}
</style>
