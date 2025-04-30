<template>
    <div>
      <h2>Projects per Month</h2>
      <ChartComponent :chartData="projectData" :chartOptions="options" />
    </div>
  </template>
  
  <script>
  import ChartComponent from '@/components/ChartComponent.vue'
  import { collection, query, where, getDocs } from 'firebase/firestore'
  import { db } from '@/Firebase/config.js'
  import { getUser, waitForAuthInit } from '@/Firebase/Authentification/getUser'
  
  export default {
    components: { ChartComponent },
    data() {
      return {
        projectData: {
          labels: [],
          datasets: []
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Projects Created per Month' }
          }
        }
      }
    },
    async mounted() {
      await waitForAuthInit()
      const user = getUser()
      if (!user) return
  
      const q = query(collection(db, "projects"), where("createdBy", "==", user.uid))
      const snapshot = await getDocs(q)
  
      const counts = {}
      snapshot.forEach(doc => {
        const date = doc.data().createdAt?.toDate()
        if (date) {
          const key = date.toLocaleString('default', { month: 'short', year: 'numeric' })
          counts[key] = (counts[key] || 0) + 1
        }
      })
  
      const sortedLabels = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b))
      this.projectData = {
        labels: sortedLabels,
        datasets: [
          {
            label: 'Projects',
            data: sortedLabels.map(label => counts[label]),
            backgroundColor: '#42A5F5'
          }
        ]
      }
    }
  }
  </script>
  