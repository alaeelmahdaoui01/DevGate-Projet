<template>
  <div class="projects-container">
    <div class="projects-header">
      <div class="c">
        <h2 class="text-2xl font-bold">Projects per month</h2></div>
      <div class="projects-decoration"></div>
    </div>
    <div class="chart-wrapper">
      <ChartComponent :chartData="projectData" :chartOptions="options" />
    </div>
  </div>
</template>

<script>
import ChartComponent from '@/components/ChartComponent.vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/Firebase/config.js'

export default {
  components: { ChartComponent },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      projectData: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false 
          },
          title: { 
            display: true, 
            text: 'Projects Created per Month',
            color: '#475569',
            font: {
              size: 16,
              weight: '600'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(226, 232, 240, 0.5)'
            },
            ticks: {
              color: '#64748b',
              stepSize: 1
            },
            title: {
              display: true,
              text: 'Number of Projects',
              color: '#475569',
              font: {
                weight: '600'
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#64748b'
            }
          }
        },
        elements: {
          bar: {
            borderRadius: 6,
            borderWidth: 0
          }
        }
      }
    }
  },
  async mounted() {
    const q = query(collection(db, "projects"), where("createdBy", "==", this.userId))
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
          backgroundColor: '#3b82f6',
          hoverBackgroundColor: '#2563eb',
          borderColor: '#2563eb',
          borderWidth: 0,
          borderRadius: 6
        }
      ]
    }
  }
}
</script>

<style scoped>
.projects-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out forwards;
}

.projects-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
  animation: rainbow 8s linear infinite;
  background-size: 400% 100%;
}

.projects-header {
  margin-bottom: 1.5rem;
  position: relative;
}

.projects-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.projects-decoration {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #6366f1);
  border-radius: 2px;
  margin-bottom: 1rem;
}

.chart-wrapper {
  height: 350px;
  position: relative;
}

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .projects-container {
    padding: 1.5rem;
  }
  
  .projects-header h2 {
    font-size: 1.5rem;
  }
  
  .chart-wrapper {
    height: 300px;
  }
}

.text-2xl.font-bold {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  position: relative;
}


.c{
  text-align : left ;
}

</style>