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
    <!-- add more types if you have -->
  </select>
</div>

      <div class="timeline-container">
        
        <div 
  v-for="item in filteredTimelineItems" 
  :key="item.id" 
  class="timeline-item"
  @click="goToUserDashboard(item.userId)" 
  style="cursor: pointer;"
>

          <h2 class="timeline-item-title">
            {{ item.userName }} {{ item.type }} "{{ item.title }}"
          </h2>
          <p class="timeline-item-date">
            {{ formatDate(item.date) }}
          </p>
          <p class="timeline-item-description">
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
      selectedType: ""
    }
  },
  computed: {   // <---- computed is here, OUTSIDE of methods
    filteredTimelineItems() {
      if (!this.selectedType) {
        return this.timelineItems
      }
      return this.timelineItems.filter(item => item.type === this.selectedType)
    }
  },
  async mounted() {
    await this.fetchTimeline()
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

          if (data.userId) {
            const userRef = doc(db, 'users', data.userId)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              const userData = userSnap.data()
              userName = userData.displayName || userData.name || 'Unknown'
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
          })
        }

        this.timelineItems = items.sort((a, b) => b.date - a.date)

      } catch (error) {
        console.error('Error fetching timeline:', error)
      }
    },

    formatDate(date) {
      if (!(date instanceof Date)) return ''
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },

    goToUserDashboard(userId) {
      if (!userId) return
      this.$router.push(`/dashboard/${userId}`)
    }
  }
}

  </script>
  
  

  
  
  <style scoped>
.timeline-page {
  padding: 1.5rem;
  padding-top: 6rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff, #dbeafe);
}

/* Title */
.title {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  position: relative;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.title::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

/* Timeline Container */
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Timeline Item */
.timeline-item {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(203, 213, 225, 0.25);
  transition: all 0.3s ease;
}

.timeline-item:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.35);
}

/* Timeline Item Title */
.timeline-item-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

/* Timeline Item Date */
.timeline-item-date {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
}

/* Timeline Item Description */
.timeline-item-description {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .timeline-page {
    padding-top: 5rem;
  }
}
  </style>
  