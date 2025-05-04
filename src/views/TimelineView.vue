<template>
  <div class="timeline-page">
    <h1 class="title">Timeline</h1>
    <div class="filter-container">
      <label for="filter">Filter by Action:</label>
      <select id="filter" v-model="selectedType" class="filter-select">
        <option value="">All</option>
        <option value="Created Project">Created Project</option>
        <option value="Edited Project">Edited Project</option>
        <option value="added objective">Added Objective</option>
        <option value="edited objective">Edited Objective</option>
        <option value="added skill">Added Skill</option>
        <option value="edited skill">Edited Skill</option>
      </select>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <div v-else class="timeline-container">
      <div
        v-for="item in filteredTimelineItems"
        :key="item.id"
        class="timeline-item"
        @click="goToUserDashboard(item.userId)"
      >
        <div class="user-info">
          <img 
            :src="item.image" 
            alt="User Avatar" 
            class="user-avatar"
            @error="handleImageError"
            v-if="item.image"
          />
          <img 
            src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg" 
            alt="Default User Avatar" 
            class="user-avatar"
            v-else
          />
          <div>
            <h2 class="timeline-item-title">
              {{ item.userName }} <span class="action-text">{{ item.type }}</span> "{{ item.title }}"
            </h2>
            <p class="timeline-item-date">
              {{ formatDate(item.date) }}
            </p>
          </div>
        </div>
        <p v-if="item.description" class="timeline-item-description">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/Firebase/config'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

export default {
  name: 'TimelinePage',
  data() {
    return {
      timelineItems: [],
      selectedType: "",
      loading: true
    }
  },
  computed: {
    filteredTimelineItems() {
      if (!this.selectedType) {
        return this.timelineItems
      }
      return this.timelineItems.filter(item => item.type === this.selectedType)
    }
  },
  async mounted() {
    await this.fetchTimeline()
    this.loading = false
  },
  methods: {
    async fetchTimeline() {
      try {
        const timelineRef = collection(db, 'timeline')
        const querySnapshot = await getDocs(timelineRef)

        const items = []

        for (const timelineDoc of querySnapshot.docs) {
          const data = timelineDoc.data()

          let userName = 'Unknown'
          let userImage = '/default-avatar.png'

          if (data.userId) {
            const userRef = doc(db, 'users', data.userId)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              const userData = userSnap.data()
              userName = userData.displayName || userData.name || 'Unknown'
              userImage = userData.photoURL || userImage
            }
          }

          items.push({
            id: timelineDoc.id,
            userId: data.userId,
            userName: userName,
            type: data.type,
            title: data.title,
            description: data.description || "",
            date: data.date ? data.date.toDate() : new Date(),
            image: userImage,
          })
        }

        this.timelineItems = items.sort((a, b) => b.date - a.date)

      } catch (error) {
        console.error('Error fetching timeline:', error)
        this.loading = false
      }
    },

    formatDate(date) {
      if (!(date instanceof Date)) return ''
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    goToUserDashboard(userId) {
      if (!userId) return
      this.$router.push(`/dashboard/${userId}`)
    },
    
    handleImageError(e) {
      e.target.src = 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg';
    }
  }
}
</script>

<style scoped>
.timeline-page {
  padding: 2rem;
  padding-top: 6rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;
}

.title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

.filter-container {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.filter-container label {
  font-weight: 500;
  color: #334155;
}

.filter-select {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
}

.filter-select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-item {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.timeline-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #93c5fd;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.timeline-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.action-text {
  color: #3b82f6;
  font-weight: 500;
}

.timeline-item-date {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.timeline-item-description {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.6;
  padding-top: 0.5rem;
  border-top: 1px solid #f1f5f9;
  margin-top: 1rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .timeline-page {
    padding: 1.5rem;
    padding-top: 5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .timeline-item {
    padding: 1.25rem;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
  }
}
</style>